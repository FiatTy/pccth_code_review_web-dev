import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { users as allUsers } from '../data/mockData.js';

/*
 * UserManagement — port of usermanagement.component.html (i18n).
 * Admin-only in the original (roleGuard(['ADMIN'])). Searchable user table.
 */
export default function UserManagement() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = allUsers.filter((u) => u.username.toLowerCase().includes(search.toLowerCase()));

  const statusBadge = (s) => {
    const verified = s === 'VERIFIED';
    return <span className={'status-badge ' + (verified ? 'success' : 'scanning')}>{verified ? 'VERIFIED' : 'PENDING'}</span>;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-people-fill"></i> {t('SETTING.USER.TITLE')}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="search-input">
            <i className="bi bi-search"></i>
            <input placeholder={t('USER_MGT.SEARCH_PLACEHOLDER')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary-gradient"><i className="bi bi-plus-lg"></i> {t('USER_MGT.ADD_USER')}</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('SETTING.USER.USERNAME')}</th>
                <th>{t('SETTING.USER.EMAIL')}</th>
                <th>{t('USER_MGT.PHONE')}</th>
                <th>{t('SETTING.USER.ROLE')}</th>
                <th>{t('SETTING.USER.STATUS')}</th>
                <th>{t('SETTING.USER.ACTIONS')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="repo-identity">
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      {u.username}
                    </div>
                  </td>
                  <td className="text-muted">{u.email}</td>
                  <td>{u.phone}</td>
                  <td><span className={'severity-badge ' + (u.role === 'ADMIN' ? 'major' : 'info')}>{u.role}</span></td>
                  <td>{statusBadge(u.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon btn-edit"><i className="bi bi-pencil"></i></button>
                      <button className="btn-icon btn-delete"><i className="bi bi-trash"></i></button>
                    </div>
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
