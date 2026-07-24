import { useTranslation } from 'react-i18next';
import { RadialChart, BarChart, LineChart, DonutChart } from '../components/charts.jsx';
import { dashboardSummary, issues, securityTrend } from '../data/mockData.js';

/*
 * SecurityDashboard — port of securitydashboard.component.html (i18n).
 * Security score, vulnerabilities by severity, OWASP coverage, hot issues,
 * and a 7-day security trend.
 */
const securityScore = Math.max(0, 100 - dashboardSummary.security * 6);
const riskLevel = securityScore >= 90 ? 'RISK_SAFE' : securityScore >= 70 ? 'RISK_LOW' : securityScore >= 50 ? 'RISK_MEDIUM' : securityScore >= 30 ? 'RISK_HIGH' : 'RISK_CRITICAL';

const secIssues = issues.filter((i) => i.type === 'SECURITY');
const sevBuckets = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
secIssues.forEach((i) => {
  if (i.severity === 'BLOCKER' || i.severity === 'CRITICAL') sevBuckets.CRITICAL++;
  else if (i.severity === 'MAJOR') sevBuckets.HIGH++;
  else if (i.severity === 'MINOR') sevBuckets.MEDIUM++;
  else sevBuckets.LOW++;
});

export default function SecurityDashboard() {
  const { t } = useTranslation();

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-shield-lock-fill"></i> {t('SECURITY_DASHBOARD.TITLE')}</h1>
          <p>{t('SECURITY_DASHBOARD.SECURITY_SCORE')} {securityScore} · {t('SECURITY_DASHBOARD.RISK_LEVEL')} {t('SECURITY_DASHBOARD.' + riskLevel)}</p>
        </div>
      </div>

      <div className="content-row">
        <div className="card">
          <div className="card-header-flex"><h3>{t('SECURITY_DASHBOARD.SECURITY_SCORE')}</h3></div>
          <RadialChart value={securityScore} label={t('SECURITY_DASHBOARD.' + riskLevel)} color={securityScore >= 70 ? '#10b981' : securityScore >= 50 ? '#f59e0b' : '#ef4444'} />
        </div>
        <div className="card">
          <div className="card-header-flex"><h3>{t('SECURITY_DASHBOARD.VULNERABILITIES_BY_SEVERITY')}</h3></div>
          <BarChart
            series={[{ name: 'Vulns', data: Object.values(sevBuckets) }]}
            categories={[t('SECURITY_DASHBOARD.SEVERITY_CRITICAL'), t('SECURITY_DASHBOARD.SEVERITY_HIGH'), t('SECURITY_DASHBOARD.SEVERITY_MEDIUM'), t('SECURITY_DASHBOARD.SEVERITY_LOW')]}
            colors={['#991b1b', '#ef4444', '#f59e0b', '#0ea5e9']}
          />
        </div>
      </div>

      <div className="content-row">
        <div className="card">
          <div className="card-header-flex"><h3>{t('SECURITY_DASHBOARD.OWASP_COVERAGE')}</h3></div>
          <DonutChart series={[7, 3]} labels={['Covered', 'Gaps']} colors={['#10b981', '#e2e8f0']} />
        </div>
        <div className="card">
          <div className="card-header-flex"><h3>{t('SECURITY_DASHBOARD.TREND_TITLE')}</h3></div>
          <LineChart
            series={[{ name: t('DASHBOARD.SECURITY'), data: securityTrend }]}
            categories={['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7']}
            colors={['#d97706']}
          />
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-header-flex"><h3>{t('SECURITY_DASHBOARD.HOT_SECURITY_ISSUES')}</h3></div>
        {secIssues.length === 0 ? (
          <p className="text-muted">{t('SECURITY_DASHBOARD.NO_HOT_ISSUES')}</p>
        ) : (
          <ul className="issue-list">
            {secIssues.map((i) => (
              <li key={i.id}>
                <div className="issue-content">
                  <span className="issue-msg">{i.message} <span className="text-muted">· {i.component}</span></span>
                  <span className={'severity-badge ' + i.severity.toLowerCase()}>{i.severity}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
