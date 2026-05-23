import { useEffect, useMemo, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import api from '../api';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: analytics }, { data: all }] = await Promise.all([
          api.get('/issues/analytics/overview'),
          api.get('/issues?scope=all'),
        ]);
        setStats(analytics.stats || null);
        setIssues(all.issues || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const categoryCounts = useMemo(() => {
    const map = {};
    (issues || []).forEach((i) => { map[i.category] = (map[i.category] || 0) + 1; });
    return map;
  }, [issues]);

  const barData = useMemo(() => ({
    labels: Object.keys(categoryCounts),
    datasets: [{ label: 'Issues by category', data: Object.values(categoryCounts), backgroundColor: 'rgba(59,130,246,0.7)' }],
  }), [categoryCounts]);

  const pieData = useMemo(() => ({
    labels: Object.keys(categoryCounts),
    datasets: [{ data: Object.values(categoryCounts), backgroundColor: ['#f97316', '#f43f5e', '#60a5fa', '#34d399'] }],
  }), [categoryCounts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-2xl border-2 border-blue-200 p-6 bg-white ">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl p-4 bg-blue-50 border-2 border-blue-200">
            <div className="text-sm text-gray-600">Total issues</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.total ?? '-'}</div>
          </div>
          <div className="rounded-xl p-4 bg-blue-50 border-2 border-blue-200">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.pending ?? '-'}</div>
          </div>
          <div className="rounded-xl p-4 bg-blue-50 border-2 border-blue-200">
            <div className="text-sm text-gray-600">In Progress</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.inProgress ?? '-'}</div>
          </div>
          <div className="rounded-xl p-4 bg-blue-50 border-2 border-blue-200">
            <div className="text-sm text-gray-600">Resolved</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.resolved ?? '-'}</div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl p-4 bg-white border-2 border-blue-200 ">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Issues by category</h3>
            <Bar data={barData} />
          </div>

          <div className="rounded-xl p-4 bg-white border-2 border-blue-200 ">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Category distribution</h3>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
