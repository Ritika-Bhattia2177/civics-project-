export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border-2 border-blue-200 bg-white backdrop-blur-xl p-5 shadow-md">
      <div className="text-3xl font-semibold text-gray-900">{value}</div>
      <div className="mt-2 text-sm text-gray-600">{label}</div>
      <div className="mt-3 text-xs text-gray-500">{hint}</div>
    </div>
  );
}
