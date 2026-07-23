import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchContacts, markContactRead, deleteContact } from '../../api/contactsApi';
import './admin.css';

function formatDate(value) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Messages() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchContacts()
      .then(setContacts)
      .catch(() => setError('Impossible de charger les messages.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleRead = async (contact) => {
    await markContactRead(contact.id, !contact.is_read);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement ce message ?')) return;
    await deleteContact(id);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Messages de contact</h1>
          <p>{contacts.length} message(s) reçu(s) via le formulaire de contact.</p>
        </div>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : contacts.length === 0 ? (
          <p className="admin-empty">Aucun message pour le moment.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Statut</th>
                <th>Nom</th>
                <th>Contact</th>
                <th>Sujet</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <span className={`admin-badge ${contact.is_read ? 'admin-badge--read' : 'admin-badge--unread'}`}>
                      {contact.is_read ? 'Lu' : 'Non lu'}
                    </span>
                  </td>
                  <td>{contact.nom}</td>
                  <td>
                    {contact.email}
                    {contact.telephone && <><br />{contact.telephone}</>}
                  </td>
                  <td>{contact.sujet || '-'}</td>
                  <td style={{ maxWidth: 280 }}>{contact.message}</td>
                  <td>{formatDate(contact.created_at)}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-secondary"
                        onClick={() => handleToggleRead(contact)}
                        title={contact.is_read ? 'Marquer non lu' : 'Marquer lu'}
                      >
                        <FontAwesomeIcon icon={faEnvelopeOpen} />
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        onClick={() => handleDelete(contact.id)}
                        title="Supprimer"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Messages;
