import Issue from '../models/Issue.js';

// @desc    Get all issues
// @route   GET /api/issues
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('createdBy', 'name email')
      .populate('assignee', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single issue
// @route   GET /api/issues/:id
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

// @desc    Create a new issue
// @route   POST /api/issues
export const createIssue = async (req, res) => {
  try {
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
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an issue
// @route   PUT /api/issues/:id
export const updateIssue = async (req, res) => {
  try {
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

    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an issue
// @route   DELETE /api/issues/:id
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    await issue.deleteOne();

    res.status(200).json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};