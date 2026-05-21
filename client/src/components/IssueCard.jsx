export default function IssueCard({ issue, onSelect, compact = false }) {
  return (
    <button
      onClick={() => onSelect?.(issue)}
      className={`text-left w-full rounded-3xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all duration-300 overflow-hidden shadow-md ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-civic-600 font-medium">{issue.category}</div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">{issue.title}</h3>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : issue.status === 'In Progress' ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 text-gray-700 border border-gray-300'}`}>
          {issue.status}
        </span>
      </div>

      <p className="mt-3 text-sm text-gray-600 line-clamp-2">{issue.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{issue.location?.address || 'Location pending'}</span>
        <span>▲ {issue.upvotes?.length || 0} • 💬 {issue.comments?.length || 0}</span>
      </div>
    </button>
  );
}
