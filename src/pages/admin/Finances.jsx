import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faArrowUp, faArrowDown, faScaleBalanced } from '@fortawesome/free-solid-svg-icons';
import {
  fetchFinances,
  createFinanceEntry,
  updateFinanceEntry,
  deleteFinanceEntry,
} from '../../api/financesApi';
import './admin.css';
import './Finances.css';

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = { type: 'revenu', amount: '', description: '', entry_date: today() };

function formatAmount(value) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(
    value
  );
}

function Finances() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    fetchFinances()
      .then(setEntries)
      .catch(() => setError('Impossible de charger les finances.'))
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

  const openEdit = (entry) => {
    setEditingId(entry.id);
    setForm({
      type: entry.type,
      amount: entry.amount,
      description: entry.description || '',
      entry_date: entry.entry_date.slice(0, 10),
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
        await updateFinanceEntry(editingId, form);
      } else {
        await createFinanceEntry(form);
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
    if (!window.confirm('Supprimer cette entrée financière ?')) return;
    await deleteFinanceEntry(id);
    load();
  };

  const totalRevenus = entries.filter((e) => e.type === 'revenu').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalDepenses = entries.filter((e) => e.type === 'depense').reduce((sum, e) => sum + Number(e.amount), 0);
  const solde = totalRevenus - totalDepenses;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Finances</h1>
          <p>{entries.length} entrée(s) enregistrée(s).</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={openCreate}>
          <FontAwesomeIcon icon={faPlus} /> Ajouter une entrée
        </button>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="finances-summary">
        <div className="finances-summary__card finances-summary__card--revenu">
          <FontAwesomeIcon icon={faArrowUp} />
          <div>
            <p className="finances-summary__value">{formatAmount(totalRevenus)}</p>
            <p className="finances-summary__label">Total revenus</p>
          </div>
        </div>
        <div className="finances-summary__card finances-summary__card--depense">
          <FontAwesomeIcon icon={faArrowDown} />
          <div>
            <p className="finances-summary__value">{formatAmount(totalDepenses)}</p>
            <p className="finances-summary__label">Total dépenses</p>
          </div>
        </div>
        <div className="finances-summary__card finances-summary__card--solde">
          <FontAwesomeIcon icon={faScaleBalanced} />
          <div>
            <p className="finances-summary__value">{formatAmount(solde)}</p>
            <p className="finances-summary__label">Solde</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : entries.length === 0 ? (
          <p className="admin-empty">Aucune entrée. Ajoutez-en une.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Montant</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <span className={`admin-badge ${entry.type === 'revenu' ? 'admin-badge--read' : 'admin-badge--unread'}`}>
                      {entry.type === 'revenu' ? 'Revenu' : 'Dépense'}
                    </span>
                  </td>
                  <td>{formatAmount(entry.amount)}</td>
                  <td>{entry.description || '-'}</td>
                  <td>{new Date(entry.entry_date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => openEdit(entry)}>
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button type="button" className="admin-btn admin-btn-danger" onClick={() => handleDelete(entry.id)}>
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
            <h2>{editingId ? "Modifier l'entrée" : 'Nouvelle entrée'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-field">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="revenu">Revenu</option>
                  <option value="depense">Dépense</option>
                </select>
              </div>

              <div className="admin-form-field">
                <label htmlFor="amount">Montant (FCFA) *</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="entry_date">Date *</label>
                <input
                  id="entry_date"
                  type="date"
                  value={form.entry_date}
                  onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
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

export default Finances;
