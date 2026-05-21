import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(data.message || 'Password updated successfully');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow">
        <h1 className="text-3xl sm:text-4xl font-bold">Reset Password</h1>
        <p className="mt-3 text-slate-300">Set a new secure password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            required
            className="w-full rounded-2xl bg-slate-950/60 border border-white/10 px-4 py-3 outline-none focus:border-civic-400"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="w-full rounded-2xl bg-slate-950/60 border border-white/10 px-4 py-3 outline-none focus:border-civic-400"
          />
          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-civic-500 to-civic-700 py-3 font-semibold hover:opacity-90 transition disabled:opacity-60">
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>

        {error && <div className="mt-4 text-sm text-rose-300">{error}</div>}
        {message && <div className="mt-4 text-sm text-emerald-300">{message}</div>}

        <div className="mt-6 text-sm text-slate-400">
          Return to <Link to="/login" className="text-civic-200 hover:text-civic-100">Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
