import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ReportIssuePage from './pages/ReportIssuePage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import DashboardPage from './pages/DashboardPage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import HelpCenterPage from './pages/HelpCenterPage';
import NotFoundPage from './pages/NotFoundPage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import NearbyIssuesPage from './pages/NearbyIssuesPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ManageComplaintsPage from './pages/ManageComplaintsPage';
import IssueAnalyticsPage from './pages/IssueAnalyticsPage';
import UserManagementPage from './pages/UserManagementPage';
import DepartmentManagementPage from './pages/DepartmentManagementPage';
import api from './api';

export default function App() {
  const [issues, setIssues] = useState([]);

  const fetchIssues = async () => {
    const { data } = await api.get('/issues?scope=public');
    setIssues(data.issues);
  };

  useEffect(() => {
    fetchIssues();
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    socket.on('issue:updated', fetchIssues);
    return () => socket.disconnect();
  }, []);

  const sharedProps = useMemo(() => ({ issues, refreshIssues: fetchIssues }), [issues]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage {...sharedProps} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/help-center" element={<HelpCenterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <ReportIssuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute>
              <MyComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage {...sharedProps} />
            </ProtectedRoute>
          }
        />
        <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
        <Route path="/nearby" element={<NearbyIssuesPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-complaints"
          element={
            <ProtectedRoute>
              <ManageComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <IssueAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <DepartmentManagementPage />
            </ProtectedRoute>
          }
        />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
