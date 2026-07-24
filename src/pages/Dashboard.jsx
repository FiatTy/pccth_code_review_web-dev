import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DonutChart, LineChart } from '../components/charts.jsx';
import {
  currentUser,
  dashboardSummary,
  scans,
  issues,
  projectDistribution,
  coverageTrend,
  notifications as mockNotifications,
} from '../data/mockData.js';

/*
 * Dashboard — port of dashboard.component.html (with i18n + ApexCharts).
 * Sections: header (export + notifications + profile), welcome banner,
 * 4 metric cards, quality gate + recent scans, distribution + top issues,
 * and a quality-trends line chart.
 */
function fmtTime(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showNoti, setShowNoti] = useState(false);
  const unread = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1><i className="bi bi-grid-1x2-fill"></i> {t('DASHBOARD.TITLE')}</h1>
          <p>{t('DASHBOARD.SUBTITLE')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <button className="btn-icon" title={t('DASHBOARD.EXPORT_TOOLTIP')}>
            <i className="bi bi-download"></i>
          </button>
          <button className="btn-icon" title={t('DASHBOARD.NOTIFICATIONS')} onClick={() => setShowNoti((v) => !v)} style={{ position: 'relative' }}>
            <i className="bi bi-bell"></i>
            {unread > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--notification-badge)', color: '#fff', borderRadius: '50%', fontSize: '0.65rem', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unread}
              </span>
            )}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight: 600 }}>{currentUser.username}</span>
          </div>

          {showNoti && (
            <div className="card" style={{ position: 'absolute', top: 46, right: 0, width: 320, zIndex: 50, padding: 12 }}>
              <div className="card-header-flex" style={{ marginBottom: 8 }}>
                <h3 style={{ fontSize: '0.95rem' }}>{t('DASHBOARD.NOTIFICATIONS')}</h3>
                <button className="btn-icon" style={{ width: 26, height: 26 }} onClick={() => setShowNoti(false)}>
                  <i className="bi bi-x"></i>
                </button>
              </div>
              {mockNotifications.map((n) => (
                <div key={n.id} style={{ padding: '8px 4px', borderBottom: '1px solid var(--table-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>{n.title}</span>
                    {!n.isRead && <span className="status-dot status-scanning" />}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>{n.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Welcome banner */}
      <div className="card welcome-card">
        <div className="welcome-text">
          <h2>{t('DASHBOARD.WELCOME_BACK')} {currentUser.username}!</h2>
          <p>{t('DASHBOARD.WELCOME_TEXT')}</p>
        </div>
        <div className="quick-stats">
          <div className="q-stat">
            <span className="label">{t('DASHBOARD.TOTAL_SCANS')}</span>
            <span className="value">{dashboardSummary.totalScans}</span>
          </div>
          <div className="q-stat">
            <span className="label">{t('DASHBOARD.PROJECTS')}</span>
            <span className="value">{dashboardSummary.projects}</span>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid-4 mt-16">
        <div className="metric-card bug">
          <div className="icon-box"><i className="bi bi-bug-fill"></i></div>
          <div className="info"><span className="label">{t('DASHBOARD.BUGS')}</span><span className="value">{dashboardSummary.bugs}</span></div>
        </div>
        <div className="metric-card security">
          <div className="icon-box"><i className="bi bi-shield-lock-fill"></i></div>
          <div className="info"><span className="label">{t('DASHBOARD.SECURITY')}</span><span className="value">{dashboardSummary.security}</span></div>
        </div>
        <div className="metric-card smell">
          <div className="icon-box"><i className="bi bi-wind"></i></div>
          <div className="info"><span className="label">{t('DASHBOARD.CODE_SMELLS')}</span><span className="value">{dashboardSummary.codeSmells}</span></div>
        </div>
        <div className="metric-card coverage">
          <div className="icon-box"><i className="bi bi-check2-circle"></i></div>
          <div className="info"><span className="label">{t('DASHBOARD.COVERAGE')}</span><span className="value">{dashboardSummary.coverage}%</span></div>
        </div>
      </div>

      {/* Quality gate + recent scans */}
      <div className="content-row">
        <div className="card">
          <div className="card-header-flex">
            <h3><i className="bi bi-pie-chart-fill"></i> {t('DASHBOARD.QUALITY_GATE')}</h3>
          </div>
          <DonutChart
            series={[dashboardSummary.passed, dashboardSummary.failed]}
            labels={[t('DASHBOARD.PASSED'), t('DASHBOARD.FAILED')]}
            colors={['#10b981', '#ef4444']}
          />
          <div className="gate-summary">
            <div className="summary-item">
              <i className="bi bi-check-circle-fill" style={{ color: 'var(--success)' }}></i> {t('DASHBOARD.PASSED')} <strong>{dashboardSummary.passed}</strong>
            </div>
            <div className="summary-item">
              <i className="bi bi-x-circle-fill" style={{ color: 'var(--danger)' }}></i> {t('DASHBOARD.FAILED')} <strong>{dashboardSummary.failed}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header-flex">
            <h3><i className="bi bi-clock-history"></i> {t('DASHBOARD.RECENT_ACTIVITY')}</h3>
            <Link to="/scanhistory" className="link-btn">{t('DASHBOARD.VIEW_ALL')} <i className="bi bi-arrow-right"></i></Link>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('DASHBOARD.COL_PROJECT')}</th>
                  <th>{t('DASHBOARD.COL_STATUS')}</th>
                  <th>{t('DASHBOARD.COL_QUALITY_GATE')}</th>
                  <th>{t('DASHBOARD.COL_TIME')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {scans.slice(0, 5).map((s) => (
                  <tr key={s.scanId}>
                    <td>
                      <div className="repo-identity">
                        <div className={'type-icon ' + (s.project.projectType.includes('Angular') ? 'icon-angular' : 'icon-spring')}>
                          <i className={'bi ' + (s.project.projectType.includes('Angular') ? 'bi-code-slash' : 'bi-filetype-java')}></i>
                        </div>
                        <span className="repo-name">{s.project.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={'status-badge ' + (s.status === 'PENDING' ? 'scanning' : s.status === 'SUCCESS' ? 'success' : 'failed')}>
                        {s.status === 'PENDING' && <i className="bi bi-arrow-repeat spin"></i>}
                        {s.status === 'PENDING' ? t('DASHBOARD.SCANNING') : s.status === 'SUCCESS' ? t('DASHBOARD.PASSED') : t('DASHBOARD.FAILED')}
                      </span>
                    </td>
                    <td>
                      {s.status === 'PENDING' ? (
                        <span className="gate-badge gate-scanning">{t('DASHBOARD.SCANNING')}</span>
                      ) : s.qualityGate === 'OK' ? (
                        <span className="gate-badge gate-pass">{t('DASHBOARD.PASSED')}</span>
                      ) : (
                        <span className="gate-badge gate-fail">{t('DASHBOARD.FAILED')}</span>
                      )}
                    </td>
                    <td className="text-muted">{fmtTime(s.completedAt || s.startedAt)}</td>
                    <td className="text-end">
                      <button className="btn-icon btn-view" onClick={() => navigate('/scanresult/' + s.scanId)}><i className="bi bi-chevron-right"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Distribution + top issues */}
      <div className="content-row">
        <div className="card">
          <div className="card-header-flex">
            <h3><i className="bi bi-bar-chart-fill"></i> {t('DASHBOARD.PROJECT_TYPES')}</h3>
          </div>
          <div className="dist-list">
            {projectDistribution.map((p) => (
              <div key={p.type}>
                <div className="dist-info">
                  <span>{p.type} ({p.count})</span>
                  <span>{p.percent}%</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: p.percent + '%', background: p.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header-flex">
            <h3><i className="bi bi-exclamation-triangle-fill"></i> {t('DASHBOARD.TOP_ISSUES')}</h3>
          </div>
          <ul className="issue-list">
            {issues.slice(0, 4).map((i) => (
              <li key={i.id}>
                <div className="issue-content">
                  <span className="issue-msg">{i.message}</span>
                  <span className={'severity-badge ' + i.severity.toLowerCase()}>{i.severity}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quality trends */}
      <div className="card mt-16">
        <div className="card-header-flex">
          <h3><i className="bi bi-graph-up"></i> {t('DASHBOARD.QUALITY_TRENDS')}</h3>
        </div>
        <LineChart
          series={[{ name: t('DASHBOARD.COVERAGE'), data: coverageTrend }]}
          categories={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']}
          colors={['#2563eb']}
        />
      </div>
    </div>
  );
}
