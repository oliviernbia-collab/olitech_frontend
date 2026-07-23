import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import apiClient from '../api/client';
import './ContactForm.css';

const initialForm = { nom: '', email: '', telephone: '', sujet: '', message: '' };

function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });

    try {
      const res = await apiClient.post('/contact', form);
      setStatus({ state: 'success', message: res.data.message });
      setForm(initialForm);
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Une erreur est survenue, veuillez réessayer.";
      setStatus({ state: 'error', message });
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="nom">Nom complet *</label>
          <input id="nom" name="nom" type="text" value={form.nom} onChange={handleChange} required />
        </div>
        <div className="contact-form__field">
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
      </div>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="telephone">Téléphone</label>
          <input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} />
        </div>
        <div className="contact-form__field">
          <label htmlFor="sujet">Sujet</label>
          <input id="sujet" name="sujet" type="text" value={form.sujet} onChange={handleChange} />
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="message">Message *</label>
        <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} required />
      </div>

      <button type="submit" className="btn btn-primary" disabled={status.state === 'loading'}>
        <FontAwesomeIcon icon={faPaperPlane} />
        {status.state === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
      </button>

      {status.state === 'success' && (
        <p className="contact-form__notice contact-form__notice--success">
          <FontAwesomeIcon icon={faCircleCheck} /> {status.message}
        </p>
      )}

      {status.state === 'error' && (
        <p className="contact-form__notice contact-form__notice--error">
          <FontAwesomeIcon icon={faCircleExclamation} /> {status.message}
        </p>
      )}
    </form>
  );
}

export default ContactForm;
