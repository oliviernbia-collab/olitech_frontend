import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from '../../api/servicesApi';
import { getIcon } from '../../data/iconMap';
import IconPicker from '../../components/admin/IconPicker';
import './admin.css';

const emptyForm = { icon_key: 'code', title: '', subtitle: '', description: '', sort_order: 0 };

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    fetchServices()
      .then(setServices)
      .catch(() => setError('Impossible de charger les services.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: services.length + 1 });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingId(service.id);
    setForm({
      icon_key: service.icon_key,
      title: service.title,
      subtitle: service.subtitle || '',
      description: service.description,
      sort_order: service.sort_order,
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
        await updateService(editingId, form);
      } else {
        await createService(form);
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
    if (!window.confirm('Supprimer ce service ?')) return;
    await deleteService(id);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Services</h1>
          <p>{services.length} service(s) affiché(s) sur le site.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter un service
        </button>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : services.length === 0 ? (
          <p className="admin-empty">Aucun service. Ajoutez-en un.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icône</th>
                <th>Titre</th>
                <th>Sous-titre</th>
                <th>Ordre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td><FontAwesomeIcon icon={getIcon(service.icon_key)} /></td>
                  <td>{service.title}</td>
                  <td>{service.subtitle || '-'}</td>
                  <td>{service.sort_order}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => openEdit(service)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(service.id)}>
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
            <h2>{editingId ? 'Modifier le service' : 'Nouveau service'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-field">
                <label>Icône</label>
                <IconPicker value={form.icon_key} onChange={(icon_key) => setForm({ ...form, icon_key })} />
              </div>

              <div className="admin-form-field">
                <label htmlFor="title">Titre *</label>
                <input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="subtitle">Sous-titre</label>
                <input
                  id="subtitle"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="sort_order">Ordre d'affichage</label>
                <input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
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

export default Services;
