import Department from '../models/Department.js';
import Issue from '../models/Issue.js';

export const getDepartments = async (req, res) => {
  const depts = await Department.find().populate('workers', 'name email role');
  res.json({ departments: depts });
};

export const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Department name required' });

  const existing = await Department.findOne({ name });
  if (existing) return res.status(400).json({ message: 'Department already exists' });

  const dept = await Department.create({ name, description });
  res.status(201).json({ department: dept });
};

export const updateDepartment = async (req, res) => {
  const { name, description } = req.body;
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });

  dept.name = name ?? dept.name;
  dept.description = description ?? dept.description;
  await dept.save();
  res.json({ department: dept });
};

export const deleteDepartment = async (req, res) => {
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });

  await dept.deleteOne();
  res.json({ message: 'Department deleted' });
};

export const addWorker = async (req, res) => {
  const { userId } = req.body;
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });

  if (!dept.workers.includes(userId)) {
    dept.workers.push(userId);
    await dept.save();
  }

  const populated = await dept.populate('workers', 'name email role');
  res.json({ department: populated });
};

export const removeWorker = async (req, res) => {
  const { userId } = req.body;
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });

  dept.workers = dept.workers.filter((id) => id.toString() !== userId);
  await dept.save();

  const populated = await dept.populate('workers', 'name email role');
  res.json({ department: populated });
};

export const assignIssueToDepartment = async (req, res) => {
  const { issueId } = req.body;
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: 'Department not found' });

  const issue = await Issue.findById(issueId);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  issue.department = dept._id;
  await issue.save();

  dept.issueCount = await Issue.countDocuments({ department: dept._id });
  await dept.save();

  res.json({ issue, message: 'Issue assigned to department' });
};
