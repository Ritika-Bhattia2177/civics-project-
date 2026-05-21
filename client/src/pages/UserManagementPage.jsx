import { useEffect, useState } from 'react';
import api from '../api';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const { data } = await api.get('/users');
    setUsers(data.users || []);
  };

  useEffect(() => { load(); }, []);

  const toggleBlock = async (u) => {
    await api.patch(`/users/${u._id}/block`, { block: !u.isBlocked });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl p-6 bg-white border-2 border-blue-200 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-600 bg-gray-50">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Blocked</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-200">
                  <td className="px-3 py-2 text-gray-900">{u.name}</td>
                  <td className="px-3 py-2 text-gray-900">{u.email}</td>
                  <td className="px-3 py-2 text-gray-900">{u.role}</td>
                  <td className="px-3 py-2 text-gray-900">{u.isBlocked ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <button onClick={() => toggleBlock(u)} className="px-2 py-1 rounded-md bg-amber-500 text-white font-medium hover:bg-amber-600">{u.isBlocked ? 'Unblock' : 'Block'}</button>
                    <select defaultValue={u.role} onChange={(e) => api.patch(`/users/${u._id}/role`, { role: e.target.value }).then(load)} className="rounded-md bg-blue-100 border-2 border-blue-200 px-2 py-1 text-gray-900">
                      <option value="citizen">citizen</option>
                      <option value="admin">admin</option>
                    </select>
                    <button onClick={() => window.open(`/admin/user/${u._id}/reports`, '_blank')} className="px-2 py-1 rounded-md bg-blue-100 border-2 border-blue-200 text-gray-900 font-medium hover:bg-blue-200">Reports</button>
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
