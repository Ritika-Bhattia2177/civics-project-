import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  const loadIssue = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/issues?scope=public');
      const found = (data.issues || []).find((it) => it._id === id);
      if (!found) {
        setIssue(null);
      } else {
        setIssue(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssue();
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    socket.on('issue:updated', (payload) => {
      if (!payload) return;
      const incoming = payload.issue || {};
      if (incoming._id === id) loadIssue();
    });
    return () => socket.disconnect();
  }, [id]);

  const images = useMemo(() => {
    if (!issue) return [];
    if (!issue.image) return [];
    if (Array.isArray(issue.image)) return issue.image;
    if (typeof issue.image === 'string' && issue.image.includes(',')) return issue.image.split(',');
    return [issue.image];
  }, [issue]);

  const isUpvoted = useMemo(() => {
    if (!issue || !user) return false;
    return (issue.upvotes || []).some((u) => String(u) === String(user._id));
  }, [issue, user]);

  const handleUpvote = async () => {
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post(`/issues/${id}/upvote`);
      setIssue(data.issue);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!user) return navigate('/login');
    try {
      const { data } = await api.post(`/issues/${id}/comments`, { text: comment.trim() });
      setIssue(data.issue);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: issue?.title || 'Complaint', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard');
    } catch (err) {
      console.error(err);
      alert('Unable to share link');
    }
  };

  function stepClass(active) {
    return `flex items-center gap-3 ${active ? 'text-gray-900' : 'text-gray-600'}`;
  }

  if (loading) return <div className="p-10 text-center text-gray-600">Loading complaint...</div>;
  if (!issue) return <div className="p-10 text-center text-gray-600">Complaint not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.header initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.2rem] border-2 border-blue-200 bg-white p-6 md:p-8 ">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gray-600">Complaint ID</div>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900">{issue.title}</h1>
            <div className="mt-2 text-gray-700">{issue.category} • {issue.severity || 'Medium'}</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleUpvote} className={`px-4 py-2 rounded-xl ${isUpvoted ? 'bg-civic-500 text-white' : 'bg-blue-50 text-gray-900 border-2 border-blue-200'} font-medium`}>Upvote ({(issue.upvotes || []).length || 0})</button>
            <button onClick={handleShare} className="px-4 py-2 rounded-xl bg-blue-50 text-gray-900 border-2 border-blue-200 font-medium">Share</button>
          </div>
        </div>
      </motion.header>

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2 rounded-2xl border-2 border-blue-200 bg-white p-5 ">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            {images.length ? (
              <div className="w-full h-full relative">
                <img src={images[imageIndex]} alt="issue" className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <button onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)} className="bg-black/40 text-white p-2 rounded-full">◀</button>
                  </div>
                )}
                {images.length > 1 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button onClick={() => setImageIndex((i) => (i + 1) % images.length)} className="bg-black/40 text-white p-2 rounded-full">▶</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-500">No image uploaded</div>
            )}
          </div>

          <div className="mt-5">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="mt-2 text-slate-300 whitespace-pre-line">{issue.description}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 p-4 bg-slate-950/40">
              <div className="text-xs text-slate-400">Location</div>
              <div className="mt-1 text-slate-200">{issue.location?.address || `${issue.location?.lat || '-'}, ${issue.location?.lng || '-'}`}</div>
            </div>

            <div className="rounded-xl border border-white/10 p-4 bg-slate-950/40">
              <div className="text-xs text-slate-400">Reported By</div>
              <div className="mt-1 text-slate-200">{issue.reportedBy?.name || 'Anonymous'}</div>
              <div className="text-sm text-slate-400">{new Date(issue.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold">Comments</h4>
            <div className="mt-3 space-y-3">
              {(issue.comments || []).map((c, idx) => (
                <div key={idx} className="rounded-xl bg-white/3 p-3 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white">{c.user?.name || 'User'}</div>
                    <div className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-1 text-slate-300">{c.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleComment} className="mt-4 flex gap-3">
              <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." className="flex-1 rounded-2xl bg-slate-900/40 border border-white/10 px-4 py-2 outline-none text-slate-200" />
              <button type="submit" className="px-4 py-2 rounded-2xl bg-civic-500 text-white">Post</button>
            </form>
          </div>
        </section>

        <aside className="rounded-2xl border border-white/10 p-5 bg-white/3 shadow-glow">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-400">Live Status</div>
              <div className="mt-3 grid gap-3">
                <div className={stepClass(true)}>
                  <div className="w-8 h-8 rounded-full bg-civic-500 flex items-center justify-center">1</div>
                  <div>
                    <div className="text-sm font-semibold">Reported</div>
                    <div className="text-xs text-slate-400">{new Date(issue.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className={stepClass(issue.status !== 'Pending')}>
                  <div className={`w-8 h-8 rounded-full ${issue.status !== 'Pending' ? 'bg-civic-400' : 'bg-white/6'} flex items-center justify-center`}>2</div>
                  <div>
                    <div className="text-sm font-semibold">Verified</div>
                    <div className="text-xs text-slate-400">{issue.status !== 'Pending' ? new Date(issue.updatedAt).toLocaleString() : 'Pending verification'}</div>
                  </div>
                </div>

                <div className={stepClass(Boolean(issue.assignedTo))}>
                  <div className={`w-8 h-8 rounded-full ${issue.assignedTo ? 'bg-civic-400' : 'bg-white/6'} flex items-center justify-center`}>3</div>
                  <div>
                    <div className="text-sm font-semibold">Assigned</div>
                    <div className="text-xs text-slate-400">{issue.assignedTo ? issue.assignedTo.name : 'Not assigned'}</div>
                  </div>
                </div>

                <div className={stepClass(issue.status === 'Resolved')}>
                  <div className={`w-8 h-8 rounded-full ${issue.status === 'Resolved' ? 'bg-green-500' : 'bg-white/6'} flex items-center justify-center`}>4</div>
                  <div>
                    <div className="text-sm font-semibold">Resolved</div>
                    <div className="text-xs text-slate-400">{issue.status === 'Resolved' ? new Date(issue.updatedAt).toLocaleString() : 'Not resolved yet'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 p-3 bg-slate-950/30">
              <div className="text-xs text-slate-400">Quick Info</div>
              <div className="mt-2 text-sm text-slate-200">Status: <span className="font-medium">{issue.status}</span></div>
              <div className="mt-1 text-sm text-slate-200">Assigned: <span className="font-medium">{issue.assignedTo?.name || '—'}</span></div>
              <div className="mt-1 text-sm text-slate-200">Upvotes: <span className="font-medium">{(issue.upvotes || []).length || 0}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
