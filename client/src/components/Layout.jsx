import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-full text-sm transition ${
    isActive
      ? 'bg-blue-100 text-blue-700 font-medium'
      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
  }`;

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = user
    ? [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/report-issue', label: 'Report' },
        { to: '/my-complaints', label: 'Complaints' },
        { to: '/features', label: 'Features' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/features', label: 'Features' },
        { to: '/help-center', label: 'Help' },
        { to: '/contact', label: 'Contact' },
        { to: '/faq', label: 'FAQ' },
      ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 font-semibold text-lg tracking-tight"
          >
            <span className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white  grid place-items-center font-bold">
              CR
            </span>

            <div>
              <div className="font-semibold text-gray-900">
                Civic Routes
              </div>

              <div className="text-xs text-gray-500 font-normal">
                Smart civic issue management
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="flex items-center gap-3">

            {user ? (
              <>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </div>

                  <div className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm text-gray-700 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition text-sm font-medium text-white "
              >
                Get Started
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Professional Footer */}
      <footer className="mt-20 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Brand */}
            <div>
              <div className="text-2xl font-bold text-blue-400">
                Civic Routes
              </div>

              <p className="mt-4 text-gray-400 leading-7 text-sm">
                Built for faster civic issue resolution with transparency,
                accountability, and real-time updates for smarter cities.
              </p>

              <div className="mt-5 flex gap-3">

                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  🌍
                </div>

                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  🚦
                </div>

                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  🏙️
                </div>

              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="text-lg font-semibold">
                Contact
              </div>

              <ul className="mt-5 space-y-3 text-gray-400 text-sm">

                <li>
                  <Link
                    to="/contact"
                    className="hover:text-blue-400 transition"
                  >
                    Contact Page
                  </Link>
                </li>

                <li>Email: support@civicroutes.com</li>

                <li>Phone: +91 98765 43210</li>

                <li>Address: Civic Center, City Hub</li>

              </ul>
            </div>

            {/* Social */}
            <div>
              <div className="text-lg font-semibold">
                Social Links
              </div>

              <ul className="mt-5 space-y-3 text-gray-400 text-sm">

                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition"
                  >
                    LinkedIn
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition"
                  >
                    Twitter
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition"
                  >
                    Instagram
                  </a>
                </li>

              </ul>
            </div>

            {/* FAQs */}
            <div>
              <div className="text-lg font-semibold">
                FAQs
              </div>

              <ul className="mt-5 space-y-3 text-gray-400 text-sm">

                <li>
                  <Link
                    to="/faq"
                    className="hover:text-blue-400 transition"
                  >
                    Open FAQ Page
                  </Link>
                </li>

                <li>How to report an issue?</li>

                <li>How long resolution takes?</li>

                <li>How complaint tracking works?</li>

              </ul>
            </div>

            {/* Help Center */}
            <div>
              <div className="text-lg font-semibold">
                Help Center
              </div>

              <ul className="mt-5 space-y-3 text-gray-400 text-sm">

                <li>
                  <Link
                    to="/help-center"
                    className="hover:text-blue-400 transition"
                  >
                    Tutorials
                  </Link>
                </li>

                <li>Reporting Guide</li>

                <li>Image Upload Guide</li>

                <li>Support Documentation</li>

              </ul>
            </div>

          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-gray-500 text-sm">
              © 2026 Civic Routes. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-400">

              <span className="hover:text-blue-400 cursor-pointer transition">
                Privacy Policy
              </span>

              <span className="hover:text-blue-400 cursor-pointer transition">
                Terms of Service
              </span>

              <span className="hover:text-blue-400 cursor-pointer transition">
                Security
              </span>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}