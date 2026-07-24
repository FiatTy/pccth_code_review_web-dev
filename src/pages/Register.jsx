import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';

/*
 * Register — port of register.component.html (i18n). Prototype: submit → login.
 */
export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="welcome-section">
          <h1>{t('REGISTER.WELCOME_TITLE')}</h1>
          <p>{t('REGISTER.WELCOME_TEXT')}</p>
        </div>
        <div className="login-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{t('REGISTER.TITLE')}</h2>
            <LanguageSwitcher />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); navigate('/login'); }}>
            <div className="input-group">
              <label>{t('REGISTER.USERNAME')}</label>
              <input placeholder={t('REGISTER.USERNAME_PLACEHOLDER')} />
            </div>
            <div className="input-group">
              <label>{t('AUTH.EMAIL')}</label>
              <input type="email" placeholder={t('REGISTER.EMAIL_PLACEHOLDER')} />
            </div>
            <div className="input-group">
              <label>{t('REGISTER.PHONE_NUMBER')}</label>
              <input placeholder={t('REGISTER.PHONE_PLACEHOLDER')} />
            </div>
            <div className="input-group">
              <label>{t('AUTH.PASSWORD')}</label>
              <input type="password" placeholder={t('REGISTER.PASSWORD_PLACEHOLDER')} />
            </div>
            <div className="input-group">
              <label>{t('AUTH.CONFIRM_PASSWORD')}</label>
              <input type="password" placeholder={t('REGISTER.CONFIRM_PASSWORD_PLACEHOLDER')} />
            </div>
            <button type="submit">{t('REGISTER.BUTTON')}</button>
          </form>
          <div className="extra-links">
            <p>{t('REGISTER.ALREADY_HAVE_ACCOUNT')} <Link to="/login">{t('AUTH.LOGIN')}</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
