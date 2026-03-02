import Workspace from '../models/Workspace.js';

// Generate identifier from workspace name
const generateIdentifier = (name) => {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    return words[0].substring(0, 4).toUpperCase()
  }
  return words.map((w) => w[0]).join('').substring(0, 5).toUpperCase()
}

// @desc    Create a new workspace
// @route   POST /api/workspaces
export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    const identifier = generateIdentifier(name)

    const workspace = await Workspace.create({
      name,
      identifier,
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

    const workspace = await Workspace.findOne({ inviteCode });

    if (!workspace) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this workspace' });
    }

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