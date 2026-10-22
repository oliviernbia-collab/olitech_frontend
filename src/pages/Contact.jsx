import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';
import ContactForm from '../components/ContactForm';
import { useSettings } from '../context/SettingsContext';
import './Contact.css';

function Contact() {
  const { settings } = useSettings();
  const phone = settings?.phone || '05 54 18 33 78';
  const email = settings?.email || 'oliviernbia@gmail.com';
  const website = settings?.website || 'olitechnologie.com';
  const phoneHref = phone.replace(/\s+/g, '');
  const websiteHref = `https://${website.replace(/^https?:\/\//, '')}`;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Contactez-nous</h1>
          <p>Une question, un projet ? Écrivez-nous, nous vous répondrons rapidement.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact__grid">
          <div className="contact__info">
            <h2>Nos coordonnées</h2>
            <ul>
              <li>
                <FontAwesomeIcon icon={faPhone} />
                <a href={`tel:${phoneHref}`}>{phone}</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} />
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <FontAwesomeIcon icon={faGlobe} />
                <a href={websiteHref} target="_blank" rel="noreferrer">{website}</a>
              </li>
            </ul>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}

export default Contact;
