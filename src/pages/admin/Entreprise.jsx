import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { fetchSettings, updateSettings } from '../../api/settingsApi';
import { useSettings } from '../../context/SettingsContext';
import './admin.css';

const FIELDS = [
  { name: 'intro_paragraph_1', label: 'Présentation (paragraphe 1)', type: 'textarea' },
  { name: 'intro_paragraph_2', label: 'Présentation (paragraphe 2)', type: 'textarea' },
  { name: 'mission_text', label: 'Notre mission', type: 'textarea' },
  { name: 'vision_text', label: 'Notre vision', type: 'textarea' },
  { name: 'valeurs_text', label: 'Nos valeurs', type: 'textarea' },
  { name: 'ceo_name', label: 'Nom du PDG', type: 'text' },
  { name: 'ceo_title', label: 'Titre du PDG', type: 'text' },
  { name: 'ceo_bio', label: 'Présentation du PDG', type: 'textarea' },
  { name: 'phone', label: 'Téléphone', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'website', label: 'Site web', type: 'text' },
];

const emptyForm = FIELDS.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});

function Entreprise() {
  const { refresh } = useSettings();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        if (data) setForm({ ...emptyForm, ...data });
      })
      .catch(() => setError('Impossible de charger les informations.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateSettings(form);
      await refresh();
      setSuccess('Informations mises à jour.');
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="admin-empty">Chargement...</p>;
  }

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Informations entreprise</h1>
          <p>Textes affichés sur la page "À propos" et coordonnées du site.</p>
        </div>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      {success && <p className="admin-alert admin-alert--success">{success}</p>}

      <div className="admin-card" style={{ padding: 28 }}>
        <form onSubmit={handleSubmit}>
          {FIELDS.map((field) => (
            <div className="admin-form-field" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  rows="3"
                  value={form[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <input
                  id={field.name}
                  value={form[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}

          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Entreprise;
