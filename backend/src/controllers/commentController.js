import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import Workspace from '../models/Workspace.js';
import Notification from '../models/Notification.js';

const isMember = (workspace, userId) => {
  return workspace.members.some(
    (m) => m.user.toString() === userId.toString()
  );
};

// @desc    Get all comments for an issue
// @route   GET /api/workspaces/:workspaceId/issues/:issueId/comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.issueId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a comment on an issue
// @route   POST /api/workspaces/:workspaceId/issues/:issueId/comments
export const createComment = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (!isMember(workspace, req.user._id)) {
      return res.status(403).json({ message: 'Not a member of this workspace' });
    }

    const issue = await Issue.findById(req.params.issueId)
      .populate('createdBy', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const { body } = req.body;

    if (!body?.trim()) {
      return res.status(400).json({ message: 'Comment body is required' });
    }

    const comment = await Comment.create({
      body,
      author: req.user._id,
      issue: req.params.issueId,
      workspace: req.params.workspaceId,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email');

    // Notify issue creator if commenter is not the creator
    if (
      issue.createdBy._id.toString() !== req.user._id.toString()
    ) {
      const notification = await Notification.create({
        recipient: issue.createdBy._id,
        actor: req.user._id,
        type: 'issue_updated',
        issue: issue._id,
        workspace: req.params.workspaceId,
        message: `${req.user.name} commented on "${issue.title}"`,
      })

      const populatedNotification = await Notification.findById(notification._id)
        .populate('actor', 'name email')
        .populate('issue', 'title')
        .populate('workspace', 'name')

      const io = req.app.get('io');
      io.emit(`notification:${issue.createdBy._id}`, populatedNotification);
    }

    // Notify assignee if different from commenter and creator
    if (
      issue.assignee &&
      issue.assignee.toString() !== req.user._id.toString() &&
      issue.assignee.toString() !== issue.createdBy._id.toString()
    ) {
      const notification = await Notification.create({
        recipient: issue.assignee,
        actor: req.user._id,
        type: 'issue_updated',
        issue: issue._id,
        workspace: req.params.workspaceId,
        message: `${req.user.name} commented on "${issue.title}"`,
      })

      const populatedNotification = await Notification.findById(notification._id)
        .populate('actor', 'name email')
        .populate('issue', 'title')
        .populate('workspace', 'name')

      const io = req.app.get('io');
      io.emit(`notification:${issue.assignee}`, populatedNotification);
    }

    const io = req.app.get('io');
    io.emit(
      `comment:created:${req.params.issueId}`,
      populatedComment
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/workspaces/:workspaceId/issues/:issueId/comments/:id
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    const io = req.app.get('io');
    io.emit(`comment:deleted:${req.params.issueId}`, req.params.id);

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};