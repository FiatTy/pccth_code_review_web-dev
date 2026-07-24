import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/*
 * NotificationSetting — port of notificationsetting.component.html (i18n).
 * Toggle switches for notification types. Prototype only.
 */
const types = ['SCANS_COMPLETED', 'ISSUES', 'SYSTEM_ALERTS', 'REPORTS_EXPORTS'];

export default function NotificationSetting() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState({ SCANS_COMPLETED: true, ISSUES: true, SYSTEM_ALERTS: false, REPORTS_EXPORTS: true });
  const [saved, setSaved] = useState(false);

  const toggle = (k) => { setEnabled((e) => ({ ...e, [k]: !e[k] })); setSaved(false); };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-bell-fill"></i> {t('NOTIFICATION_SETTINGS.TITLE')}</h1>
          <p>{t('NOTIFICATION_SETTINGS.TYPES')}</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        {types.map((k) => (
          <label key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px', borderBottom: '1px solid var(--table-border)', cursor: 'pointer' }}>
            <span>{t('NOTIFICATION_SETTINGS.' + k)}</span>
            <input type="checkbox" checked={enabled[k]} onChange={() => toggle(k)} style={{ width: 18, height: 18 }} />
          </label>
        ))}

        <div className="actions-row">
          <button className="btn btn-outline" onClick={() => { setEnabled({ SCANS_COMPLETED: true, ISSUES: true, SYSTEM_ALERTS: true, REPORTS_EXPORTS: true }); setSaved(false); }}>
            {t('NOTIFICATION_SETTINGS.RESET')}
          </button>
          <button className="btn btn-primary" onClick={() => setSaved(true)}>{t('NOTIFICATION_SETTINGS.SAVE')}</button>
        </div>
        {saved && <p style={{ color: 'var(--success)' }}><i className="bi bi-check-circle-fill"></i> {t('NOTIFICATION_SETTINGS.CONFIRM_SAVE_TEXT')}</p>}
      </div>
    </div>
  );
}
