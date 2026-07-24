import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scans } from '../data/mockData.js';

/*
 * ScanResult — port of scanresult.component.html (i18n).
 * Quality gate status banner, metrics overview, and an overall gates table.
 */
const ratingRows = [
  { key: 'RELIABILITY_RATING', grade: 'A' },
  { key: 'SECURITY_RATING', grade: 'B' },
  { key: 'MAINTAINABILITY_RATING', grade: 'A' },
  { key: 'SECURITY_HOTSPOT_RATING', grade: 'C' },
];

const gradeColor = { A: 'var(--grade-a)', B: 'var(--grade-b)', C: 'var(--grade-c)', D: 'var(--grade-d)', E: 'var(--grade-e)' };

export default function ScanResult() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { scanId } = useParams();
  const scan = scans.find((s) => s.scanId === scanId) || scans[0];
  const passed = scan.qualityGate === 'OK';
  const m = scan.metrics || {};

  const metricCards = [
    { key: 'BUGS', value: m.bugs ?? 0, cls: 'bug', icon: 'bi-bug-fill' },
    { key: 'SECURITY', value: (m.vulnerabilities || 0) + (m.securityHotspots || 0), cls: 'security', icon: 'bi-shield-lock-fill' },
    { key: 'CODE_SMELLS', value: m.codeSmells ?? 0, cls: 'smell', icon: 'bi-wind' },
    { key: 'COVERAGE', value: (m.coverage ?? 0) + '%', cls: 'coverage', icon: 'bi-check2-circle' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-icon" title={t('SCAN_RESULT.BACK_TOOLTIP')} onClick={() => navigate('/scanhistory')}><i className="bi bi-chevron-left"></i></button>
          <div>
            <h1>{t('SCAN_RESULT.TITLE', { name: scan.project.name })}</h1>
            <p>{t('SCAN_RESULT.SUBTITLE')}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline"><i className="bi bi-download"></i> {t('SCAN_RESULT.DOWNLOAD')}</button>
          <button className="btn btn-primary" onClick={() => navigate('/issue')}><i className="bi bi-list-task"></i> {t('SCAN_RESULT.VIEW_ISSUES')}</button>
        </div>
      </div>

      {/* Quality gate banner */}
      <div className="card" style={{ borderLeft: `5px solid ${passed ? 'var(--success)' : 'var(--danger)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <i className={'bi ' + (passed ? 'bi-check-circle-fill' : 'bi-x-circle-fill')} style={{ fontSize: '2rem', color: passed ? 'var(--success)' : 'var(--danger)' }}></i>
          <div>
            <h3 style={{ margin: 0 }}>{t('SCAN_RESULT.QUALITY_GATE_STATUS')}: {passed ? t('SCAN_RESULT.PASSED') : t('SCAN_RESULT.FAILED')}</h3>
            <span className="text-muted">{passed ? t('SCAN_RESULT.CODE_CLEAN') : t('SCAN_RESULT.ISSUES_FOUND')}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid-4 mt-16">
        {metricCards.map((c) => (
          <div className={'metric-card ' + c.cls} key={c.key}>
            <div className="icon-box"><i className={'bi ' + c.icon}></i></div>
            <div className="info"><span className="label">{t('SCAN_RESULT.' + c.key)}</span><span className="value">{c.value}</span></div>
          </div>
        ))}
      </div>

      {/* Overall gates */}
      <div className="card mt-16">
        <div className="card-header-flex"><h3>{t('SCAN_RESULT.OVERALL_GATES')}</h3></div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('SCAN_RESULT.COL_METRIC_GATE')}</th>
                <th>{t('SCAN_RESULT.COL_GRADE')}</th>
                <th>{t('SCAN_RESULT.COL_STATUS')}</th>
              </tr>
            </thead>
            <tbody>
              {ratingRows.map((r) => (
                <tr key={r.key}>
                  <td>{t('SCAN_RESULT.' + r.key)}</td>
                  <td><span style={{ fontWeight: 700, color: gradeColor[r.grade] }}>{r.grade}</span></td>
                  <td>
                    <span className={'status-badge ' + (r.grade <= 'B' ? 'success' : 'failed')}>
                      {r.grade <= 'B' ? t('SCAN_RESULT.PASS') : t('SCAN_RESULT.FAIL')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
