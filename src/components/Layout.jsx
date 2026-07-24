import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

/*
 * Layout — port of layout.component.html (app-container > navbar + main).
 * Adds the floating theme toggle button that lived in app.component.html,
 * plus a mobile hamburger to open the sidebar.
 */
export default function Layout() {
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-container">
      <button className="hamburger" onClick={() => setNavOpen(true)} aria-label="Open menu">
        <i className="bi bi-list"></i>
      </button>

      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="main-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>

      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title={darkMode ? t('COMMON.SWITCH_LIGHT') : t('COMMON.SWITCH_DARK')}
      >
        <i className={'bi ' + (darkMode ? 'bi-sun-fill' : 'bi-moon-fill')}></i>
      </button>
    </div>
  );
}
