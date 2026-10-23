import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faGaugeHigh,
  faEnvelope,
  faScrewdriverWrench,
  faBriefcase,
  faBuilding,
  faUserGroup,
  faHandshake,
  faSackDollar,
  faFileLines,
  faUser,
  faRightFromBracket,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './AdminLayout.css';

const mainLinks = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: faGaugeHigh },
  { to: '/admin/messages', label: 'Messages', icon: faEnvelope },
  { to: '/admin/services', label: 'Services', icon: faScrewdriverWrench },
  { to: '/admin/realisations', label: 'Réalisations', icon: faBriefcase },
  { to: '/admin/cv-modeles', label: 'Modèles CV', icon: faFileLines },
  { to: '/admin/cv-commandes', label: 'Commandes CV', icon: faSackDollar },
];

const companyLinks = [
  { to: '/admin/entreprise', label: 'Infos entreprise', icon: faBuilding },
  { to: '/admin/equipe', label: 'Équipe', icon: faUserGroup },
  { to: '/admin/clients', label: 'Clients & Projets', icon: faHandshake },
  { to: '/admin/finances', label: 'Finances', icon: faSackDollar },
];

function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="admin-layout">
      <header className="admin-topbar">
        <img src={logo} alt="OliTech" className="admin-topbar__logo" />
        <button
          type="button"
          className="admin-topbar__toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
        </button>
      </header>

      {mobileOpen && <div className="admin-sidebar-backdrop" onClick={closeMobile} />}

      <aside className={`admin-sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <img src={logo} alt="OliTech" className="admin-sidebar__logo" />
        <nav className="admin-sidebar__nav">
          <a href="/" className="admin-sidebar__external">
            <FontAwesomeIcon icon={faHouse} /> Accueil
          </a>

          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={closeMobile}
            >
              <FontAwesomeIcon icon={link.icon} /> {link.label}
            </NavLink>
          ))}

          <p className="admin-sidebar__section-label">Gestion de l'entreprise</p>

          {companyLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={closeMobile}
            >
              <FontAwesomeIcon icon={link.icon} /> {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/admin/profil" className="admin-sidebar__profile-link" onClick={closeMobile}>
            <FontAwesomeIcon icon={faUser} /> {admin?.name}
          </Link>
          <button type="button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
