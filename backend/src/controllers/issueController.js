import Issue from '../models/Issue.js';
import Workspace from '../models/Workspace.js';

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

    const { title, description, status, priority, assignee } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const issue = await Issue.create({
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      createdBy: req.user._id,
      workspace: req.params.workspaceId,
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email');

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

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email');

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