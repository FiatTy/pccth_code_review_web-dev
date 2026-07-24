import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Repositories from './pages/Repositories.jsx';
import AddRepository from './pages/AddRepository.jsx';
import RepositoryDetail from './pages/RepositoryDetail.jsx';
import ScanHistory from './pages/ScanHistory.jsx';
import ScanResult from './pages/ScanResult.jsx';
import LogViewer from './pages/LogViewer.jsx';
import Issues from './pages/Issues.jsx';
import IssueDetail from './pages/IssueDetail.jsx';
import Assignment from './pages/Assignment.jsx';
import Analytics from './pages/Analytics.jsx';
import SecurityDashboard from './pages/SecurityDashboard.jsx';
import TechnicalDebt from './pages/TechnicalDebt.jsx';
import GenerateReport from './pages/GenerateReport.jsx';
import ReportHistory from './pages/ReportHistory.jsx';
import Settings from './pages/Settings.jsx';
import NotificationSetting from './pages/NotificationSetting.jsx';
import UserManagement from './pages/UserManagement.jsx';

/*
 * App routing — mirrors app.routes.ts from the original Angular project.
 * Auth-guarded routes there live under a LayoutComponent parent; here the
 * same nesting is expressed with a <Layout> route wrapping the app pages.
 */
export default function App() {
  return (
    <Routes>
      {/* Public (were outside LayoutComponent) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* App shell (was authGuard + LayoutComponent) */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/addrepository" element={<AddRepository />} />
        <Route path="/settingrepo/:projectId" element={<AddRepository />} />
        <Route path="/detailrepo/:projectId" element={<RepositoryDetail />} />
        <Route path="/scanhistory" element={<ScanHistory />} />
        <Route path="/scanresult/:scanId" element={<ScanResult />} />
        <Route path="/logviewer/:scanId" element={<LogViewer />} />
        <Route path="/issue" element={<Issues />} />
        <Route path="/issuedetail/:issuesId" element={<IssueDetail />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/analysis" element={<Analytics />} />
        <Route path="/security-dashboard" element={<SecurityDashboard />} />
        <Route path="/technical-debt" element={<TechnicalDebt />} />
        <Route path="/generatereport" element={<GenerateReport />} />
        <Route path="/reporthistory" element={<ReportHistory />} />
        <Route path="/sonarqubeconfig" element={<Settings />} />
        <Route path="/notificationsetting" element={<NotificationSetting />} />
        <Route path="/usermanagement" element={<UserManagement />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
