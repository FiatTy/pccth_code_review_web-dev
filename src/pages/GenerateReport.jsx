import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { repositories } from '../data/mockData.js';

/*
 * GenerateReport — condensed port of generatereport.component.html (i18n).
 * Project multi-select, date range, sections checklist and output format.
 * Prototype only: "Generate" shows a confirmation message.
 */
const sectionKeys = ['QualityGateSummary', 'IssueBreakdown', 'SecurityAnalysis', 'TechnicalDebt', 'Recommendations'];
const formats = [
  { id: 'pdf', label: 'PDF', icon: 'bi-file-earmark-pdf' },
  { id: 'excel', label: 'Excel', icon: 'bi-file-earmark-excel' },
  { id: 'word', label: 'Word', icon: 'bi-file-earmark-word' },
  { id: 'ppt', label: 'PowerPoint', icon: 'bi-file-earmark-ppt' },
];

export default function GenerateReport() {
  const { t } = useTranslation();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [sections, setSections] = useState(sectionKeys);
  const [format, setFormat] = useState('pdf');
  const [done, setDone] = useState(false);

  const toggle = (arr, setArr, value) =>
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-file-earmark-plus"></i> {t('GENERATE_REPORT.TITLE')}</h1>
          <p>{t('GENERATE_REPORT.PROJECTS_TO_INCLUDE')}</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header-flex"><h3>{t('GENERATE_REPORT.PROJECTS_TO_INCLUDE')}</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {repositories.map((r) => (
              <label key={r.projectId} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedProjects.includes(r.name)} onChange={() => toggle(selectedProjects, setSelectedProjects, r.name)} />
                <span className={'text-' + (r.projectTypeLabel === 'ANGULAR' ? 'angular' : 'spring')}>
                  <i className={'bi ' + (r.projectTypeLabel === 'ANGULAR' ? 'bi-code-slash' : 'bi-filetype-java')}></i>
                </span>
                {r.name}
              </label>
            ))}
          </div>

          <div className="card-header-flex" style={{ marginTop: 20 }}><h3>{t('GENERATE_REPORT.DATE_RANGE')}</h3></div>
          <div className="filter-row" style={{ marginBottom: 0 }}>
            <input type="date" className="form-control" />
            <span>{t('REPORT_HISTORY.TO')}</span>
            <input type="date" className="form-control" />
          </div>
        </div>

        <div className="card">
          <div className="card-header-flex"><h3>{t('GENERATE_REPORT.INCLUDE_SECTIONS')}</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sectionKeys.map((s) => (
              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={sections.includes(s)} onChange={() => toggle(sections, setSections, s)} />
                {t('GENERATE_REPORT.SECTIONS.' + s)}
              </label>
            ))}
          </div>

          <div className="card-header-flex" style={{ marginTop: 20 }}><h3>{t('GENERATE_REPORT.OUTPUT_FORMAT')}</h3></div>
          <div className="filter-tabs">
            {formats.map((f) => (
              <button key={f.id} className={'tab-btn' + (format === f.id ? ' active' : '')} onClick={() => setFormat(f.id)}>
                <i className={'bi ' + f.icon}></i> {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="actions-row">
        <button className="btn btn-outline">{t('GENERATE_REPORT.CANCEL')}</button>
        <button className="btn btn-primary-gradient" onClick={() => setDone(true)} disabled={selectedProjects.length === 0}>
          <i className="bi bi-gear"></i> {t('GENERATE_REPORT.GENERATE')}
        </button>
      </div>

      {done && (
        <div className="card mt-16" style={{ borderColor: 'var(--success)' }}>
          <i className="bi bi-check-circle-fill" style={{ color: 'var(--success)' }}></i>{' '}
          {t('GENERATE_REPORT.SNACKBAR.SUCCESS')} — <strong>{selectedProjects.join(', ')}</strong> ({format.toUpperCase()}, {sections.length}).
        </div>
      )}
    </div>
  );
}
