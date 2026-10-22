import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '../context/SettingsContext';
import logo from '../assets/logo.png';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSettings();

  const phone = settings?.phone || '05 54 18 33 78';
  const email = settings?.email || 'oliviernbia@gmail.com';
  const website = settings?.website || 'olitechnologie.com';
  const phoneHref = phone.replace(/\s+/g, '');

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src={logo} alt="OliTech" />
          <p>Divers domaines de l'informatique.</p>
        </div>

        <div className="footer__col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/a-propos">A propos</a></li>
            <li><a href="/realisations">Réalisations</a></li>
            <li><a href="/cv">CV</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <ul>
            <li>
              <FontAwesomeIcon icon={faPhone} /> <a href={`tel:${phoneHref}`}>{phone}</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} /> <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faGlobe} /> <a href={`https://${website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer">{website}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          &copy; {year} OliTech. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
