import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  fetchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../api/teamApi';
import './admin.css';

const emptyForm = { name: '', role: '', bio: '', sort_order: 0 };

function Team() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    fetchTeamMembers()
      .then(setMembers)
      .catch(() => setError("Impossible de charger l'équipe."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: members.length + 1 });
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      role: member.role || '',
      bio: member.bio || '',
      sort_order: member.sort_order,
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
        await updateTeamMember(editingId, form);
      } else {
        await createTeamMember(form);
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
    if (!window.confirm('Supprimer ce membre de l\'équipe ?')) return;
    await deleteTeamMember(id);
    load();
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Équipe</h1>
          <p>{members.length} membre(s) dans l'équipe.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter un membre
        </button>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : members.length === 0 ? (
          <p className="admin-empty">Aucun membre. Ajoutez-en un.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Bio</th>
                <th>Ordre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.name}</td>
                  <td>{member.role || '-'}</td>
                  <td style={{ maxWidth: 320 }}>{member.bio || '-'}</td>
                  <td>{member.sort_order}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => openEdit(member)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(member.id)}>
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
            <h2>{editingId ? 'Modifier le membre' : 'Nouveau membre'}</h2>
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
                <label htmlFor="role">Rôle</label>
                <input
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  rows="3"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
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

export default Team;
