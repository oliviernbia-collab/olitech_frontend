import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faEye, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '../context/SettingsContext';
import ceoPhoto from '../assets/ceo.png';
import introImage from '../assets/Dev5.jpg';
import './About.css';

function About() {
  const { settings } = useSettings();

  const intro1 =
    settings?.intro_paragraph_1 ||
    "OliTech est une entreprise spécialisée dans les services informatiques : programmation web et mobile, cybersécurité, infographie, bureautique, installation de logiciels et systèmes d'exploitation, création de pages Facebook, suivi d'entreprise et installation de caméras de surveillance.";
  const intro2 =
    settings?.intro_paragraph_2 ||
    "Notre mission est d'accompagner particuliers et entreprises avec des solutions informatiques fiables, accessibles et adaptées à leurs besoins.";
  const mission = settings?.mission_text || "Simplifier l'informatique pour nos clients, quel que soit leur besoin.";
  const vision = settings?.vision_text || 'Devenir une référence locale en solutions informatiques polyvalentes.';
  const valeurs = settings?.valeurs_text || 'Confiance, réactivité et rigueur dans chaque prestation.';
  const ceoName = settings?.ceo_name || "N'BIA KAMENAN OLIVIER";
  const ceoTitle = settings?.ceo_title || 'Ingénieur Full Stack et DevOps';
  const ceoBio =
    settings?.ceo_bio ||
    "À la tête d'OliTech, notre fondateur met son expertise technique et son sens du service au profit de chaque client, du premier contact jusqu'à la livraison du projet.";

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>À propos d'OliTech</h1>
          <p>Une entreprise engagee dans divers domaines de l'informatique.</p>
        </div>
      </section>

      <section className="section">
        <div className="container about__intro">
          <div>
            <img src={introImage} alt="Equipe technique OliTech au travail" className="about__intro-image" />
            <h2>Qui sommes-nous ?</h2>
            <p>{intro1}</p>
            <p>{intro2}</p>
          </div>

          <div className="about__values">
            <div className="about__value">
              <FontAwesomeIcon icon={faBullseye} />
              <div>
                <h4>Notre mission</h4>
                <p>{mission}</p>
              </div>
            </div>
            <div className="about__value">
              <FontAwesomeIcon icon={faEye} />
              <div>
                <h4>Notre vision</h4>
                <p>{vision}</p>
              </div>
            </div>
            <div className="about__value">
              <FontAwesomeIcon icon={faHandshake} />
              <div>
                <h4>Nos valeurs</h4>
                <p>{valeurs}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container about__ceo">
          <div className="about__ceo-photo-wrap">
            <img src={ceoPhoto} alt="PDG d'OliTech" className="about__ceo-photo" />
            <p className="about__ceo-name">{ceoName}</p>
            <p className="about__ceo-title">{ceoTitle}</p>
          </div>
          <div>
            <span className="about__ceo-role">Fondateur &amp; Directeur Général</span>
            <h2>Un accompagnement de proximite</h2>
            <p>{ceoBio}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
