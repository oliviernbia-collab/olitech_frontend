import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUserShield } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import './Navbar.css';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Services' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/realisations', label: 'Réalisations' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="OliTech" />
        </NavLink>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <NavLink to="/admin" className="navbar__admin-btn" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faUserShield} /> <span>Admin</span>
          </NavLink>

          <button
            className="navbar__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            <FontAwesomeIcon icon={open ? faXmark : faBars} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
