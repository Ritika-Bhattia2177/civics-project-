import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'civic-routes-secret', { expiresIn: '7d' });

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  city: user.city,
  profilePhoto: user.profilePhoto,
  role: user.role,
});

export const registerUser = async (req, res) => {
  const { name, email, password, adminCode, phone, city, profilePhoto } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = adminCode && adminCode === process.env.ADMIN_CODE ? 'admin' : 'citizen';

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone: phone || '',
    city: city || '',
    profilePhoto: profilePhoto || '',
    role,
  });
  res.status(201).json({ user: formatUser(user), token: signToken(user._id) });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ user: formatUser(user), token: signToken(user._id) });
};

export const getMe = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: 'If the email exists, a reset link has been sent.' });
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15);
  await user.save();

  const clientBase = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetLink = `${clientBase}/reset-password/${rawToken}`;
  console.log(`Password reset link for ${user.email}: ${resetLink}`);

  res.json({
    message: 'Password reset email has been queued.',
    resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined,
  });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = '';
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: 'Password reset successful. You can now log in.' });
};

export const updateProfile = async (req, res) => {
  const { name, phone, city, profilePhoto } = req.body;
  const user = req.user;
  if (!user) return res.status(401).json({ message: 'Not authorized' });

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.city = city ?? user.city;
  user.profilePhoto = profilePhoto ?? user.profilePhoto;

  await user.save();
  res.json({ user: formatUser(user) });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new passwords are required' });
  if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(401).json({ message: 'Not authorized' });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated successfully' });
};
