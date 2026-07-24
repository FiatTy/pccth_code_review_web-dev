import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scans } from '../data/mockData.js';

/*
 * LogViewer — port of logviewer.component.html (i18n).
 * Report header + a terminal-style detailed analysis log.
 */
const sampleLog = [
  { level: 'INFO', text: 'SonarScanner 5.0.1 started' },
  { level: 'INFO', text: 'Load project settings for component' },
  { level: 'INFO', text: 'Indexing files...' },
  { level: 'WARN', text: 'Coverage report not found for some modules' },
  { level: 'INFO', text: 'Sensor JavaSensor [java] (done) | time=842ms' },
  { level: 'ERROR', text: 'Quality gate threshold exceeded: vulnerabilities > 0' },
  { level: 'INFO', text: 'ANALYSIS SUCCESSFUL, you can browse the results' },
];

const levelColor = { INFO: '#38bdf8', WARN: '#f59e0b', ERROR: '#ef4444' };

export default function LogViewer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { scanId } = useParams();
  const scan = scans.find((s) => s.scanId === scanId) || scans[0];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-icon" title={t('LOG_VIEWER.BACK_TOOLTIP')} onClick={() => navigate('/scanhistory')}><i className="bi bi-chevron-left"></i></button>
          <div>
            <h1>{t('LOG_VIEWER.REPORT_TITLE', { name: scan.project.name })}</h1>
            <p>{t('LOG_VIEWER.EXECUTED_ON', { date: new Date(scan.startedAt).toLocaleString() })}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline"><i className="bi bi-download"></i> {t('LOG_VIEWER.DOWNLOAD')}</button>
          <button className="btn btn-outline"><i className="bi bi-printer"></i> {t('LOG_VIEWER.PRINT')}</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid-4">
        <div className="stat-card"><div className="stat-icon bg-blue"><i className="bi bi-activity"></i></div><div className="stat-info"><h3>{scan.status}</h3><span>{t('LOG_VIEWER.STATUS')}</span></div></div>
        <div className="stat-card"><div className="stat-icon bg-green"><i className="bi bi-stopwatch"></i></div><div className="stat-info"><h3>6m 12s</h3><span>{t('LOG_VIEWER.DURATION')}</span></div></div>
        <div className="stat-card"><div className="stat-icon bg-orange"><i className="bi bi-cpu"></i></div><div className="stat-info"><h3>{scan.project.projectType}</h3><span>{t('LOG_VIEWER.SCANNER_TYPE')}</span></div></div>
        <div className="stat-card"><div className="stat-icon bg-red"><i className="bi bi-exclamation-triangle"></i></div><div className="stat-info"><h3>{sampleLog.filter((l) => l.level === 'ERROR').length}</h3><span>{t('LOG_VIEWER.ERRORS_WITH_COUNT', { count: sampleLog.filter((l) => l.level === 'ERROR').length })}</span></div></div>
      </div>

      {/* Log terminal */}
      <div className="card mt-16">
        <div className="card-header-flex"><h3><i className="bi bi-terminal"></i> {t('LOG_VIEWER.DETAILED_ANALYSIS_LOGS')}</h3></div>
        <div style={{ background: '#0b1220', borderRadius: 10, padding: 16, fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.7, overflowX: 'auto' }}>
          {sampleLog.map((l, idx) => (
            <div key={idx}>
              <span style={{ color: '#64748b' }}>{String(idx + 1).padStart(2, '0')} </span>
              <span style={{ color: levelColor[l.level], fontWeight: 700 }}>[{l.level}]</span>{' '}
              <span style={{ color: '#e2e8f0' }}>{l.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
