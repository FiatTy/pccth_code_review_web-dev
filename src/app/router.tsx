import { lazy, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { BASE_URL } from '@/config/env';
import { AuthBoundary } from '@/app/guards/AuthBoundary';
import { ProtectedRoute } from '@/app/guards/ProtectedRoute';
import { RoleRoute } from '@/app/guards/RoleRoute';
import { RootLayout } from '@/app/layouts/RootLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';

function lazyRoute<K extends string>(name: K, load: () => Promise<{ [P in K]: ComponentType }>) {
  return lazy(() => load().then((module) => ({ default: module[name] })));
}

const RealtimeBoundary = lazyRoute('RealtimeBoundary', () => import('@/app/guards/RealtimeBoundary'));
const RegisterPage = lazyRoute('RegisterPage', () => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazyRoute('ForgotPasswordPage', () => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazyRoute('ResetPasswordPage', () => import('@/pages/ResetPasswordPage'));
const VerifyEmailPage = lazyRoute('VerifyEmailPage', () => import('@/pages/VerifyEmailPage'));
const VerifySuccessPage = lazyRoute('VerifySuccessPage', () => import('@/pages/VerifySuccessPage'));
const VerifyFailedPage = lazyRoute('VerifyFailedPage', () => import('@/pages/VerifyFailedPage'));
const DashboardPage = lazyRoute('DashboardPage', () => import('@/pages/DashboardPage'));
const RepositoriesPage = lazyRoute('RepositoriesPage', () => import('@/pages/RepositoriesPage'));
const RepositoryFormPage = lazyRoute('RepositoryFormPage', () => import('@/pages/RepositoryFormPage'));
const RepositoryDetailPage = lazyRoute('RepositoryDetailPage', () => import('@/pages/RepositoryDetailPage'));
const ScanHistoryPage = lazyRoute('ScanHistoryPage', () => import('@/pages/ScanHistoryPage'));
const ScanResultPage = lazyRoute('ScanResultPage', () => import('@/pages/ScanResultPage'));
const LogViewerPage = lazyRoute('LogViewerPage', () => import('@/pages/LogViewerPage'));
const IssuesPage = lazyRoute('IssuesPage', () => import('@/pages/IssuesPage'));
const IssueDetailPage = lazyRoute('IssueDetailPage', () => import('@/pages/IssueDetailPage'));
const AssignmentsPage = lazyRoute('AssignmentsPage', () => import('@/pages/AssignmentsPage'));
const AnalysisPage = lazyRoute('AnalysisPage', () => import('@/pages/AnalysisPage'));
const SecurityDashboardPage = lazyRoute('SecurityDashboardPage', () => import('@/pages/SecurityDashboardPage'));
const TechnicalDebtPage = lazyRoute('TechnicalDebtPage', () => import('@/pages/TechnicalDebtPage'));
const GenerateReportPage = lazyRoute('GenerateReportPage', () => import('@/pages/GenerateReportPage'));
const ReportHistoryPage = lazyRoute('ReportHistoryPage', () => import('@/pages/ReportHistoryPage'));
const SonarQubeConfigPage = lazyRoute('SonarQubeConfigPage', () => import('@/pages/SonarQubeConfigPage'));
const NotificationSettingsPage = lazyRoute('NotificationSettingsPage', () => import('@/pages/NotificationSettingsPage'));
const ComponentsPage = lazyRoute('ComponentsPage', () => import('@/pages/ComponentsPage'));
const UserManagementPage = lazyRoute('UserManagementPage', () => import('@/pages/UserManagementPage'));

const basename = BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter(
  [
    {
      element: <AuthBoundary />,
      children: [
        { path: '/', element: <LandingPage /> },
        { path: '/login', element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
        { path: '/reset-password', element: <ResetPasswordPage /> },
        { path: '/forgot-password', element: <ForgotPasswordPage /> },
        { path: '/verify-email', element: <VerifyEmailPage /> },
        { path: '/verify-success', element: <VerifySuccessPage /> },
        { path: '/verify-failed', element: <VerifyFailedPage /> },
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <RealtimeBoundary />,
              children: [
                {
                  element: <RootLayout />,
                  children: [
                    { path: '/dashboard', element: <DashboardPage /> },
                    { path: '/repositories', element: <RepositoriesPage /> },
                    { path: '/addrepository', element: <RepositoryFormPage /> },
                    {
                      path: '/settingrepo/:projectId',
                      element: <RepositoryFormPage />,
                    },
                    {
                      path: '/detailrepo/:projectId',
                      element: <RepositoryDetailPage />,
                    },
                    { path: '/scanhistory', element: <ScanHistoryPage /> },
                    {
                      path: '/scanresult/:scanId',
                      element: <ScanResultPage />,
                    },
                    { path: '/logviewer/:scanId', element: <LogViewerPage /> },
                    { path: '/issue', element: <IssuesPage /> },
                    {
                      path: '/issuedetail/:issuesId',
                      element: <IssueDetailPage />,
                    },
                    { path: '/assignment', element: <AssignmentsPage /> },
                    { path: '/analysis', element: <AnalysisPage /> },
                    {
                      path: '/security-dashboard',
                      element: <SecurityDashboardPage />,
                    },
                    { path: '/technical-debt', element: <TechnicalDebtPage /> },
                    {
                      path: '/generatereport',
                      element: <GenerateReportPage />,
                    },
                    { path: '/reporthistory', element: <ReportHistoryPage /> },
                    {
                      path: '/sonarqubeconfig',
                      element: <SonarQubeConfigPage />,
                    },
                    {
                      path: '/notificationsetting',
                      element: <NotificationSettingsPage />,
                    },
                    { path: '/components', element: <ComponentsPage /> },
                    {
                      element: <RoleRoute allowed={['ADMIN']} />,
                      children: [
                        {
                          path: '/usermanagement',
                          element: <UserManagementPage />,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename },
);
