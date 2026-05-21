import User from '../models/User.js';
import Issue from '../models/Issue.js';

export const getUsers = async (req, res) => {
  const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
  res.json({ users });
};

export const blockUser = async (req, res) => {
  const { id } = req.params;
  const { block } = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isBlocked = !!block;
  await user.save();
  res.json({ user: { id: user._id, isBlocked: user.isBlocked } });
};

export const changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!['citizen', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  res.json({ user: { id: user._id, role: user.role } });
};

export const getUserReports = async (req, res) => {
  const { id } = req.params;
  const issues = await Issue.find({ reportedBy: id }).sort({ createdAt: -1 });
  res.json({ issues });
};
