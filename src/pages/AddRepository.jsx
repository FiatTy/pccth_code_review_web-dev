import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { repositories } from '../data/mockData.js';

/*
 * AddRepository — port of addrepository.component.html (i18n).
 * Used for both "new" (/addrepository) and "edit" (/settingrepo/:projectId).
 * Prototype only: no persistence.
 */
export default function AddRepository() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const editing = repositories.find((r) => r.projectId === projectId);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn-icon" onClick={() => navigate('/repositories')}><i className="bi bi-chevron-left"></i></button>
          <div>
            <h1>{editing ? t('REPOSITORY.EDIT_REPOSITORY_TITLE') : t('REPOSITORY.NEW_REPOSITORY_TITLE')}</h1>
            <p>{t('REPOSITORY.CONFIGURE_CONN')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); navigate('/repositories'); }}>
        <div className="grid-2">
          <div className="card">
            <div className="card-header-flex"><h3>{t('REPOSITORY.PROJECT_DETAILS')}</h3></div>
            <div className="input-group">
              <label>{t('REPOSITORY.REPOSITORY_NAME')}</label>
              <input className="form-control" defaultValue={editing?.name} placeholder="my-project" required />
            </div>
            <div className="input-group">
              <label>{t('REPOSITORY.PROJECT_TYPE')}</label>
              <select className="form-select" defaultValue={editing?.projectTypeLabel || ''}>
                <option value="">{t('REPOSITORY.SELECT_FRAMEWORK')}</option>
                <option value="ANGULAR">Angular</option>
                <option value="SPRING_BOOT">Spring Boot</option>
              </select>
            </div>
            <div className="input-group">
              <label>{t('REPOSITORY.GIT_URL')}</label>
              <input className="form-control" defaultValue={editing?.repositoryUrl} placeholder="https://git.pccth.com/..." />
            </div>
            <div className="input-group">
              <label>{t('REPOSITORY.COST_PER_DAY')}</label>
              <input className="form-control" type="number" defaultValue={5000} />
            </div>
          </div>

          <div className="card">
            <div className="card-header-flex"><h3>{t('REPOSITORY.ANALYSIS_CONFIG')}</h3></div>
            <div className="input-group">
              <label>{t('REPOSITORY.SONAR_SERVER')}</label>
              <input className="form-control" defaultValue="http://localhost:9000" />
            </div>
            <div className="input-group">
              <label>{t('REPOSITORY.PROJECT_KEY')}</label>
              <input className="form-control" defaultValue={editing?.name?.replace(/-/g, '_')} />
            </div>
          </div>
        </div>

        <div className="actions-row">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/repositories')}>{t('REPOSITORY.CANCEL')}</button>
          <button type="submit" className="btn btn-primary-gradient"><i className="bi bi-save"></i> {t('REPOSITORY.SAVE_CHANGES')}</button>
        </div>
      </form>
    </div>
  );
}
