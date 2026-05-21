import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    profilePhoto: '',
    adminCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, profilePhoto: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form, { remember: true });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-center">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <span className="inline-flex px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-200 text-sm text-gray-700">Citizen onboarding</span>
        <h1 className="mt-6 text-4xl sm:text-5xl font-bold leading-tight text-gray-900">Create your Civic Routes account.</h1>
        <p className="mt-4 text-gray-600 max-w-xl">Start reporting civic issues with complete profile details for better city-level coordination.</p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="rounded-[2rem] border-2 border-blue-200 bg-white p-8 shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-900">Signup</h2>
        <p className="mt-2 text-sm text-gray-600">Name, Email, Password, Phone, City and optional photo.</p>

        <div className="mt-6 grid gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          <input name="adminCode" value={form.adminCode} onChange={handleChange} placeholder="Admin code (optional)" className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          <input type="file" accept="image/*" onChange={handleFile} className="w-full rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-sm text-gray-900" />
          {form.profilePhoto && <img src={form.profilePhoto} alt="profile preview" className="h-32 w-32 rounded-2xl object-cover border-2 border-blue-200" />}

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-civic-500 to-civic-700 py-3 font-semibold transition hover:opacity-90 disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="text-sm text-gray-600 text-center">
            Already have an account? <Link to="/login" className="text-civic-600 hover:text-civic-700">Login</Link>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
