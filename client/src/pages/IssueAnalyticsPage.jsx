import { useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement, TimeScale } from 'chart.js';
import api from '../api';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement, TimeScale);

export default function IssueAnalyticsPage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/issues?scope=all');
        setIssues(data.issues || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const mostAffected = useMemo(() => {
    const map = {};
    issues.forEach((i) => { const a = i.location?.address || `${i.location?.lat},${i.location?.lng}`; map[a] = (map[a] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [issues]);

  const resolutionTimes = useMemo(() => {
    const arr = issues.filter((i) => i.status === 'Resolved' && i.createdAt && i.updatedAt).map((i) => (new Date(i.updatedAt) - new Date(i.createdAt)) / (1000 * 60 * 60));
    return arr;
  }, [issues]);

  const lineData = useMemo(() => ({ labels: resolutionTimes.map((_, idx) => `#${idx + 1}`), datasets: [{ label: 'Resolution time (hrs)', data: resolutionTimes, borderColor: '#60a5fa', tension: 0.3 }] }), [resolutionTimes]);

  const deptPerf = useMemo(() => {
    const map = {};
    issues.forEach((i) => { const dept = i.assignedTo?.name || 'Unassigned'; map[dept] = map[dept] || { total: 0, resolved: 0 }; map[dept].total += 1; if (i.status === 'Resolved') map[dept].resolved += 1; });
    return Object.entries(map).map(([k, v]) => ({ dept: k, resolvedPct: v.total ? Math.round((v.resolved / v.total) * 100) : 0 }));
  }, [issues]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl border-2 border-blue-200 p-6 bg-white ">
        <h2 className="text-2xl font-bold text-gray-900">Issue Analytics</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="rounded-xl p-4 bg-blue-50 border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900">Most affected areas</h3>
            <ul className="mt-3 text-sm text-gray-700 space-y-2">
              {mostAffected.map(([loc, cnt]) => <li key={loc}>{loc} — {cnt} reports</li>)}
            </ul>
          </div>

          <div className="rounded-xl p-4 bg-white border-2 border-blue-200 md:col-span-2 ">
            <h3 className="text-lg font-semibold text-gray-900">Resolution times</h3>
            <div className="mt-3"><Line data={lineData} /></div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl p-4 bg-white border-2 border-blue-200 ">
            <h3 className="text-lg font-semibold text-gray-900">Department performance</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              {deptPerf.map((d) => (
                <div key={d.dept} className="flex items-center justify-between">
                  <div>{d.dept}</div>
                  <div>{d.resolvedPct}% resolved</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 bg-white border-2 border-blue-200 ">
            <h3 className="text-lg font-semibold text-gray-900">Heatmap preview</h3>
            <div className="mt-3 h-64 rounded-md overflow-hidden border border-gray-200">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
