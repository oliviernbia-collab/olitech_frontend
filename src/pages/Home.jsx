import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import SectionTitle from '../components/SectionTitle';
import Partners from '../components/Partners';
import { fetchServices } from '../api/servicesApi';
import strengthsImage from '../assets/Dev1.jpg';
import './Home.css';

const strengths = [
  'Des solutions adaptées à chaque domaine de l\'informatique',
  'Un accompagnement personnalisé, du conseil à la mise en œuvre',
  'Une équipe réactive et à l\'écoute de vos besoins',
];

function Home() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch((err) => console.error('Impossible de charger les services:', err.message));
  }, []);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container">
          <SectionTitle
            title="Nos services"
            subtitle="OliTech intervient sur divers domaines de l'informatique pour répondre à tous vos besoins."
          />
          <div className="grid grid-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="home__more">
            <Link to="/services" className="btn btn-primary">
              Voir tous nos services <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container home__strengths-grid">
          <div className="home__strengths-image">
            <img src={strengthsImage} alt="Technologie et innovation OliTech" />
          </div>
          <div>
            <SectionTitle title="Pourquoi choisir OliTech ?" />
            <ul className="home__strengths">
              {strengths.map((item) => (
                <li key={item}>
                  <FontAwesomeIcon icon={faCheck} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section home__cta">
        <div className="container home__cta-inner">
          <div>
            <h2>Un projet informatique en tête ?</h2>
            <p>Contactez-nous dès aujourd'hui pour en discuter.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Nous contacter <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>

      <Partners />
    </>
  );
}

export default Home;
