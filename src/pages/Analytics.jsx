import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RadialChart, BarChart } from '../components/charts.jsx';
import { dashboardSummary, issues } from '../data/mockData.js';

/*
 * Analytics — overview of the analytics-page group. Links out to the
 * dedicated Security Dashboard and Technical Debt pages (which mirror the
 * original securitydashboard / technicaldebt components).
 */
const severityOrder = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR', 'INFO'];
const severityCounts = issues.reduce((acc, i) => {
  acc[i.severity] = (acc[i.severity] || 0) + 1;
  return acc;
}, {});

const securityScore = Math.max(0, 100 - dashboardSummary.security * 6);

export default function Analytics() {
  const { t } = useTranslation();

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-graph-up"></i> {t('ANALYTICS.TITLE')}</h1>
          <p>{t('ANALYTICS.QUALITY_OVERVIEW')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/security-dashboard" className="btn btn-outline"><i className="bi bi-shield-check"></i> {t('ANALYTICS.SECURITY_TITLE')}</Link>
          <Link to="/technical-debt" className="btn btn-outline"><i className="bi bi-clock-history"></i> {t('ANALYTICS.DEBT_TITLE')}</Link>
        </div>
      </div>

      <div className="content-row">
        <div className="card">
          <div className="card-header-flex">
            <h3><i className="bi bi-shield-check"></i> {t('ANALYTICS.SECURITY_SCORE')}</h3>
            <Link to="/security-dashboard" className="link-btn">{t('ANALYTICS.VIEW_DETAILS')} <i className="bi bi-arrow-right"></i></Link>
          </div>
          <RadialChart value={securityScore} label={t('ANALYTICS.SECURITY_SCORE')} color={securityScore >= 80 ? '#10b981' : securityScore >= 50 ? '#f59e0b' : '#ef4444'} />
        </div>

        <div className="card">
          <div className="card-header-flex">
            <h3><i className="bi bi-bar-chart-fill"></i> {t('SECURITY_DASHBOARD.VULNERABILITIES_BY_SEVERITY')}</h3>
          </div>
          <BarChart
            series={[{ name: 'Issues', data: severityOrder.map((s) => severityCounts[s] || 0) }]}
            categories={severityOrder}
            colors={['#991b1b', '#ef4444', '#fb923c', '#f59e0b', '#0ea5e9']}
          />
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-header-flex">
          <h3><i className="bi bi-clock-history"></i> {t('ANALYTICS.TOP_TECHNICAL_DEBT')}</h3>
          <Link to="/technical-debt" className="link-btn">{t('ANALYTICS.VIEW_DETAILS')} <i className="bi bi-arrow-right"></i></Link>
        </div>
        <p className="text-muted">{t('TECHNICAL_DEBT.TITLE')} — {t('ANALYTICS.VIEW_DETAILS')}.</p>
      </div>
    </div>
  );
}
