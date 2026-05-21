import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResetLink('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message || 'Reset link sent to your email.');
      if (data.resetLink) setResetLink(data.resetLink);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow">
        <h1 className="text-3xl sm:text-4xl font-bold">Forgot Password</h1>
        <p className="mt-3 text-slate-300">Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full rounded-2xl bg-slate-950/60 border border-white/10 px-4 py-3 outline-none focus:border-civic-400"
          />
          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-civic-500 to-civic-700 py-3 font-semibold hover:opacity-90 transition disabled:opacity-60">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {error && <div className="mt-4 text-sm text-rose-300">{error}</div>}
        {message && <div className="mt-4 text-sm text-emerald-300">{message}</div>}
        {resetLink && (
          <a href={resetLink} className="mt-4 block text-sm text-civic-200 hover:text-civic-100 transition">
            Open reset link (development)
          </a>
        )}

        <div className="mt-6 text-sm text-slate-400">
          Back to <Link to="/login" className="text-civic-200 hover:text-civic-100">Login</Link>
        </div>
      </motion.div>
    </div>
  );
}
