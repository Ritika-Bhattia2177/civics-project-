import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // load recent server-side notifications if available (fallback to live only)
    // subscribe socket
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

    const push = (note) => setNotifications((s) => [note, ...s].slice(0, 200));

    socket.on('issue:updated', (payload) => {
      if (!payload) return;
      const type = payload.type;
      const issue = payload.issue || {};

      // Build friendly notifications
      if (type === 'status') {
        push({ id: Date.now() + Math.random(), type: 'status', text: `Status updated: ${issue.title} → ${issue.status}`, url: `/complaint/${issue._id}`, time: new Date() });
      }

      if (type === 'comment') {
        const last = (issue.comments || []).slice(-1)[0];
        push({ id: Date.now() + Math.random(), type: 'comment', text: `New comment on: ${issue.title} — "${last?.text?.slice(0, 80)}"`, url: `/complaint/${issue._id}`, time: new Date() });
      }

      if (type === 'created') {
        // notify if assigned to current user
        if (issue.assignedTo && user && String(issue.assignedTo._id || issue.assignedTo) === String(user._id)) {
          push({ id: Date.now() + Math.random(), type: 'assigned', text: `You were assigned: ${issue.title}`, url: `/complaint/${issue._id}`, time: new Date() });
        }
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const markRead = (id) => setNotifications((s) => s.filter((n) => n.id !== id));
  const clearAll = () => setNotifications([]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-slate-400">Real-time updates for assignments, status changes, and comments.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={clearAll} className="px-3 py-2 rounded-lg bg-white/5 text-slate-200">Clear all</button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {notifications.length === 0 && <div className="text-slate-400">No notifications yet.</div>}
          {notifications.map((n) => (
            <div key={n.id} className="rounded-xl p-3 bg-slate-950/40 border border-white/6 flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-200">{n.text}</div>
                <div className="text-xs text-slate-400 mt-1">{new Date(n.time).toLocaleString()}</div>
                {n.url && <div className="mt-2"><Link to={n.url} className="text-civic-400">Open</Link></div>}
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => markRead(n.id)} className="px-3 py-1 rounded-md bg-white/5">Mark</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
