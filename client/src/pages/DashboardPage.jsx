import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import IssueCard from '../components/IssueCard';

const categories = ['Potholes', 'Garbage', 'Water Leakage', 'Broken Streetlights', 'Road Damage'];
const statusOptions = ['Pending', 'In Progress', 'Resolved'];

export default function DashboardPage({ issues, refreshIssues }) {
  const { user } = useAuth();
  const [mine, setMine] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: categories[0], image: '', address: '', lat: '', lng: '' });
  const [message, setMessage] = useState('');

  const loadMine = async () => {
    const { data } = await api.get('/issues/mine');
    setMine(data.issues);
  };

  useEffect(() => {
    loadMine();
  }, []);

  const visibleIssues = useMemo(() => (user?.role === 'admin' ? issues : mine), [issues, mine, user]);
  const pendingCount = visibleIssues.filter((item) => item.status === 'Pending').length;
  const progressCount = visibleIssues.filter((item) => item.status === 'In Progress').length;
  const resolvedCount = visibleIssues.filter((item) => item.status === 'Resolved').length;
  const totalUpvotes = visibleIssues.reduce((sum, item) => sum + (item.upvotes?.length || 0), 0);
  const avgVotes = visibleIssues.length ? (totalUpvotes / visibleIssues.length).toFixed(1) : '0.0';
  const resolutionRate = visibleIssues.length ? Math.round((resolvedCount / visibleIssues.length) * 100) : 0;
  const topCategory = visibleIssues.reduce((acc, item) => {
    if (!item?.category) return acc;
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  const leadingCategory = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const categoryBars = Object.entries(topCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));
  const recentIssues = [...visibleIssues].slice(0, 3);
  const timelineItems = [...visibleIssues]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 6)
    .map((item) => ({
      id: item._id,
      title: item.title,
      status: item.status,
      time: item.updatedAt || item.createdAt,
    }));

  const progressChart = [
    {
      label: 'Pending',
      value: pendingCount,
      percent: visibleIssues.length ? Math.round((pendingCount / visibleIssues.length) * 100) : 0,
      tone: 'from-slate-400 to-slate-200',
    },
    {
      label: 'In Progress',
      value: progressCount,
      percent: visibleIssues.length ? Math.round((progressCount / visibleIssues.length) * 100) : 0,
      tone: 'from-amber-500 to-amber-300',
    },
    {
      label: 'Resolved',
      value: resolvedCount,
      percent: visibleIssues.length ? Math.round((resolvedCount / visibleIssues.length) * 100) : 0,
      tone: 'from-emerald-500 to-emerald-300',
    },
  ];

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const submitIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/issues', {
        ...form,
        location: { address: form.address, lat: form.lat, lng: form.lng },
      });
      setForm({ title: '', description: '', category: categories[0], image: '', address: '', lat: '', lng: '' });
      await Promise.all([refreshIssues(), loadMine()]);
      setMessage('Issue reported successfully.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (issueId, status) => {
    await api.patch(`/issues/${issueId}/status`, { status });
    await Promise.all([refreshIssues(), loadMine()]);
  };

  const upvote = async (issueId) => {
    await api.post(`/issues/${issueId}/upvote`);
    await Promise.all([refreshIssues(), loadMine()]);
  };

  const addComment = async (issueId, text) => {
    if (!text.trim()) return;
    await api.post(`/issues/${issueId}/comments`, { text });
    await Promise.all([refreshIssues(), loadMine()]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50 to-white p-6 md:p-8 shadow-lg"
      >
        <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-blue-300 bg-blue-100 px-4 py-2 text-sm text-blue-700 font-medium">
              Civic Routes workspace • {user?.role === 'admin' ? 'Authority command center' : 'Citizen reporting space'}
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              {user?.role === 'admin' ? 'Resolve city issues with clarity and speed.' : 'Track your civic complaints with confidence.'}
            </h1>
            <p className="mt-4 max-w-2xl text-gray-600">
              A premium civic operations dashboard designed for reporting, prioritizing, and managing complaints with a polished product feel.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border-2 border-blue-200 bg-blue-50 px-4 py-2 text-gray-700 font-medium">Pending {pendingCount}</span>
              <span className="rounded-full border-2 border-blue-200 bg-blue-50 px-4 py-2 text-gray-700 font-medium">In progress {progressCount}</span>
              <span className="rounded-full border-2 border-blue-200 bg-blue-50 px-4 py-2 text-gray-700 font-medium">Resolved {resolvedCount}</span>
              <span className="rounded-full border-2 border-blue-200 bg-blue-50 px-4 py-2 text-gray-700 font-medium">Resolution rate {resolutionRate}%</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <GlassMetric label="Total issues" value={visibleIssues.length} hint="Current workload" />
            <GlassMetric label="Average upvotes" value={avgVotes} hint="Community interest" />
            <GlassMetric label="Top category" value={leadingCategory} hint="Most reported issue" />
            <GlassMetric label="Live mode" value="On" hint="Socket-backed updates" />
          </div>
        </div>
      </motion.section>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="text-sm text-civic-600 uppercase tracking-[0.3em]">{user?.role} dashboard</div>
          <h1 className="mt-3 text-4xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">Manage complaints, monitor service quality, and present a clean civic operations workflow with a more professional product feel.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
          <StatMini label="Total Complaints" value={visibleIssues.length} />
          <StatMini label="Pending Issues" value={pendingCount} />
          <StatMini label="Resolved Issues" value={resolvedCount} />
          <StatMini label="Upvotes Received" value={totalUpvotes} />
        </div>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-4">
        <InfoCard label="In progress" value={progressCount} note="Active complaints under review" />
        <InfoCard label="Upvotes" value={totalUpvotes} note="Community attention and priority" />
        <InfoCard label="Top category" value={leadingCategory} note="Most reported civic concern" />
        <InfoCard label="Resolution rate" value={`${resolutionRate}%`} note="Overall closure performance" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
          <div className="text-sm uppercase tracking-[0.3em] text-civic-600">Issue progress chart</div>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Current complaint status split</h2>
          <div className="mt-6 space-y-5">
            {progressChart.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{item.label}</span>
                  <span>{item.value} ({item.percent}%)</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${item.tone}`} style={{ width: `${Math.max(item.percent, item.value ? 10 : 0)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
          <div className="text-sm uppercase tracking-[0.3em] text-civic-600">Recent activity timeline</div>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Latest complaint movements</h2>

          <div className="mt-6 space-y-4">
            {timelineItems.length ? timelineItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-civic-500 shadow-md" />
                <div className="flex-1 rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-medium">{item.status}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">{formatTime(item.time)}</div>
                </div>
              </div>
            )) : (
              <div className="text-sm text-slate-400">No timeline activity yet.</div>
            )}
          </div>
        </motion.section>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-civic-600">Category insights</div>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">Complaint distribution</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 border-2 border-blue-200 text-blue-700 font-medium">Top 5 categories</span>
          </div>

          <div className="mt-6 space-y-4">
            {categoryBars.length ? categoryBars.map((item) => {
              const percent = visibleIssues.length ? Math.max(12, Math.round((item.value / visibleIssues.length) * 100)) : 12;
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-civic-500 to-civic-300 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            }) : (
              <div className="text-sm text-gray-500">No category data yet.</div>
            )}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-civic-600">Quick actions</div>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">Recommended next steps</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 border-2 border-blue-200 text-blue-700 font-medium">Smart actions</span>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <ActionTile title="Report issue" text="Submit a new complaint with image and location." />
            <ActionTile title="Review status" text="Check pending items and prioritize response." />
            <ActionTile title="Track trends" text="See which civic issues are being reported most." />
            <ActionTile title="Close cases" text="Move resolved complaints out of the active queue." />
          </div>
        </motion.section>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-civic-600">Workflow overview</div>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">Complaint pipeline at a glance</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 border-2 border-blue-200 text-blue-700 font-medium">Professional summary</span>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <StageBlock title="Pending" count={pendingCount} tone="slate" />
            <StageBlock title="In Progress" count={progressCount} tone="amber" />
            <StageBlock title="Resolved" count={resolvedCount} tone="emerald" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
          <div className="text-sm uppercase tracking-[0.3em] text-civic-600">Recent activity</div>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Latest civic reports</h2>
          <div className="mt-5 space-y-3">
            {recentIssues.map((issue) => (
              <div key={issue._id} className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900">{issue.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{issue.category} • {issue.location?.address || 'Location pending'}</div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 border-2 border-blue-200 text-blue-700 font-medium">{issue.status}</span>
                </div>
              </div>
            ))}
            {!recentIssues.length && <div className="text-sm text-gray-500">No activity yet.</div>}
          </div>
        </motion.div>
      </div>

      {user?.role !== 'admin' && (
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submitIssue} className="rounded-[2rem] border-2 border-blue-200 bg-white backdrop-blur-2xl p-6 md:p-8 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Report a new civic issue</h2>
              <p className="text-sm text-gray-600 mt-1">Add exact details so the authority can respond faster.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 border-2 border-blue-200 text-blue-700 font-medium">Fast reporting</span>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Issue title" className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 outline-none focus:border-civic-600 text-gray-900 placeholder-gray-500" />
            <select name="category" value={form.category} onChange={handleChange} className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 outline-none focus:border-civic-600 text-gray-900">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the issue" rows="4" className="md:col-span-2 rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 outline-none focus:border-civic-600 text-gray-900 placeholder-gray-500" />
            <input onChange={handleFile} type="file" accept="image/*" className="md:col-span-2 rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-sm text-gray-900" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Location address" className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 outline-none focus:border-civic-600 text-gray-900 placeholder-gray-500" />
            <div className="grid grid-cols-2 gap-4">
              <input name="lat" value={form.lat} onChange={handleChange} placeholder="Latitude" className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 outline-none focus:border-civic-600 text-gray-900 placeholder-gray-500" />
              <input name="lng" value={form.lng} onChange={handleChange} placeholder="Longitude" className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 outline-none focus:border-civic-600 text-gray-900 placeholder-gray-500" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button disabled={loading} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-civic-500 to-civic-700 font-semibold disabled:opacity-60">{loading ? 'Submitting...' : 'Submit Issue'}</button>
            {message && <span className="text-sm text-emerald-300">{message}</span>}
          </div>
          {form.image && <img src={form.image} alt="preview" className="mt-5 h-56 w-full object-cover rounded-3xl border border-white/10" />}
        </motion.form>
      )}

        {user?.role === 'admin' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-civic-200">Authority tools</div>
                <h2 className="mt-2 text-2xl font-semibold">Use this panel for fast municipal coordination</h2>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="px-3 py-1 rounded-full bg-blue-100 border-2 border-blue-200 text-blue-700">Assign crews</span>
                <span className="px-3 py-1 rounded-full bg-blue-100 border-2 border-blue-200 text-blue-700">Update status</span>
                <span className="px-3 py-1 rounded-full bg-blue-100 border-2 border-blue-200 text-blue-700">Track hotspots</span>
              </div>
            </div>
          </motion.div>
        )}

      <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{user?.role === 'admin' ? 'All civic complaints' : 'Your reported complaints'}</h2>
          <div className="grid gap-4">
            {visibleIssues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} onSelect={setSelected} />
            ))}
            {!visibleIssues.length && <div className="text-slate-400">No issues yet.</div>}
          </div>
        </section>

        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 sticky top-28 shadow-md">
          <h2 className="text-2xl font-semibold">Issue details</h2>
          {selected ? (
            <div className="mt-5 space-y-4">
              <img src={selected.image || 'https://images.unsplash.com/photo-1508855396998-93f2f6b44b92?auto=format&fit=crop&w=1200&q=80'} alt="issue" className="h-44 w-full rounded-3xl object-cover border-2 border-blue-200" />
              <div>
                <div className="text-sm text-civic-300 uppercase tracking-[0.3em]">{selected.category}</div>
                <h3 className="mt-2 text-xl font-semibold">{selected.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{selected.description}</p>
              </div>
              <div className="text-sm text-slate-300">{selected.location?.address}</div>
                <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-blue-100 border-2 border-blue-200 text-xs text-blue-700">{selected.status}</span>
                <span className="px-3 py-1 rounded-full bg-blue-100 border-2 border-blue-200 text-xs text-blue-700">▲ {selected.upvotes?.length || 0}</span>
                <span className="px-3 py-1 rounded-full bg-blue-100 border-2 border-blue-200 text-xs text-blue-700">💬 {selected.comments?.length || 0}</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => upvote(selected._id)} className="flex-1 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-3 transition">Upvote</button>
                {user?.role === 'admin' && (
                  <select onChange={(e) => updateStatus(selected._id, e.target.value)} value={selected.status} className="flex-1 rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 outline-none text-gray-900">
                    {statusOptions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                )}
              </div>

              <CommentBox comments={selected.comments || []} onSend={(text) => addComment(selected._id, text)} />
            </div>
          ) : (
            <div className="mt-6 text-slate-400">Select any issue card to see the full activity, upvotes, and comments.</div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

function InfoCard({ label, value, note }) {
  return (
    <div className="rounded-3xl border-2 border-blue-200 bg-white p-5 shadow-md">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-gray-900">{value}</div>
      <div className="mt-2 text-xs text-gray-500">{note}</div>
    </div>
  );
}

function GlassMetric({ label, value, hint }) {
  return (
    <div className="rounded-3xl border-2 border-blue-200 bg-blue-50 backdrop-blur-xl p-5">
      <div className="text-xs uppercase tracking-[0.25em] text-blue-600 font-medium">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-gray-900">{value}</div>
      <div className="mt-2 text-xs text-gray-600">{hint}</div>
    </div>
  );
}

function ActionTile({ title, text }) {
  return (
    <div className="rounded-3xl border-2 border-blue-200 bg-blue-50 p-4 hover:border-civic-600 hover:shadow-md transition">
      <div className="font-medium text-gray-900">{title}</div>
      <div className="mt-2 text-sm text-gray-600">{text}</div>
    </div>
  );
}

function StageBlock({ title, count, tone }) {
  const toneClasses = {
    slate: 'bg-gray-100 border-gray-300 text-gray-700',
    amber: 'bg-amber-100 border-amber-300 text-amber-700',
    emerald: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  };

  return (
    <div className={`rounded-3xl border-2 p-5 ${toneClasses[tone]}`}>
      <div className="text-sm uppercase tracking-[0.25em] font-medium">{title}</div>
      <div className="mt-3 text-3xl font-semibold">{count}</div>
      <div className="mt-2 text-xs opacity-75">Civic status bucket</div>
    </div>
  );
}

function StatMini({ label, value }) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 px-4 py-3 min-w-[84px]">
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}

function CommentBox({ comments, onSend }) {
  const [text, setText] = useState('');
  return (
    <div className="space-y-3">
      <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
        {comments.length ? comments.map((item, index) => (
          <div key={index} className="text-sm rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-700">{item.text || item}</div>
        )) : <div className="text-sm text-gray-500">No comments yet.</div>}
      </div>
      <div className="flex gap-3">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" className="flex-1 rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 outline-none focus:border-civic-600 text-gray-900 placeholder-gray-500" />
        <button type="button" onClick={() => { onSend(text); setText(''); }} className="px-4 py-3 rounded-2xl bg-civic-500 text-white font-medium hover:bg-civic-600 transition">Send</button>
      </div>
    </div>
  );
}

function formatTime(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
  return date.toLocaleString();
}
