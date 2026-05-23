import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', adminCode: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, adminCode: form.adminCode };
      await (mode === 'login' ? login(payload) : register(payload));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <span className="inline-flex px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-200 text-sm text-gray-700">Secure access for citizens and admins</span>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight text-gray-900">Access Civic Routes in a clean, premium experience.</h1>
        <p className="mt-4 text-gray-600 max-w-xl">Use one account to submit complaints, monitor progress, and keep the city informed with live updates.</p>

        <div className="mt-8 rounded-[2rem] border-2 border-blue-200 bg-blue-50 p-6  max-w-xl">
          <div className="text-sm uppercase tracking-[0.3em] text-gray-900">Demo ready</div>
          <div className="mt-2 text-lg font-semibold text-gray-900">What you can show after login</div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <AuthBullet title="Citizen view" text="Submit issues, add images, and track status live." />
            <AuthBullet title="Admin view" text="Update complaints, manage priorities, and review reports." />
            <AuthBullet title="Live updates" text="Socket-powered changes appear instantly across the app." />
            <AuthBullet title="Professional UI" text="Gradient motion cards make the project presentation ready." />
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="rounded-[2rem] border-2 border-blue-200 bg-white p-8 "
      >
        <div className="flex rounded-full bg-gray-100 p-1 border-2 border-blue-200">
          {['login', 'register'].map((item) => (
            <button key={item} type="button" onClick={() => setMode(item)} className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${mode === item ? 'bg-float-100 text-gray-900' : 'text-gray-600'}`}>
              {item === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {mode === 'register' && (
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          )}
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email address" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          {mode === 'register' && (
            <input name="adminCode" value={form.adminCode} onChange={handleChange} placeholder="Admin code (optional)" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          )}
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-civic-500 to-civic-700 py-3 font-semibold transition hover:opacity-90 disabled:opacity-60">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login now' : 'Create account'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function AuthBullet({ title, text }) {
  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-4">
      <div className="font-medium text-gray-900">{title}</div>
      <div className="mt-1 text-xs text-gray-600">{text}</div>
    </div>
  );
}
