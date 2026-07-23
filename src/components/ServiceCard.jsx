import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIcon } from '../data/iconMap';
import './ServiceCard.css';

function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <div className="service-card__icon">
        <FontAwesomeIcon icon={getIcon(service.icon_key)} />
      </div>
      <h3>{service.title}</h3>
      {service.subtitle && <p className="service-card__subtitle">{service.subtitle}</p>}
      <p>{service.description}</p>
    </article>
  );
}

export default ServiceCard;
