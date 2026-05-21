import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: '' },
    resetPasswordExpires: { type: Date, default: null },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
