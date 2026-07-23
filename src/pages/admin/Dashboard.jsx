import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faEnvelopeOpenText,
  faScrewdriverWrench,
  faBriefcase,
  faUserGroup,
  faHandshake,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { fetchContacts } from '../../api/contactsApi';
import { fetchServices } from '../../api/servicesApi';
import { fetchPortfolioItems } from '../../api/portfolioApi';
import { fetchTeamMembers } from '../../api/teamApi';
import { fetchClients } from '../../api/clientsApi';
import './admin.css';
import './Dashboard.css';

const shortcuts = [
  { to: '/admin/services', label: 'Ajouter un service' },
  { to: '/admin/realisations', label: 'Ajouter une réalisation' },
  { to: '/admin/equipe', label: 'Ajouter un membre' },
  { to: '/admin/clients', label: 'Ajouter un client/projet' },
];

function formatDate(value) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState([]);
  const [servicesCount, setServicesCount] = useState(0);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);

  useEffect(() => {
    Promise.all([
      fetchContacts(),
      fetchServices(),
      fetchPortfolioItems(),
      fetchTeamMembers(),
      fetchClients(),
    ])
      .then(([contactsData, services, portfolio, team, clients]) => {
        setContacts(contactsData);
        setServicesCount(services.length);
        setPortfolioCount(portfolio.length);
        setTeamCount(team.length);
        setClientsCount(clients.length);
      })
      .catch(() => setError('Impossible de charger le tableau de bord.'))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = contacts.filter((c) => !c.is_read).length;
  const recentContacts = contacts.slice(0, 5);

  const stats = [
    { label: 'Messages', value: contacts.length, icon: faEnvelope },
    { label: 'Messages non lus', value: unreadCount, icon: faEnvelopeOpenText, variant: 'alert' },
    { label: 'Services', value: servicesCount, icon: faScrewdriverWrench },
    { label: 'Réalisations', value: portfolioCount, icon: faBriefcase },
    { label: "Membres de l'équipe", value: teamCount, icon: faUserGroup },
    { label: 'Clients & projets', value: clientsCount, icon: faHandshake },
  ];

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de l'activité du site et de l'entreprise.</p>
        </div>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      {loading ? (
        <p className="admin-empty">Chargement...</p>
      ) : (
        <>
          <div className="dashboard-stats">
            {stats.map((stat) => (
              <div
                className={`dashboard-stat ${stat.variant ? `dashboard-stat--${stat.variant}` : ''}`}
                key={stat.label}
              >
                <FontAwesomeIcon icon={stat.icon} />
                <div>
                  <p className="dashboard-stat__value">{stat.value}</p>
                  <p className="dashboard-stat__label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="admin-card dashboard-recent">
              <div className="dashboard-recent__header">
                <h2>Derniers messages</h2>
                <Link to="/admin/messages">Voir tout</Link>
              </div>

              {recentContacts.length === 0 ? (
                <p className="admin-empty">Aucun message pour le moment.</p>
              ) : (
                <ul className="dashboard-recent__list">
                  {recentContacts.map((contact) => (
                    <li key={contact.id}>
                      <div>
                        <strong>{contact.nom}</strong>
                        <span>{contact.sujet || contact.message.slice(0, 60)}</span>
                      </div>
                      <div className="dashboard-recent__meta">
                        {!contact.is_read && <span className="admin-badge admin-badge--unread">Non lu</span>}
                        <span>{formatDate(contact.created_at)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="admin-card dashboard-shortcuts">
              <h2>Raccourcis</h2>
              <div className="dashboard-shortcuts__list">
                {shortcuts.map((shortcut) => (
                  <Link key={shortcut.to} to={shortcut.to} className="admin-btn admin-btn-secondary">
                    <FontAwesomeIcon icon={faPlus} /> {shortcut.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
