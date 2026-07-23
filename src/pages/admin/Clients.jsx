import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from '../../api/clientsApi';
import './admin.css';

const emptyForm = { client_name: '', project_name: '', status: 'en_cours', description: '' };

const statusLabels = {
  en_cours: 'En cours',
  termine: 'Terminé',
  en_pause: 'En pause',
};

const statusBadgeClass = {
  en_cours: 'admin-badge--unread',
  termine: 'admin-badge--read',
  en_pause: 'admin-badge--unread',
};

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    fetchClients()
      .then(setClients)
      .catch(() => setError('Impossible de charger les clients.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditingId(client.id);
    setForm({
      client_name: client.client_name,
      project_name: client.project_name || '',
      status: client.status,
      description: client.description || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    try {
      if (editingId) {
        await updateClient(editingId, form);
      } else {
        await createClient(form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce client/projet ?')) return;
    await deleteClient(id);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Clients &amp; Projets</h1>
          <p>{clients.length} client(s)/projet(s) suivi(s).</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter un client/projet
        </button>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : clients.length === 0 ? (
          <p className="admin-empty">Aucun client/projet. Ajoutez-en un.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Projet</th>
                <th>Statut</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.client_name}</td>
                  <td>{client.project_name || '-'}</td>
                  <td>
                    <span className={`admin-badge ${statusBadgeClass[client.status]}`}>
                      {statusLabels[client.status]}
                    </span>
                  </td>
                  <td style={{ maxWidth: 280 }}>{client.description || '-'}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => openEdit(client)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(client.id)}>
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

      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Modifier le client/projet' : 'Nouveau client/projet'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-field">
                <label htmlFor="client_name">Nom du client *</label>
                <input
                  id="client_name"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="project_name">Nom du projet</label>
                <input
                  id="project_name"
                  value={form.project_name}
                  onChange={(e) => setForm({ ...form, project_name: e.target.value })}
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="status">Statut</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                  <option value="en_pause">En pause</option>
                </select>
              </div>

              <div className="admin-form-field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {formError && <p className="admin-alert admin-alert--error">{formError}</p>}

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;
