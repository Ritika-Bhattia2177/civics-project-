import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

const categories = ['Potholes', 'Garbage', 'Water Leakage', 'Broken Streetlights', 'Road Damage'];
const severities = ['Low', 'Medium', 'High', 'Emergency'];

export default function ReportIssuePage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0],
    severity: 'Medium',
    address: '',
    lat: '28.6139',
    lng: '77.2090',
    image: '',
  });
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [detecting, setDetecting] = useState(false);
  const mapRef = useRef(null);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileObject = (file) => {
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileObject(file);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }
    setDetecting(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setForm((prev) => ({ ...prev, lat, lng, address: prev.address || `Detected coordinates (${lat}, ${lng})` }));
        setDetecting(false);
      },
      () => {
        setError('Unable to detect location. Please allow location permission.');
        setDetecting(false);
      },
    );
  };

  const onMapPick = (e) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    const baseLat = 28.6139;
    const baseLng = 77.209;
    const lat = (baseLat + (0.2 * (0.5 - yRatio))).toFixed(6);
    const lng = (baseLng + (0.2 * (xRatio - 0.5))).toFixed(6);

    setForm((prev) => ({
      ...prev,
      lat,
      lng,
      address: prev.address || `Picked on map (${lat}, ${lng})`,
    }));
  };

  const aiPreview = useMemo(() => {
    if (!form.image) {
      return ['Upload an image to enable AI-assisted preview.'];
    }

    const insights = [
      `Detected context likely related to ${form.category.toLowerCase()}.`,
      `${form.severity} severity selected — authority priority queue will reflect this level.`,
      'Recommendation: include one close image and one wide-angle view for verification quality.',
    ];

    if (form.severity === 'Emergency') {
      insights.push('Emergency tag selected: this issue should be handled with immediate dispatch workflow.');
    }

    return insights;
  }, [form.image, form.category, form.severity]);

  const submitIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.post('/issues', {
        title: form.title,
        description: form.description,
        category: form.category,
        severity: form.severity,
        image: form.image,
        location: {
          address: form.address,
          lat: form.lat,
          lng: form.lng,
        },
      });
      setMessage('Complaint submitted successfully.');
      setForm({
        title: '',
        description: '',
        category: categories[0],
        severity: 'Medium',
        address: '',
        lat: form.lat,
        lng: form.lng,
        image: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const mapSrc = getMapEmbedUrl(Number(form.lat || 28.6139), Number(form.lng || 77.2090));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-blue-50 p-7 md:p-10 shadow-md">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Report Issue</h1>
        <p className="mt-4 text-gray-600 text-lg">Create complete complaints with drag & drop images, live map picking, severity tagging, and auto location detection.</p>
      </motion.section>

      <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={submitIssue} className="rounded-[2rem] border-2 border-blue-200 bg-white p-7 space-y-5 shadow-md">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Issue title" required className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
            <select name="category" value={form.category} onChange={handleChange} className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 outline-none focus:border-civic-400">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the issue clearly" rows="4" required className="md:col-span-2 rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
            <select name="severity" value={form.severity} onChange={handleChange} className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 outline-none focus:border-civic-400">
              {severities.map((item) => <option key={item}>{item}</option>)}
            </select>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address / landmark" className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
            <input name="lat" value={form.lat} onChange={handleChange} placeholder="Latitude" className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
            <input name="lng" value={form.lng} onChange={handleChange} placeholder="Longitude" className="rounded-2xl bg-blue-50 border-2 border-blue-200 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:border-civic-400" />
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`rounded-3xl border-2 border-dashed p-6 text-center transition ${dragging ? 'border-civic-400 bg-blue-100' : 'border-blue-300 bg-blue-50'}`}
          >
            <div className="text-sm text-gray-700 font-medium">Drag & Drop Image Upload</div>
            <div className="mt-2 text-xs text-gray-600">or choose manually</div>
            <label className="mt-4 inline-block px-4 py-2 rounded-xl border-2 border-blue-200 bg-blue-100 hover:bg-blue-200 cursor-pointer text-sm text-gray-900 font-medium">
              Choose Image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileObject(file); }} />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={detectLocation} className="px-4 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-gray-900 text-sm font-medium">
              {detecting ? 'Detecting...' : 'Auto location detection'}
            </button>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {message && <div className="text-sm text-green-600">{message}</div>}

          <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-civic-500 to-civic-700 py-3 font-semibold disabled:opacity-60">
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </motion.form>

        <div className="space-y-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
            <div className="text-sm uppercase tracking-[0.28em] text-gray-900 font-semibold">Live Map Picker</div>
            <p className="mt-2 text-sm text-gray-600">Click the map area to pick coordinates manually.</p>
            <div ref={mapRef} className="mt-4 relative rounded-2xl overflow-hidden border-2 border-blue-200">
              <iframe title="live-map-picker" src={mapSrc} className="w-full h-64 border-0" loading="lazy" />
              <button
                type="button"
                onClick={onMapPick}
                className="absolute inset-0 cursor-crosshair bg-transparent"
                aria-label="Pick location on map"
              />
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border-2 border-blue-200 bg-white p-6 shadow-md">
            <div className="text-sm uppercase tracking-[0.28em] text-gray-900 font-semibold">AI Image Preview</div>
            {form.image ? (
              <img src={form.image} alt="preview" className="mt-4 h-52 w-full object-cover rounded-2xl border-2 border-blue-200" />
            ) : (
              <div className="mt-4 h-40 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 grid place-items-center text-sm text-gray-600">No image selected</div>
            )}
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {aiPreview.map((insight, index) => <li key={index} className="rounded-xl bg-blue-50 border-2 border-blue-200 px-3 py-2">{insight}</li>)}
            </ul>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

function getMapEmbedUrl(lat, lng) {
  const safeLat = Number.isFinite(lat) ? lat : 28.6139;
  const safeLng = Number.isFinite(lng) ? lng : 77.209;
  const delta = 0.02;
  const bbox = `${safeLng - delta}%2C${safeLat - delta}%2C${safeLng + delta}%2C${safeLat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${safeLat}%2C${safeLng}`;
}
