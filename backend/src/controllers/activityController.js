import Activity from '../models/Activity.js';

// @desc    Get all activity for an issue
// @route   GET /api/workspaces/:workspaceId/issues/:issueId/activity
export const getActivity = async (req, res) => {
  try {
    const activity = await Activity.find({ issue: req.params.issueId })
      .populate('actor', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};