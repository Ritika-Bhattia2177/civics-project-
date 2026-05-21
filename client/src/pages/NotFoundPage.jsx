import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl font-black text-civic-300">404</div>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-400">The page you are looking for does not exist.</p>
      <Link to="/" className="inline-block mt-8 px-6 py-3 rounded-2xl bg-gradient-to-r from-civic-500 to-civic-700 font-semibold">Go home</Link>
    </div>
  );
}
