import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';
import {
  fetchPortfolioItems,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from '../../api/portfolioApi';
import { getIcon } from '../../data/iconMap';
import { getMediaUrl } from '../../utils/mediaUrl';
import IconPicker from '../../components/admin/IconPicker';
import './admin.css';

const emptyForm = { icon_key: 'globe', title: '', category: '', description: '', link: '', sort_order: 0 };

function Realisations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    fetchPortfolioItems()
      .then(setItems)
      .catch(() => setError('Impossible de charger les réalisations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    resetImageState();
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      icon_key: item.icon_key,
      title: item.title,
      category: item.category || '',
      description: item.description,
      link: item.link || '',
      sort_order: item.sort_order,
    });
    setImageFile(null);
    setImagePreview(getMediaUrl(item.image_url));
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = new FormData();
    payload.append('icon_key', form.icon_key);
    payload.append('title', form.title);
    payload.append('category', form.category);
    payload.append('description', form.description);
    payload.append('link', form.link);
    payload.append('sort_order', form.sort_order);
    if (imageFile) payload.append('image', imageFile);

    try {
      if (editingId) {
        await updatePortfolioItem(editingId, payload);
      } else {
        await createPortfolioItem(payload);
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
    if (!window.confirm('Supprimer cette réalisation ?')) return;
    await deletePortfolioItem(id);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Réalisations</h1>
          <p>{items.length} réalisation(s) affichée(s) sur le site.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter une réalisation
        </button>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="admin-empty">Aucune réalisation. Ajoutez-en une.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Aperçu</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Ordre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image_url ? (
                      <img src={getMediaUrl(item.image_url)} alt={item.title} className="admin-thumb" />
                    ) : (
                      <FontAwesomeIcon icon={getIcon(item.icon_key)} />
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>{item.category || '-'}</td>
                  <td>{item.sort_order}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => openEdit(item)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(item.id)}>
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
            <h2>{editingId ? 'Modifier la réalisation' : 'Nouvelle réalisation'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-field">
                <label>Image de la réalisation</label>
                <div className="admin-image-upload">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Aperçu" className="admin-image-upload__preview" />
                  ) : (
                    <div className="admin-image-upload__placeholder">
                      <FontAwesomeIcon icon={faImage} />
                    </div>
                  )}
                  <label htmlFor="image" className="admin-btn admin-btn-secondary">
                    {imagePreview ? "Changer l'image" : 'Choisir une image'}
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
              </div>

              <div className="admin-form-field">
                <label>Icône (utilisée si aucune image)</label>
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
                <label htmlFor="category">Catégorie</label>
                <input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                <label htmlFor="link">Lien du projet (optionnel)</label>
                <input
                  id="link"
                  type="url"
                  placeholder="https://..."
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
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

export default Realisations;
