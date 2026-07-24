import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/*
 * ForgotPassword — port of forgot-password.component.html (i18n).
 * Prototype: submit shows a confirmation message.
 */
export default function ForgotPassword() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="welcome-section">
          <h1>{t('FORGOT_PASSWORD.TITLE')}</h1>
          <p>{t('FORGOT_PASSWORD.DESC')}</p>
        </div>
        <div className="login-box">
          <h2>{t('FORGOT_PASSWORD.FORM_TITLE')}</h2>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="input-group">
              <label>{t('FORGOT_PASSWORD.EMAIL_LABEL')}</label>
              <input type="email" placeholder={t('FORGOT_PASSWORD.EMAIL_PLACEHOLDER')} />
            </div>
            <button type="submit">{t('FORGOT_PASSWORD.SEND_RESET_LINK')}</button>
          </form>
          {sent && (
            <p style={{ color: 'var(--success)', marginTop: 12 }}>
              <i className="bi bi-check-circle-fill"></i> {t('FORGOT_PASSWORD.SNACK_LINK_SENT')}
            </p>
          )}
          <div className="extra-links">
            <p><Link to="/login"><i className="bi bi-chevron-left"></i> {t('FORGOT_PASSWORD.GO_BACK')}</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
