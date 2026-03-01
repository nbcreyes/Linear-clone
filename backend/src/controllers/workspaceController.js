import Workspace from '../models/Workspace.js';

// @desc    Create a new workspace
// @route   POST /api/workspaces
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    // Create the workspace and add the creator as owner
    const workspace = await Workspace.create({
      name,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'owner' }],
    });

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate('members.user', 'name email')
      .populate('owner', 'name email');

    res.status(201).json(populatedWorkspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a workspace using invite code
// @route   POST /api/workspaces/join
export const joinWorkspace = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    // Find workspace by invite code
    const workspace = await Workspace.findOne({ inviteCode });

    if (!workspace) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Check if user is already a member
    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this workspace' });
    }

    // Add user as a member
    workspace.members.push({ user: req.user._id, role: 'member' });
    await workspace.save();

    const populatedWorkspace = await Workspace.findById(workspace._id)
      .populate('members.user', 'name email')
      .populate('owner', 'name email');

    res.status(200).json(populatedWorkspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a workspace by ID
// @route   GET /api/workspaces/:id
export const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('members.user', 'name email')
      .populate('owner', 'name email');

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    // Check if the requesting user is a member
    const isMember = workspace.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this workspace' });
    }

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all workspaces the current user belongs to
// @route   GET /api/workspaces
export const getUserWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.user._id,
    })
      .populate('members.user', 'name email')
      .populate('owner', 'name email');

    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};