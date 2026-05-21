import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [adminLogin, setAdminLogin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login({ email: form.email, password: form.password }, { remember: rememberMe });
      if (adminLogin && user.role !== 'admin') {
        setError('This account is not an admin account. Please use admin credentials.');
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setNotice('Google login UI is ready. Connect OAuth backend/provider to enable it.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <span className="inline-flex px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-200 text-sm text-gray-700">Secure civic access</span>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight text-gray-900">Login to your Civic Routes workspace.</h1>
        <p className="mt-4 text-gray-600 max-w-xl">Track complaints, monitor updates, and coordinate resolutions with a professional dashboard.</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <InfoTag title="Remember me" text="Keep login saved on trusted devices" />
          <InfoTag title="Admin login" text="Switch to authority-level access" />
          <InfoTag title="Forgot password" text="Email-based reset flow is now active" />
          <InfoTag title="Google login" text="OAuth-ready UI setup" />
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="rounded-[2rem] border-2 border-blue-200 bg-white p-8 shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
        <p className="mt-2 text-sm text-gray-600">Access citizen or admin account.</p>

        <div className="mt-6 space-y-4">
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-civic-500" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-civic-600 hover:text-civic-700 transition">Forgot password?</Link>
          </div>

          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input type="checkbox" checked={adminLogin} onChange={(e) => setAdminLogin(e.target.checked)} className="accent-civic-500" />
            Admin Login
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {notice && <div className="text-sm text-amber-600">{notice}</div>}

          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-civic-500 to-civic-700 py-3 font-semibold transition hover:opacity-90 disabled:opacity-60">
            {loading ? 'Please wait...' : 'Login now'}
          </button>

          <button type="button" onClick={handleGoogleLogin} className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50 py-3 font-medium text-gray-900 hover:bg-blue-100 transition">
            Continue with Google
          </button>

          <div className="text-sm text-gray-600 text-center">
            New here? <Link to="/signup" className="text-civic-600 hover:text-civic-700">Create account</Link>
          </div>
        </div>
      </motion.form>
    </div>
  );
}

function InfoTag({ title, text }) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-xs text-gray-600 mt-1">{text}</div>
    </div>
  );
}
