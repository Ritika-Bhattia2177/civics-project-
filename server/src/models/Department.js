import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    issueCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Department', departmentSchema);
