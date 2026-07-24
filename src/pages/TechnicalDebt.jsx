import { useTranslation } from 'react-i18next';
import { BarChart, DonutChart, LineChart } from '../components/charts.jsx';
import { repositories } from '../data/mockData.js';

/*
 * TechnicalDebt — port of technicaldebt.component.html (i18n).
 * Debt distribution by project, debt by category, monthly trend, and a
 * ranked debt table (time + cost in THB).
 */
const debtRows = repositories
  .filter((r) => r.metrics)
  .map((r) => {
    const days = Math.max(1, Math.round(r.metrics.bugs * 0.8 + (r.metrics.vulnerabilities || 0) * 2));
    const cost = r.metrics.bugs * 1200 + (r.metrics.vulnerabilities || 0) * 3500;
    return {
      project: r.name,
      priorityKey: r.metrics.bugs > 8 ? 'PRIORITY_HIGH' : r.metrics.bugs > 3 ? 'PRIORITY_MED' : 'PRIORITY_LOW',
      priorityCls: r.metrics.bugs > 8 ? 'critical' : r.metrics.bugs > 3 ? 'minor' : 'info',
      days,
      cost,
    };
  })
  .sort((a, b) => b.cost - a.cost);

const totalDays = debtRows.reduce((s, r) => s + r.days, 0);
const totalCost = debtRows.reduce((s, r) => s + r.cost, 0);

const categoryKeys = ['CAT_DOCUMENTATION', 'CAT_ARCHITECTURE', 'CAT_CODE_QUALITY', 'CAT_TEST_COVERAGE', 'CAT_SECURITY'];
const categoryData = [15, 22, 35, 18, 10];

export default function TechnicalDebt() {
  const { t } = useTranslation();

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-clock-history"></i> {t('TECHNICAL_DEBT.TITLE')}</h1>
          <p>{t('TECHNICAL_DEBT.TOTAL_DEBT')} {totalDays} {t('TECHNICAL_DEBT.DAYS')} · {t('TECHNICAL_DEBT.ESTIMATED_COST')} {totalCost.toLocaleString()} THB</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline"><i className="bi bi-file-earmark-text"></i> {t('TECHNICAL_DEBT.GENERATE_DEBT_REPORT')}</button>
          <button className="btn btn-outline"><i className="bi bi-file-earmark-excel"></i> {t('TECHNICAL_DEBT.EXPORT_TO_EXCEL')}</button>
        </div>
      </div>

      <div className="content-row">
        <div className="card">
          <div className="card-header-flex"><h3>{t('TECHNICAL_DEBT.DEBT_BY_CATEGORY')}</h3></div>
          <DonutChart
            series={categoryData}
            labels={categoryKeys.map((k) => t('TECHNICAL_DEBT.' + k))}
            colors={['#0ea5e9', '#6366f1', '#f59e0b', '#10b981', '#ef4444']}
          />
        </div>
        <div className="card">
          <div className="card-header-flex"><h3>{t('TECHNICAL_DEBT.DEBT_DISTRIBUTION_BY_PROJECT')}</h3></div>
          <BarChart
            series={[{ name: t('TECHNICAL_DEBT.COL_TIME'), data: debtRows.map((r) => r.days) }]}
            categories={debtRows.map((r) => r.project)}
            colors={['#2563eb']}
            horizontal
          />
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-header-flex"><h3>{t('TECHNICAL_DEBT.DEBT_TREND_MONTHLY')}</h3></div>
        <LineChart
          series={[{ name: t('TECHNICAL_DEBT.TOTAL_DEBT'), data: [20, 28, 35, 40, 46, totalDays] }]}
          categories={['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
          colors={['#ef4444']}
        />
      </div>

      <div className="card mt-16">
        <div className="card-header-flex"><h3>{t('TECHNICAL_DEBT.TOP_DEBT_PROJECT')}</h3></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('TECHNICAL_DEBT.COL_PRIORITY')}</th>
                <th>{t('TECHNICAL_DEBT.COL_PROJECT')}</th>
                <th>{t('TECHNICAL_DEBT.COL_TIME')}</th>
                <th>{t('TECHNICAL_DEBT.COL_COST')}</th>
              </tr>
            </thead>
            <tbody>
              {debtRows.map((r) => (
                <tr key={r.project}>
                  <td><span className={'severity-badge ' + r.priorityCls}>{t('ANALYTICS.' + r.priorityKey)}</span></td>
                  <td className="repo-name">{r.project}</td>
                  <td>{r.days} {t('TECHNICAL_DEBT.DAYS')}</td>
                  <td>{r.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
