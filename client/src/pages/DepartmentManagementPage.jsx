import { useEffect, useState } from 'react';
import api from '../api';

export default function DepartmentManagementPage() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await api.get('/departments');
    setDepartments(data.departments || []);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.patch(`/departments/${editing}`, form);
        setEditing(null);
      } else {
        await api.post('/departments', form);
      }
      setForm({ name: '', description: '' });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete department?')) {
      await api.delete(`/departments/${id}`);
      load();
    }
  };

  const handleEdit = (d) => {
    setForm({ name: d.name, description: d.description });
    setEditing(d._id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl border-2 border-blue-200 p-6 bg-white ">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Department Management</h2>
          {editing && <button onClick={() => { setEditing(null); setForm({ name: '', description: '' }); }} className="px-3 py-1 rounded-md bg-gray-500 text-white font-medium hover:bg-gray-600">Cancel</button>}
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl p-4 bg-blue-50 border-2 border-blue-200 mb-6">
          <div className="grid md:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Department name" className="rounded-md bg-white border-2 border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-500" />
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-md bg-white border-2 border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-500" />
          </div>
          <button type="submit" className="mt-3 px-4 py-2 rounded-md bg-civic-500 text-white font-medium hover:bg-civic-600">{editing ? 'Update' : 'Create'}</button>
        </form>

        <div className="grid md:grid-cols-2 gap-6">
          {departments.map((d) => (
            <div key={d._id} className="rounded-xl border-2 border-blue-200 p-4 bg-blue-50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{d.name}</h3>
                  <p className="text-sm text-gray-600">{d.description}</p>
                  <div className="mt-2 text-xs text-gray-500">Issues: {d.issueCount || 0}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(d)} className="px-2 py-1 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700">Edit</button>
                  <button onClick={() => handleDelete(d._id)} className="px-2 py-1 rounded-md bg-red-600 text-white font-medium hover:bg-red-700">Delete</button>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs font-medium text-gray-700">Workers: {d.workers?.length || 0}</div>
                <div className="text-xs text-gray-600 mt-1 space-y-1">
                  {d.workers?.length ? d.workers.map((w) => <div key={w._id}>{w.name}</div>) : <div>No workers assigned</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
