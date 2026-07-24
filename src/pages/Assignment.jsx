import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { assignments } from '../data/mockData.js';

/*
 * Assignment — port of assignment.component.html (i18n).
 * Table of issues assigned to developers.
 */
export default function Assignment() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-icon" onClick={() => navigate('/issue')}><i className="bi bi-chevron-left"></i></button>
          <div>
            <h1><i className="bi bi-person-badge"></i> {t('MY_ASSIGNMENTS.TITLE')}</h1>
            <p>{t('MY_ASSIGNMENTS.TABLE_CAPTION')}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('MY_ASSIGNMENTS.COL_ASSIGNED_TO')}</th>
                <th>{t('MY_ASSIGNMENTS.COL_ISSUE')}</th>
                <th>{t('MY_ASSIGNMENTS.COL_SEVERITY')}</th>
                <th>{t('MY_ASSIGNMENTS.COL_CREATE_DATE')}</th>
                <th>{t('MY_ASSIGNMENTS.COL_STATUS')}</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.issueId}>
                  <td>
                    <div className="repo-identity">
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                        {a.assignee.charAt(0).toUpperCase()}
                      </div>
                      {a.assignee}
                    </div>
                  </td>
                  <td>{a.message}</td>
                  <td><span className={'severity-badge ' + a.severity.toLowerCase()}>{a.severity}</span></td>
                  <td className="text-muted">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><span className={'status-badge ' + (a.status === 'RESOLVED' ? 'success' : a.status === 'IN_PROGRESS' ? 'scanning' : 'failed')}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
