import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

const statusOptions = ['All', 'Pending', 'In Progress', 'Resolved'];
const severityOptions = ['All', 'Low', 'Medium', 'High', 'Emergency'];

export default function MyComplaintsPage() {
  const [issues, setIssues] = useState([]);
  const [view, setView] = useState('card');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const loadIssues = async () => {
    const { data } = await api.get('/issues/mine');
    setIssues(data.issues || []);
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const filteredIssues = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    let result = [...issues].filter((item) => {
      const searchHit =
        !normalized ||
        item.title?.toLowerCase().includes(normalized) ||
        item.category?.toLowerCase().includes(normalized) ||
        item._id?.toLowerCase().includes(normalized);

      const statusHit = status === 'All' || item.status === status;
      const severityHit =
        severity === 'All' ||
        (item.severity || 'Medium') === severity;

      return searchHit && statusHit && severityHit;
    });

    if (sortBy === 'newest')
      result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    if (sortBy === 'oldest')
      result.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

    return result;
  }, [issues, search, status, severity, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] bg-gradient-to-r from-blue-700 to-blue-900 p-8 md:p-10 shadow-xl text-white"
      >
        <h1 className="text-4xl sm:text-5xl font-bold">
          My Complaints
        </h1>

        <p className="mt-4 text-blue-100 text-lg">
          Track all your civic complaints with filter,
          search, and sort controls.
        </p>
      </motion.section>

      {/* Filters */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-200"
      >
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, category, or ID"
            className="xl:col-span-2 rounded-2xl bg-white border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl bg-white border border-gray-300 px-4 py-3 text-gray-700"
          >
            {statusOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded-2xl bg-white border border-gray-300 px-4 py-3 text-gray-700"
          >
            {severityOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl bg-white border border-gray-300 px-4 py-3 text-gray-700"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>

        {/* View Buttons */}
        <div className="mt-5 flex gap-3">

          <button
            type="button"
            onClick={() => setView('card')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              view === 'card'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Card View
          </button>

          <button
            type="button"
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              view === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Table View
          </button>
        </div>
      </motion.section>

      {/* Card View */}
      {view === 'card' ? (
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredIssues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition"
            >
              <div className="flex items-start justify-between">

                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
                    Complaint ID
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {shortId(issue._id)}
                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  {issue.status}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {issue.title}
              </h3>

              <div className="mt-2 text-sm text-gray-500">
                {issue.category} • {issue.severity || 'Medium'}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Info
                  label="Date"
                  value={formatDate(issue.createdAt)}
                />

                <Info
                  label="Assigned"
                  value={issue.assignedTo?.name || 'Unassigned'}
                />
              </div>
            </div>
          ))}

          {!filteredIssues.length && (
            <div className="text-gray-500">
              No complaints found.
            </div>
          )}
        </section>
      ) : (
        <section className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-lg">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-5 py-4">Complaint ID</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-left px-5 py-4">Severity</th>
                  <th className="text-left px-5 py-4">Date</th>
                  <th className="text-left px-5 py-4">Assigned</th>
                </tr>
              </thead>

              <tbody>
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="border-t border-gray-200"
                  >
                    <td className="px-5 py-4 text-gray-700">
                      {shortId(issue._id)}
                    </td>

                    <td className="px-5 py-4">
                      {issue.status}
                    </td>

                    <td className="px-5 py-4">
                      {issue.severity || 'Medium'}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(issue.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {issue.assignedTo?.name || 'Unassigned'}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </section>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.2em] text-gray-400">
        {label}
      </div>

      <div className="mt-1 text-gray-700 text-sm font-medium">
        {value}
      </div>
    </div>
  );
}

function shortId(value) {
  if (!value) return '-';
  return `#${String(value).slice(-8).toUpperCase()}`;
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}