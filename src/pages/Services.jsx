import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import ServiceCard from '../components/ServiceCard';
import { fetchServices } from '../api/servicesApi';
import heroBg from '../assets/Dev3.jpg';
import techImage from '../assets/Dev6.jpg';
import './Services.css';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch((err) => console.error('Impossible de charger les services:', err.message));
  }, []);

  return (
    <>
      <section
        className="page-hero page-hero--image"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="container">
          <h1>Nos services</h1>
          <p>Divers domaines de l'informatique, pour particuliers et entreprises.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="services__other">
            <FontAwesomeIcon icon={faEllipsis} />
            <div>
              <h3>Autre...</h3>
              <p>Et bien plus encore. Parlez-nous de votre besoin, nous trouverons une solution.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container services__tech">
          <img src={techImage} alt="Technologies web maîtrisées par OliTech" />
          <div>
            <h2>Des technologies maîtrisées</h2>
            <p>
              HTML, CSS, JavaScript et bien d'autres outils modernes nous permettent
              de concevoir des solutions web et mobiles performantes, fiables et
              adaptees aux standards actuels.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
