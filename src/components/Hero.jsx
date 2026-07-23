import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPhone } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '../context/SettingsContext';
import heroImage1 from '../assets/Dev2.jpg';
import heroImage2 from '../assets/Dev5.jpg';
import heroImage3 from '../assets/Dev7.jpg';
import './Hero.css';

const heroImages = [heroImage1, heroImage2, heroImage3];
const SLIDE_INTERVAL = 5000;

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { settings } = useSettings();
  const phone = settings?.phone || '05 54 18 33 78';
  const phoneHref = phone.replace(/\s+/g, '');

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <span className="hero__eyebrow">Divers domaines de l'informatique</span>
          <h1>
            Votre partenaire informatique <span>de confiance</span>
          </h1>
          <p>
            Programmation web et mobile, cybersécurité, infographie, bureautique,
            installation logicielle, vidéosurveillance... OliTech accompagne particuliers
            et entreprises dans tous leurs besoins informatiques.
          </p>
          <div className="hero__actions">
            <Link to="/contact" className="btn btn-primary">
              Demander un devis <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <a href={`tel:${phoneHref}`} className="btn btn-outline">
              <FontAwesomeIcon icon={faPhone} /> {phone}
            </a>
          </div>
        </div>

        <div className="hero__media">
          {heroImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt="Développement informatique OliTech"
              className={`hero__slide ${index === activeSlide ? 'is-active' : ''}`}
            />
          ))}

          <div className="hero__dots">
            {heroImages.map((src, index) => (
              <button
                key={src}
                type="button"
                className={`hero__dot ${index === activeSlide ? 'is-active' : ''}`}
                aria-label={`Afficher l'image ${index + 1}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
