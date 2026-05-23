import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ManageComplaintsPage() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [filter, setFilter] = useState('All');

  const load = async () => {
    const [{ data: issuesData }, { data: deptData }] = await Promise.all([
      api.get('/issues?scope=all'),
      api.get('/departments'),
    ]);
    setIssues(issuesData.issues || []);
    setDepartments(deptData.departments || []);
  };

  useEffect(() => { load(); }, []);

  const toggle = (id) => {
    setSelected((s) => {
      const copy = new Set(s);
      if (copy.has(id)) copy.delete(id); else copy.add(id);
      return copy;
    });
  };

  const bulkDelete = async () => {
    if (!confirm('Delete selected complaints?')) return;
    await Promise.all(Array.from(selected).map((id) => api.delete(`/issues/${id}`)));
    setSelected(new Set());
    load();
  };

  const changeStatus = async (id, status) => {
    await api.patch(`/issues/${id}/status`, { status });
    load();
  };

  const assignTo = async (id, userId) => {
    await api.patch(`/issues/${id}/assign`, { userId });
    load();
  };

  const assignDepartment = async (id, deptId) => {
    await api.post(`/departments/${deptId}/assign-issue`, { issueId: id });
    load();
  };

  const filtered = useMemo(() => (filter === 'All' ? issues : issues.filter((i) => i.status === filter)), [issues, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl border-2 border-blue-200 p-6 bg-white ">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Manage Complaints</h2>
          <div className="flex items-center gap-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl bg-blue-100 border-2 border-blue-200 px-3 py-2 text-gray-900">
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
            <button onClick={bulkDelete} className="px-3 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700">Bulk delete</button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-600 bg-gray-50">
              <tr>
                <th className="px-3 py-2">Select</th>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Assigned</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i._id} className="border-t border-gray-200">
                  <td className="px-3 py-2"><input type="checkbox" checked={selected.has(i._id)} onChange={() => toggle(i._id)} /></td>
                  <td className="px-3 py-2 text-gray-900">#{String(i._id).slice(-8).toUpperCase()}</td>
                  <td className="px-3 py-2 text-gray-900">{i.title}</td>
                  <td className="px-3 py-2 text-gray-900">{i.status}</td>
                  <td className="px-3 py-2">
                    <select defaultValue={i.department?._id || ''} onChange={(e) => assignDepartment(i._id, e.target.value)} className="rounded-md bg-blue-100 border-2 border-blue-200 px-2 py-1 text-xs text-gray-900">
                      <option value="">No dept</option>
                      {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-gray-900">{i.assignedTo?.name || '—'}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <select defaultValue="" onChange={(e) => changeStatus(i._id, e.target.value)} className="rounded-md bg-blue-100 border-2 border-blue-200 px-2 py-1 text-xs text-gray-900">
                      <option value="">Set status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <input placeholder="Assignee" className="rounded-md bg-blue-100 border-2 border-blue-200 px-2 py-1 text-xs w-20 text-gray-900 placeholder-gray-600" onKeyDown={(e) => { if (e.key === 'Enter') { assignTo(i._id, e.target.value); e.currentTarget.value = ''; } }} />
                    <button onClick={async () => { if (confirm('Delete this complaint?')) { await api.delete(`/issues/${i._id}`); load(); } }} className="px-2 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
