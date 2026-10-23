import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { updateProfile } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import './admin.css';

function Profile() {
  const { admin, updateSession } = useAuth();
  const [form, setForm] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    current_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.new_password && form.new_password !== form.new_password_confirm) {
      setError('Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        current_password: form.current_password,
      };
      if (form.new_password) payload.new_password = form.new_password;

      const data = await updateProfile(payload);
      updateSession(data.token, data.admin);
      setForm((prev) => ({ ...prev, current_password: '', new_password: '', new_password_confirm: '' }));
      setSuccess('Profil mis à jour.');
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Mon profil</h1>
          <p>Modifier votre nom, email ou mot de passe de connexion admin.</p>
        </div>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}
      {success && <p className="admin-alert admin-alert--success">{success}</p>}

      <div className="admin-card" style={{ padding: 28, maxWidth: 480 }}>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-field">
            <label htmlFor="name">Nom *</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="new_password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
            <input
              id="new_password"
              type="password"
              value={form.new_password}
              onChange={(e) => handleChange('new_password', e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {form.new_password && (
            <div className="admin-form-field">
              <label htmlFor="new_password_confirm">Confirmer le nouveau mot de passe</label>
              <input
                id="new_password_confirm"
                type="password"
                value={form.new_password_confirm}
                onChange={(e) => handleChange('new_password_confirm', e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}

          <div className="admin-form-field">
            <label htmlFor="current_password">Mot de passe actuel * (requis pour confirmer)</label>
            <input
              id="current_password"
              type="password"
              value={form.current_password}
              onChange={(e) => handleChange('current_password', e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
