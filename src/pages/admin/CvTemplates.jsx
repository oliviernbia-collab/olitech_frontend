import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { fetchCvTemplatesAdmin, updateCvTemplate } from '../../api/cvApi';
import './admin.css';

function CvTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    fetchCvTemplatesAdmin()
      .then(setTemplates)
      .catch(() => setError('Impossible de charger les modeles de CV.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (template) => {
    setEditingId(template.id);
    setForm({
      name: template.name,
      description: template.description || '',
      price_fcfa: template.price_fcfa,
      is_active: !!template.is_active,
      sort_order: template.sort_order,
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
      await updateCvTemplate(editingId, form);
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Modeles de CV</h1>
          <p>{templates.length} modele(s) proposes sur la page /cv.</p>
        </div>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Mise en page</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Ordre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.name}</td>
                  <td>{template.layout_key} / {template.palette_key}</td>
                  <td>{Number(template.price_fcfa)} FCFA</td>
                  <td>
                    <span className={`admin-badge admin-badge--${template.is_active ? 'read' : 'unread'}`}>
                      {template.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>{template.sort_order}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => openEdit(template)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && form && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Modifier le modele</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-field">
                <label htmlFor="name">Nom *</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
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

              <div className="admin-form-row">
                <div className="admin-form-field">
                  <label htmlFor="price_fcfa">Prix (FCFA)</label>
                  <input
                    id="price_fcfa"
                    type="number"
                    value={form.price_fcfa}
                    onChange={(e) => setForm({ ...form, price_fcfa: Number(e.target.value) })}
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
              </div>

              <div className="admin-form-field">
                <label>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />{' '}
                  Visible sur le site
                </label>
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

export default CvTemplates;
