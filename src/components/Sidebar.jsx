import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { currentUser } from '../data/mockData.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';

/*
 * Sidebar — port of navbar.component.html / .ts.
 * Vertical navigation with a collapsible Report + Setting submenu, an
 * admin-only User Management link, a language switcher and a logout action.
 */
export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [reportOpen, setReportOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const isAdmin = currentUser.role === 'ADMIN';

  const mainLinks = [
    { to: '/dashboard', icon: 'bi-speedometer2', label: t('NAV.DASHBOARD') },
    { to: '/repositories', icon: 'bi-folder-fill', label: t('NAV.REPOSITORIES') },
    { to: '/scanhistory', icon: 'bi-clock-history', label: t('NAV.SCAN_HISTORY') },
    { to: '/issue', icon: 'bi-exclamation-circle-fill', label: t('NAV.ISSUE') },
    { to: '/analysis', icon: 'bi-graph-up', label: t('NAV.ANALYTICS') },
  ];

  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '');
  const subClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <>
      <div className={'navbar-backdrop' + (open ? ' open' : '')} onClick={onClose} />
      <nav className={'vertical-navbar' + (open ? ' open' : '')}>
        <div className="brand">
          <img src="/logo.svg" alt="logo" />
          <span>
            PCCTH <br /> Code Review
          </span>
        </div>

        <ul className="nav-list">
          {mainLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={linkClass} onClick={onClose}>
                <i className={'bi ' + l.icon}></i> {l.label}
              </NavLink>
            </li>
          ))}

          {/* Report submenu */}
          <li>
            <div className="nav-link" onClick={() => setReportOpen((v) => !v)}>
              <i className="bi bi-file-earmark-text-fill"></i> {t('NAV.REPORT')}
              <i className={'bi chevron ' + (reportOpen ? 'bi-chevron-up' : 'bi-chevron-down')}></i>
            </div>
            {reportOpen && (
              <ul className="submenu">
                <li><NavLink to="/generatereport" className={subClass} onClick={onClose}>{t('NAV.GENERATE_REPORT')}</NavLink></li>
                <li><NavLink to="/reporthistory" className={subClass} onClick={onClose}>{t('NAV.REPORT_HISTORY')}</NavLink></li>
              </ul>
            )}
          </li>

          <li className="nav-spacer"></li>

          <LanguageSwitcher />

          {/* Setting submenu */}
          <li>
            <div className="nav-link" onClick={() => setSettingOpen((v) => !v)}>
              <i className="bi bi-gear-fill"></i> {t('NAV.SETTING')}
              <i className={'bi chevron ' + (settingOpen ? 'bi-chevron-down' : 'bi-chevron-up')}></i>
            </div>
            {settingOpen && (
              <ul className="submenu">
                <li><NavLink to="/sonarqubeconfig" className={subClass} onClick={onClose}>{t('NAV.SONARQUBE_CONFIG')}</NavLink></li>
                <li><NavLink to="/notificationsetting" className={subClass} onClick={onClose}>{t('NAV.NOTIFICATION_SETTING')}</NavLink></li>
                {isAdmin && (
                  <li><NavLink to="/usermanagement" className={subClass} onClick={onClose}>{t('NAV.USER_MANAGEMENT')}</NavLink></li>
                )}
              </ul>
            )}
          </li>

          <li>
            <div className="nav-link nav-logout" onClick={() => navigate('/login')}>
              <i className="bi bi-box-arrow-right"></i> {t('NAV.LOGOUT')}
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
