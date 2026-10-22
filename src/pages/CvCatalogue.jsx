import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { fetchCvTemplates } from '../api/cvApi';
import { getLayoutComponent } from '../cvTemplates/registry';
import { getPalette } from '../cvTemplates/palettes';
import { sampleCvData } from '../cvTemplates/sampleData';
import heroBg from '../assets/Dev4.jpg';
import './CvCatalogue.css';

function CvPreviewThumb({ template }) {
  const Layout = getLayoutComponent(template.layout_key);
  return (
    <div className="cv-thumb">
      <div className="cv-thumb__scale">
        <Layout data={sampleCvData} palette={getPalette(template.palette_key)} />
      </div>
    </div>
  );
}

function CvCatalogue() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCvTemplates()
      .then(setTemplates)
      .catch(() => setError("Impossible de charger les modeles de CV pour le moment."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section
        className="page-hero page-hero--image"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="container">
          <h1>CV professionnels</h1>
          <p>
            Choisissez un modele, personnalisez-le avec vos informations et telechargez votre
            CV pret a l'emploi pour <strong>300 FCFA</strong>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <p className="cv-catalogue__status">Chargement des modeles...</p>}
          {error && <p className="cv-catalogue__status cv-catalogue__status--error">{error}</p>}

          {!loading && !error && (
            <div className="cv-catalogue__grid">
              {templates.map((template) => (
                <article className="cv-card" key={template.id}>
                  <CvPreviewThumb template={template} />
                  <div className="cv-card__body">
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                    <div className="cv-card__footer">
                      <span className="cv-card__price">{Number(template.price_fcfa)} FCFA</span>
                      <Link to={`/cv/commande/${template.slug}`} className="btn btn-primary">
                        Choisir ce modele <FontAwesomeIcon icon={faArrowRight} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default CvCatalogue;
