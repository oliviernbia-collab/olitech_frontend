import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { getIcon } from '../data/iconMap';
import { fetchPortfolioItems } from '../api/portfolioApi';
import { getMediaUrl } from '../utils/mediaUrl';
import heroBg from '../assets/Dev7.jpg';
import codeImage from '../assets/Dev4.jpg';
import './Portfolio.css';

function Portfolio() {
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    fetchPortfolioItems()
      .then(setPortfolioItems)
      .catch((err) => console.error('Impossible de charger les réalisations:', err.message));
  }, []);

  return (
    <>
      <section
        className="page-hero page-hero--image"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="container">
          <h1>Réalisations</h1>
          <p>Quelques exemples illustratifs de ce que nous pouvons réaliser pour vous.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="portfolio__note">
            Ces exemples sont présentés à titre illustratif. Contactez-nous pour découvrir
            nos réalisations concrètes et discuter de votre projet.
          </p>

          <div className="grid grid-2">
            {portfolioItems.map((item) => (
              <article className={`portfolio-card ${item.image_url ? 'portfolio-card--with-image' : ''}`} key={item.id}>
                {item.image_url && (
                  <img
                    src={getMediaUrl(item.image_url)}
                    alt={item.title}
                    className="portfolio-card__image"
                  />
                )}
                <div className="portfolio-card__body">
                  <div className="portfolio-card__header">
                    {!item.image_url && (
                      <div className="portfolio-card__icon">
                        <FontAwesomeIcon icon={getIcon(item.icon_key)} />
                      </div>
                    )}
                    {item.category && <span className="portfolio-card__category">{item.category}</span>}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="portfolio-card__link"
                    >
                      Voir le projet <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container portfolio__workflow">
          <img src={codeImage} alt="Code source d'un projet OliTech" />
          <div>
            <h2>Notre façon de travailler</h2>
            <p>
              Chaque projet est développé avec rigueur : code propre, structure
              maintenable et suivi régulier avec le client, du cahier des charges
              jusqu'à la mise en production.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Portfolio;
