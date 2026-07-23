import elanLogo from '../assets/partner-elan.jpg';
import ntysLogo from '../assets/partner-ntsys.png';
import akfLogo from '../assets/partner-akf.png';
import './Partners.css';

const partners = [
  { name: 'Elan Digital', logo: elanLogo },
  { name: 'NtSys Consulting', logo: ntysLogo },
  { name: "Academy K²A Formation", logo: akfLogo },
];

// Duplique la liste pour un defilement en boucle continue
const track = [...partners, ...partners];

function Partners() {
  return (
    <section className="partners">
      <div className="container">
        <h2 className="partners__title">Nos partenaires</h2>
      </div>

      <div className="partners__marquee">
        <div className="partners__track">
          {track.map((partner, index) => (
            <div className="partners__logo" key={`${partner.name}-${index}`}>
              <img src={partner.logo} alt={partner.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
