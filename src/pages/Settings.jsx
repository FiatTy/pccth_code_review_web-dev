import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/*
 * Settings — condensed port of setting-web/sonarqubeconfig.component.html (i18n).
 * Server configuration + quality gate thresholds. Prototype only: no persistence.
 */
export default function Settings() {
  const { t } = useTranslation();
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1><i className="bi bi-gear-fill"></i> {t('SONARQUBE_CONFIG.TITLE')}</h1>
          <p>{t('SONARQUBE_CONFIG.SERVER_CONFIG')}</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header-flex"><h3>{t('SONARQUBE_CONFIG.SERVER_CONFIG')}</h3></div>
          <div className="input-group">
            <label>{t('SONARQUBE_CONFIG.SERVER_URL')}</label>
            <input className="form-control" defaultValue="http://localhost:9000" />
          </div>
          <div className="input-group">
            <label>{t('SONARQUBE_CONFIG.AUTH_TOKEN')}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-control" type={showToken ? 'text' : 'password'} defaultValue="squ_examn_tokEN_1234" style={{ flex: 1 }} />
              <button className="btn btn-outline btn-sm" onClick={() => setShowToken((v) => !v)}>
                {showToken ? t('SONARQUBE_CONFIG.HIDE') : t('SONARQUBE_CONFIG.SHOW')}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>{t('SONARQUBE_CONFIG.GIT_TOKEN')}</label>
            <input className="form-control" type="password" placeholder={t('REPOSITORY.TOKEN_PLACEHOLDER')} />
          </div>
          <div className="input-group">
            <label>{t('SONARQUBE_CONFIG.DEFAULT_ORG')}</label>
            <input className="form-control" defaultValue="pccth" />
          </div>
        </div>

        <div className="card">
          <div className="card-header-flex"><h3>{t('SONARQUBE_CONFIG.QUALITY_GATES')}</h3></div>
          <label style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input type="checkbox" defaultChecked /> {t('SONARQUBE_CONFIG.FAIL_ON_ERROR')}
          </label>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="input-group">
              <label>{t('SONARQUBE_CONFIG.COVERAGE_THRESHOLD')}</label>
              <input className="form-control" type="number" defaultValue={80} />
            </div>
            <div className="input-group">
              <label>{t('SONARQUBE_CONFIG.MAX_BUGS')}</label>
              <input className="form-control" type="number" defaultValue={5} />
            </div>
            <div className="input-group">
              <label>{t('SONARQUBE_CONFIG.MAX_VULNERABILITIES')}</label>
              <input className="form-control" type="number" defaultValue={0} />
            </div>
            <div className="input-group">
              <label>{t('SONARQUBE_CONFIG.MAX_CODE_SMELLS')}</label>
              <input className="form-control" type="number" defaultValue={50} />
            </div>
          </div>
        </div>
      </div>

      <div className="actions-row">
        <button className="btn btn-outline"><i className="bi bi-wifi"></i> {t('SONARQUBE_CONFIG.TEST_CONNECTION')}</button>
        <button className="btn btn-outline">{t('SONARQUBE_CONFIG.RESET')}</button>
        <button className="btn btn-primary"><i className="bi bi-save"></i> {t('SONARQUBE_CONFIG.SAVE_SETTINGS')}</button>
      </div>
    </div>
  );
}
