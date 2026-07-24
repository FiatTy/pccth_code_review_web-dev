import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';

/*
 * Login — port of login.component.html (with i18n).
 * Split welcome / form layout. Prototype: any input navigates to the
 * dashboard (no real authentication).
 */
export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="welcome-section">
          <h1 dangerouslySetInnerHTML={{ __html: t('LOGIN.WELCOME_TITLE') }} />
          <p>{t('LOGIN.WELCOME_TEXT')}</p>
        </div>

        <div className="login-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{t('AUTH.LOGIN')}</h2>
            <LanguageSwitcher />
          </div>
          <form onSubmit={onSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="email">{t('AUTH.EMAIL')}</label>
              <input id="email" type="email" placeholder={t('LOGIN.EMAIL_PLACEHOLDER')} defaultValue="benjawanad1996@gmail.com" />
            </div>
            <div className="input-group">
              <label htmlFor="password">{t('AUTH.PASSWORD')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input id="password" type={showPassword ? 'text' : 'password'} placeholder={t('LOGIN.PASSWORD_PLACEHOLDER')} defaultValue="demo1234" style={{ flex: 1 }} />
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowPassword((v) => !v)}>
                  <i className={'bi ' + (showPassword ? 'bi-eye-slash' : 'bi-eye')}></i>
                </button>
              </div>
            </div>
            <button type="submit">{t('AUTH.LOGIN_BUTTON')}</button>
          </form>

          <div className="extra-links">
            <p>{t('LOGIN.FORGOT_PASSWORD')} <Link to="/forgot-password">{t('AUTH.RESET_PASSWORD')}</Link></p>
            <p>{t('LOGIN.DONT_HAVE_ACCOUNT')} <Link to="/register">{t('AUTH.REGISTER')}</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
