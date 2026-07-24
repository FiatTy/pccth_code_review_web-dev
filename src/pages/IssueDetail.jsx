import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { issues } from '../data/mockData.js';

/*
 * IssueDetail — port of issuedetail.component.html (i18n).
 * Basic info, status & priority, assignment, vulnerable code + AI fix,
 * and a comments section. Prototype only.
 */
export default function IssueDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { issuesId } = useParams();
  const issue = issues.find((i) => i.id === issuesId) || issues[0];
  const [aiFix, setAiFix] = useState('');
  const [loading, setLoading] = useState(false);

  const generateFix = () => {
    setLoading(true);
    setTimeout(() => {
      setAiFix('// Suggested fix\n// Sanitize the query parameter before use\nconst safe = escapeSql(input);\nrepository.query(safe);');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-icon" onClick={() => navigate('/issue')}><i className="bi bi-chevron-left"></i></button>
          <div>
            <h1>{issue.message}</h1>
            <p>{t('ISSUE_DETAIL.BACK_TO_ISSUE')}</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header-flex"><h3>{t('ISSUE_DETAIL.BASIC_INFO')}</h3></div>
          <p><strong>{t('ISSUE_DETAIL.ID')}:</strong> {issue.id}</p>
          <p><strong>{t('ISSUE_DETAIL.TYPE')}:</strong> {issue.type}</p>
          <p><strong>{t('ISSUE_DETAIL.FILE')}:</strong> <code>{issue.component}</code></p>
        </div>
        <div className="card">
          <div className="card-header-flex"><h3>{t('ISSUE_DETAIL.STATUS_PRIORITY')}</h3></div>
          <p><strong>{t('ISSUE_DETAIL.SEVERITY')}:</strong> <span className={'severity-badge ' + issue.severity.toLowerCase()}>{issue.severity}</span></p>
          <p><strong>{t('ISSUE_DETAIL.STATUS')}:</strong> {issue.status}</p>
          <p><strong>{t('ISSUE_DETAIL.ASSIGNED_TO')}:</strong> {issue.assignee || t('ISSUE_DETAIL.NO_ASSIGNEE')}</p>
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-header-flex">
          <h3>{t('ISSUE_DETAIL.VULNERABLE_CODE')}</h3>
        </div>
        <pre style={{ background: '#0b1220', color: '#e2e8f0', padding: 16, borderRadius: 10, overflowX: 'auto', fontSize: '0.82rem' }}>
{`const result = repository.query("SELECT * FROM users WHERE id = " + input);`}
        </pre>

        <div className="card-header-flex" style={{ marginTop: 16 }}>
          <h3>{t('ISSUE_DETAIL.RECOMMENDATION')}</h3>
          <button className="btn btn-primary btn-sm" onClick={generateFix} disabled={loading}>
            <i className="bi bi-robot"></i> {loading ? t('ISSUE_DETAIL.GENERATING_AI_FIX') : t('ISSUE_DETAIL.GENERATE_AI_FIX')}
          </button>
        </div>
        {aiFix ? (
          <pre style={{ background: 'var(--bg-panel)', color: 'var(--text-main)', padding: 16, borderRadius: 10, overflowX: 'auto', fontSize: '0.82rem', border: '1px solid var(--success)' }}>{aiFix}</pre>
        ) : (
          <p className="text-muted">{t('ISSUE_DETAIL.SUGGESTED_SOLUTION')}</p>
        )}
      </div>

      <div className="card mt-16">
        <div className="card-header-flex"><h3>{t('ISSUE_DETAIL.COMMENTS')}</h3></div>
        <p className="text-muted">{t('ISSUE_DETAIL.NO_COMMENTS_YET')}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input className="form-control" style={{ flex: 1 }} placeholder={t('ISSUE_DETAIL.WRITE_COMMENT_PLACEHOLDER')} />
          <button className="btn btn-primary"><i className="bi bi-send"></i></button>
        </div>
      </div>
    </div>
  );
}
