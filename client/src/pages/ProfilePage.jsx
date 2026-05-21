import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.city || '', profilePhoto: user?.profilePhoto || '' });
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      setMsg('Profile updated');
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(pwd);
      setMsg('Password changed successfully');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.message || 'Failed to change password');
    }
  };

  // Simple achievements and score derived locally
  const achievements = [
    { key: 'reporter', label: 'First Report', unlocked: true },
    { key: 'resolver', label: 'Resolved Issue', unlocked: false },
    { key: 'community', label: 'Top Upvoter', unlocked: (user?.upvotesCount || 0) > 10 },
  ];
  const contributionScore = ((user?.reportsCount || 0) * 3) + ((user?.upvotesCount || 0) * 1) + ((user?.resolvedCount || 0) * 5);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-blue-200 p-6 bg-white shadow-md">
        <div className="flex items-center gap-4">
          <img src={form.profilePhoto || '/avatar-placeholder.png'} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-blue-200" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <div className="text-gray-600">{user?.email}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm text-gray-600">Contribution Score</div>
            <div className="text-3xl font-extrabold text-gray-900">{contributionScore}</div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm text-gray-700">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 rounded-xl bg-blue-50 border-2 border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 rounded-xl bg-blue-50 border-2 border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-700">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full mt-1 rounded-xl bg-blue-50 border-2 border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Profile Photo (URL)</label>
              <input value={form.profilePhoto} onChange={(e) => setForm({ ...form, profilePhoto: e.target.value })} className="w-full mt-1 rounded-xl bg-blue-50 border-2 border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-500" />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-civic-500 text-white font-medium hover:bg-civic-600 disabled:opacity-60">Save profile</button>
              <div className="text-sm text-gray-600">{msg}</div>
            </div>
          </form>

          <div>
            <div className="rounded-xl border-2 border-blue-200 p-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {achievements.map((a) => (
                  <div key={a.key} className={`flex items-center gap-3 p-2 rounded-lg ${a.unlocked ? 'bg-white border-2 border-blue-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.unlocked ? 'bg-amber-400 text-black' : 'bg-gray-200 text-gray-400'}`}>{a.unlocked ? '🏅' : '•'}</div>
                    <div>
                      <div className="text-sm text-gray-900 font-medium">{a.label}</div>
                      <div className="text-xs text-gray-600">{a.unlocked ? 'Unlocked' : 'Locked'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl border-2 border-blue-200 p-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <form onSubmit={handleChangePassword} className="mt-3 space-y-3">
                <input placeholder="Current password" type="password" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} className="w-full rounded-xl bg-white border-2 border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-500" />
                <input placeholder="New password" type="password" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} className="w-full rounded-xl bg-white border-2 border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-500" />
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600">Change password</button>
              </form>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
