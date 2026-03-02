import Issue from '../models/Issue.js';
import Workspace from '../models/Workspace.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';

// Helper to check if user is a member of a workspace
const isMember = (workspace, userId) => {
  return workspace.members.some(
    (m) => m.user.toString() === userId.toString()
  );
};

// @desc    Get all issues in a workspace
// @route   GET /api/workspaces/:workspaceId/issues
export const getIssues = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (!isMember(workspace, req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this workspace' });
    }

    const issues = await Issue.find({ workspace: req.params.workspaceId })
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single issue
// @route   GET /api/workspaces/:workspaceId/issues/:id
export const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new issue in a workspace
// @route   POST /api/workspaces/:workspaceId/issues
export const createIssue = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (!isMember(workspace, req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this workspace' });
    }

    const { title, description, status, priority, assignee, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Increment issue counter on workspace
    workspace.issueCounter += 1;
    await workspace.save();

    const issueNumber = workspace.issueCounter;
    const issueIdentifier = `${workspace.identifier}-${issueNumber}`;

    const issue = await Issue.create({
      identifier: issueIdentifier,
      number: issueNumber,
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      createdBy: req.user._id,
      workspace: req.params.workspaceId,
      dueDate: dueDate || null,
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email');

    // Log created activity
    await Activity.create({
      actor: req.user._id,
      issue: issue._id,
      workspace: req.params.workspaceId,
      type: 'created',
    })

    // Create notification if issue is assigned to someone else
    if (assignee && assignee !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: assignee,
        actor: req.user._id,
        type: 'issue_assigned',
        issue: issue._id,
        workspace: req.params.workspaceId,
        message: `${req.user.name} assigned you to "${title}"`,
      })

      const populatedNotification = await Notification.findById(notification._id)
        .populate('actor', 'name email')
        .populate('issue', 'title')
        .populate('workspace', 'name')

      const io = req.app.get('io');
      io.emit(`notification:${assignee}`, populatedNotification);
    }

    const io = req.app.get('io');
    io.emit(`issue:created:${req.params.workspaceId}`, populatedIssue);

    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an issue
// @route   PUT /api/workspaces/:workspaceId/issues/:id
export const updateIssue = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (!isMember(workspace, req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this workspace' });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const previousAssignee = issue.assignee?.toString();
    const newAssignee = req.body.assignee;

    // Build activity logs for changed fields
    const activities = []

    if (req.body.status && req.body.status !== issue.status) {
      activities.push({
        actor: req.user._id,
        issue: issue._id,
        workspace: req.params.workspaceId,
        type: 'status_changed',
        from: issue.status,
        to: req.body.status,
      })
    }

    if (req.body.priority && req.body.priority !== issue.priority) {
      activities.push({
        actor: req.user._id,
        issue: issue._id,
        workspace: req.params.workspaceId,
        type: 'priority_changed',
        from: issue.priority,
        to: req.body.priority,
      })
    }

    if (req.body.title && req.body.title !== issue.title) {
      activities.push({
        actor: req.user._id,
        issue: issue._id,
        workspace: req.params.workspaceId,
        type: 'title_changed',
        from: issue.title,
        to: req.body.title,
      })
    }

    if (
      req.body.description !== undefined &&
      req.body.description !== issue.description
    ) {
      activities.push({
        actor: req.user._id,
        issue: issue._id,
        workspace: req.params.workspaceId,
        type: 'description_changed',
        from: null,
        to: null,
      })
    }

    if (req.body.dueDate !== undefined) {
      const oldDate = issue.dueDate
        ? new Date(issue.dueDate).toISOString().split('T')[0]
        : null
      const newDate = req.body.dueDate
        ? new Date(req.body.dueDate).toISOString().split('T')[0]
        : null

      if (oldDate !== newDate) {
        activities.push({
          actor: req.user._id,
          issue: issue._id,
          workspace: req.params.workspaceId,
          type: 'due_date_changed',
          from: oldDate,
          to: newDate,
        })
      }
    }

    if (newAssignee !== undefined && newAssignee !== previousAssignee) {
      activities.push({
        actor: req.user._id,
        issue: issue._id,
        workspace: req.params.workspaceId,
        type: 'assignee_changed',
        from: previousAssignee || null,
        to: newAssignee || null,
      })
    }

    // Save all activity logs
    if (activities.length > 0) {
      await Activity.insertMany(activities)
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email');

    // Create notification if assignee changed
    if (
      newAssignee &&
      newAssignee !== previousAssignee &&
      newAssignee !== req.user._id.toString()
    ) {
      const notification = await Notification.create({
        recipient: newAssignee,
        actor: req.user._id,
        type: 'issue_assigned',
        issue: issue._id,
        workspace: req.params.workspaceId,
        message: `${req.user.name} assigned you to "${issue.title}"`,
      })

      const populatedNotification = await Notification.findById(notification._id)
        .populate('actor', 'name email')
        .populate('issue', 'title')
        .populate('workspace', 'name')

      const io = req.app.get('io');
      io.emit(`notification:${newAssignee}`, populatedNotification);
    }

    const io = req.app.get('io');
    io.emit(`issue:updated:${req.params.workspaceId}`, updatedIssue);

    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an issue
// @route   DELETE /api/workspaces/:workspaceId/issues/:id
export const deleteIssue = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (!isMember(workspace, req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this workspace' });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await issue.deleteOne();

    const io = req.app.get('io');
    io.emit(`issue:deleted:${req.params.workspaceId}`, req.params.id);

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};