import Issue from '../models/Issue.js';
import { emitIssueUpdate } from '../socket/index.js';

const populateIssue = () => [
  {
    path: 'reportedBy',
    select: 'name email role',
  },
  {
    path: 'assignedTo',
    select: 'name email role',
  },
];

export const getIssues = async (req, res) => {
  const scope = req.query.scope || 'all';
  const filter = scope === 'public' ? {} : req.user?.role === 'admin' ? {} : { reportedBy: req.user._id };
  const issues = await Issue.find(filter).sort({ createdAt: -1 }).populate(populateIssue());
  res.json({ issues });
};

export const getMyIssues = async (req, res) => {
  const issues = await Issue.find({ reportedBy: req.user._id }).sort({ createdAt: -1 }).populate(populateIssue());
  res.json({ issues });
};

export const createIssue = async (req, res) => {
  const { title, description, category, severity, image, location } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Please complete all required fields' });
  }

  const issue = await Issue.create({
    title,
    description,
    category,
    severity: severity || 'Medium',
    image: image || '',
    location: location || {},
    reportedBy: req.user._id,
  });

  const populated = await issue.populate(populateIssue());
  emitIssueUpdate({ type: 'created', issue: populated });
  res.status(201).json({ issue: populated });
};

export const updateIssueStatus = async (req, res) => {
  const { status } = req.body;
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  issue.status = status;
  await issue.save();
  const populated = await issue.populate(populateIssue());
  emitIssueUpdate({ type: 'status', issue: populated });
  res.json({ issue: populated });
};

export const upvoteIssue = async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  const hasUpvoted = issue.upvotes.some((id) => id.toString() === req.user._id.toString());
  issue.upvotes = hasUpvoted ? issue.upvotes.filter((id) => id.toString() !== req.user._id.toString()) : [...issue.upvotes, req.user._id];
  await issue.save();

  const populated = await issue.populate(populateIssue());
  emitIssueUpdate({ type: 'vote', issue: populated });
  res.json({ issue: populated });
};

export const commentIssue = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text required' });

  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  issue.comments.push({ text, user: req.user._id });
  await issue.save();

  const populated = await issue.populate(populateIssue());
  emitIssueUpdate({ type: 'comment', issue: populated });
  res.json({ issue: populated });
};

export const deleteIssue = async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });
  await issue.deleteOne();
  emitIssueUpdate({ type: 'delete', issueId: req.params.id });
  res.json({ message: 'Issue deleted' });
};

export const getAnalytics = async (_req, res) => {
  const [pending, inProgress, resolved, total] = await Promise.all([
    Issue.countDocuments({ status: 'Pending' }),
    Issue.countDocuments({ status: 'In Progress' }),
    Issue.countDocuments({ status: 'Resolved' }),
    Issue.countDocuments(),
  ]);

  res.json({ stats: { pending, inProgress, resolved, total } });
};

export const assignIssue = async (req, res) => {
  const { userId } = req.body;
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: 'Issue not found' });

  issue.assignedTo = userId || null;
  await issue.save();

  const populated = await issue.populate(populateIssue());
  emitIssueUpdate({ type: 'assigned', issue: populated });
  res.json({ issue: populated });
};
