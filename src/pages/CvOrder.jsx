import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faArrowRight,
  faArrowLeft,
  faTriangleExclamation,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import { fetchCvTemplate, createCvOrder, initiateCvPayment } from '../api/cvApi';
import { getLayoutComponent } from '../cvTemplates/registry';
import { getPalette } from '../cvTemplates/palettes';
import './CvOrder.css';

const emptyForm = {
  fullName: '',
  jobTitle: '',
  phone: '',
  email: '',
  address: '',
  profile: '',
  education: [{ period: '', title: '', place: '' }],
  experience: [{ period: '', title: '', place: '', bullets: '' }],
  projects: [{ title: '', description: '' }],
  skills: [{ name: '', level: 3 }],
  languages: [{ name: '', level: 3 }],
  hobbies: '',
};

const REPEAT_SECTIONS = {
  education: { label: 'Formation', primaryField: 'title', primaryLabel: 'Diplome' },
  experience: { label: 'Experience', primaryField: 'title', primaryLabel: 'Poste' },
  projects: { label: 'Projet academique', primaryField: 'title', primaryLabel: 'Titre du projet' },
  skills: { label: 'Competence', primaryField: 'name', primaryLabel: 'Nom de la competence' },
  languages: { label: 'Langue', primaryField: 'name', primaryLabel: 'Nom de la langue' },
};

function isRowStarted(row) {
  // Exclut "level" : son defaut (3/5) ne doit pas compter comme une saisie.
  return Object.entries(row).some(([key, v]) => key !== 'level' && String(v ?? '').trim() !== '');
}

// Construit les donnees pretes a afficher/envoyer : filtre les lignes jamais
// remplies (restees au defaut) pour qu'une section vide ne s'affiche ni dans
// l'apercu ni dans le CV final genere - meme logique utilisee pour les deux,
// afin que ce que l'acheteur voit soit exactement ce qu'il recoit.
function buildCleanCvData(form) {
  return {
    ...form,
    hobbies: form.hobbies.split(',').map((h) => h.trim()).filter(Boolean),
    education: form.education.filter(isRowStarted),
    experience: form.experience
      .filter(isRowStarted)
      .map((item) => ({
        ...item,
        bullets: item.bullets.split('\n').map((b) => b.trim()).filter(Boolean),
      })),
    projects: form.projects.filter(isRowStarted),
    skills: form.skills.filter((row) => row.name.trim()),
    languages: form.languages.filter((row) => row.name.trim()),
  };
}

function RepeatableSection({ title, rows, fields, onChange, onAdd, onRemove, rowErrors }) {
  return (
    <div className="cv-form__repeat">
      <h3>{title}</h3>
      {rows.map((row, index) => (
        <div className="cv-form__repeat-row" key={index}>
          {fields.map((field) => {
            const invalid = rowErrors?.[index] && field.name === rowErrors.primaryField;
            return (
              <div className="cv-form__field" key={field.name}>
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows="2"
                    value={row[field.name]}
                    onChange={(e) => onChange(index, field.name, e.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'select' ? (
                  <select value={row[field.name]} onChange={(e) => onChange(index, field.name, Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}/5</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className={invalid ? 'has-error' : ''}
                    value={row[field.name]}
                    onChange={(e) => onChange(index, field.name, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
                {invalid && <span className="cv-form__error">Ce champ est requis.</span>}
              </div>
            );
          })}
          {rows.length > 1 && (
            <button type="button" className="cv-form__row-remove" onClick={() => onRemove(index)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      ))}
      <button type="button" className="cv-form__row-add" onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} /> Ajouter
      </button>
    </div>
  );
}

function CvOrder() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [step, setStep] = useState('form');
  const [fieldErrors, setFieldErrors] = useState({});
  const [rowErrors, setRowErrors] = useState({});
  const [errorSummary, setErrorSummary] = useState([]);
  const topRef = useRef(null);

  useEffect(() => {
    fetchCvTemplate(slug)
      .then(setTemplate)
      .catch(() => setLoadError("Ce modele est introuvable ou n'est plus disponible."));
  }, [slug]);

  const updateRow = (section) => (index, field, value) => {
    setForm((prev) => {
      const rows = [...prev[section]];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, [section]: rows };
    });
  };

  const addRow = (section, empty) => () => {
    setForm((prev) => ({ ...prev, [section]: [...prev[section], empty] }));
  };

  const removeRow = (section) => (index) => {
    setForm((prev) => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const previewData = buildCleanCvData(form);

  const validate = () => {
    const newFieldErrors = {};
    if (!form.fullName.trim()) newFieldErrors.fullName = 'Le nom complet est requis.';
    if (!form.phone.trim()) {
      newFieldErrors.phone = 'Le telephone est requis.';
    } else if (!/^[+0-9\s().-]{6,}$/.test(form.phone.trim())) {
      newFieldErrors.phone = 'Ce numero de telephone ne semble pas valide.';
    }
    if (!form.email.trim()) {
      newFieldErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newFieldErrors.email = "Cet email ne semble pas valide.";
    }

    const newRowErrors = {};
    const messages = [];

    Object.entries(REPEAT_SECTIONS).forEach(([section, cfg]) => {
      if (section === 'projects' && template?.layout_key !== 'student_cv') return;
      const rows = form[section] || [];
      const invalidIndexes = {};
      rows.forEach((row, index) => {
        if (isRowStarted(row) && !String(row[cfg.primaryField] ?? '').trim()) {
          invalidIndexes[index] = true;
          messages.push(`${cfg.label} (ligne ${index + 1}) : le champ "${cfg.primaryLabel}" est requis.`);
        }
      });
      if (Object.keys(invalidIndexes).length > 0) {
        newRowErrors[section] = { ...invalidIndexes, primaryField: cfg.primaryField };
      }
    });

    if (newFieldErrors.fullName) messages.unshift(newFieldErrors.fullName);
    if (newFieldErrors.phone) messages.unshift(newFieldErrors.phone);
    if (newFieldErrors.email) messages.unshift(newFieldErrors.email);

    setFieldErrors(newFieldErrors);
    setRowErrors(newRowErrors);
    setErrorSummary(messages);

    return messages.length === 0;
  };

  const handleReview = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {
      setStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = buildCleanCvData(form);

      const data = new FormData();
      data.append('template_id', template.id);
      data.append('buyer_name', form.fullName);
      data.append('buyer_email', form.email);
      data.append('buyer_phone', form.phone);
      data.append('form_data', JSON.stringify(payload));
      if (photoFile) data.append('photo', photoFile);

      const res = await createCvOrder(data);

      try {
        const payment = await initiateCvPayment(res.id, paymentMethod);
        window.location.href = payment.redirectUrl;
        return;
      } catch (payErr) {
        // Commande bien enregistree, mais le paiement en ligne n'est pas
        // disponible pour l'instant (cles Jeko pas encore actives, etc.) :
        // on redirige quand meme vers le suivi, l'acheteur ne perd rien.
        console.error('Paiement indisponible:', payErr.response?.data?.message || payErr.message);
      }

      navigate(`/cv/suivi/${res.order_reference}`);
    } catch (err) {
      setSubmitError(
        err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.message ||
          "Impossible d'enregistrer votre commande. Veuillez reessayer."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <section className="section">
        <div className="container cv-order__notice">
          <p>{loadError}</p>
          <Link to="/cv" className="btn btn-primary">Retour au catalogue</Link>
        </div>
      </section>
    );
  }

  if (!template) {
    return (
      <section className="section">
        <div className="container cv-order__notice">
          <p>Chargement...</p>
        </div>
      </section>
    );
  }

  const Layout = getLayoutComponent(template.layout_key);
  const isStudent = template.layout_key === 'student_cv';

  return (
    <section className="section" ref={topRef}>
      <div className="container cv-order">
        <div className="cv-order__form-col">
          <h1>{template.name}</h1>
          <p className="cv-order__price">{Number(template.price_fcfa)} FCFA</p>

          {step === 'form' && (
            <form onSubmit={handleReview} className="cv-form">
              {errorSummary.length > 0 && (
                <div className="cv-form__error-summary">
                  <h4><FontAwesomeIcon icon={faTriangleExclamation} /> Corrigez les points suivants avant de continuer :</h4>
                  <ul>
                    {errorSummary.map((msg) => (
                      <li key={msg}>{msg}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="cv-form__block">
                <h3>Vos informations</h3>
                <div className="cv-form__row2">
                  <div className="cv-form__field">
                    <label>Nom complet *</label>
                    <input
                      className={fieldErrors.fullName ? 'has-error' : ''}
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                    {fieldErrors.fullName && <span className="cv-form__error">{fieldErrors.fullName}</span>}
                  </div>
                  <div className="cv-form__field">
                    <label>Intitule du poste</label>
                    <input
                      value={form.jobTitle}
                      onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                    />
                  </div>
                </div>
                <div className="cv-form__row2">
                  <div className="cv-form__field">
                    <label>Telephone *</label>
                    <input
                      className={fieldErrors.phone ? 'has-error' : ''}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    {fieldErrors.phone && <span className="cv-form__error">{fieldErrors.phone}</span>}
                  </div>
                  <div className="cv-form__field">
                    <label>Email *</label>
                    <input
                      type="email"
                      className={fieldErrors.email ? 'has-error' : ''}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {fieldErrors.email && <span className="cv-form__error">{fieldErrors.email}</span>}
                  </div>
                </div>
                <div className="cv-form__field">
                  <label>Ville / Pays</label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="cv-form__field">
                  <label>Photo (optionnelle)</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} />
                </div>
                <div className="cv-form__field">
                  <label>Profil / resume</label>
                  <textarea
                    rows="3"
                    value={form.profile}
                    onChange={(e) => setForm({ ...form, profile: e.target.value })}
                  />
                </div>
              </div>

              <RepeatableSection
                title="Formation"
                rows={form.education}
                fields={[
                  { name: 'period', label: 'Periode', placeholder: '2022 - 2025' },
                  { name: 'title', label: 'Diplome', placeholder: 'Licence en ...' },
                  { name: 'place', label: 'Etablissement' },
                ]}
                onChange={updateRow('education')}
                onAdd={addRow('education', { period: '', title: '', place: '' })}
                onRemove={removeRow('education')}
                rowErrors={rowErrors.education}
              />

              <RepeatableSection
                title={isStudent ? 'Stages / Experiences' : 'Experience professionnelle'}
                rows={form.experience}
                fields={[
                  { name: 'period', label: 'Periode', placeholder: '2023 - Present' },
                  { name: 'title', label: 'Poste' },
                  { name: 'place', label: 'Entreprise' },
                  { name: 'bullets', label: 'Missions (une par ligne)', type: 'textarea' },
                ]}
                onChange={updateRow('experience')}
                onAdd={addRow('experience', { period: '', title: '', place: '', bullets: '' })}
                onRemove={removeRow('experience')}
                rowErrors={rowErrors.experience}
              />

              {isStudent && (
                <RepeatableSection
                  title="Projets academiques"
                  rows={form.projects}
                  fields={[
                    { name: 'title', label: 'Titre du projet' },
                    { name: 'description', label: 'Description', type: 'textarea' },
                  ]}
                  onChange={updateRow('projects')}
                  onAdd={addRow('projects', { title: '', description: '' })}
                  onRemove={removeRow('projects')}
                  rowErrors={rowErrors.projects}
                />
              )}

              <RepeatableSection
                title="Competences"
                rows={form.skills}
                fields={[
                  { name: 'name', label: 'Competence' },
                  { name: 'level', label: 'Niveau', type: 'select' },
                ]}
                onChange={updateRow('skills')}
                onAdd={addRow('skills', { name: '', level: 3 })}
                onRemove={removeRow('skills')}
                rowErrors={rowErrors.skills}
              />

              <RepeatableSection
                title="Langues"
                rows={form.languages}
                fields={[
                  { name: 'name', label: 'Langue' },
                  { name: 'level', label: 'Niveau', type: 'select' },
                ]}
                onChange={updateRow('languages')}
                onAdd={addRow('languages', { name: '', level: 3 })}
                onRemove={removeRow('languages')}
                rowErrors={rowErrors.languages}
              />

              <div className="cv-form__field">
                <label>Centres d'interet (separes par des virgules)</label>
                <input
                  value={form.hobbies}
                  onChange={(e) => setForm({ ...form, hobbies: e.target.value })}
                  placeholder="Lecture, Sport, Voyages"
                />
              </div>

              <button type="submit" className="btn btn-primary cv-form__submit">
                Verifier mes informations <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </form>
          )}

          {step === 'review' && (
            <div className="cv-form">
              <div className="cv-review__banner">
                Relisez vos informations ci-dessous. Si besoin, cliquez sur « Modifier » pour
                corriger avant de payer.
              </div>

              <ReviewBlock title="Vos informations" onEdit={() => setStep('form')}>
                <ReviewRow label="Nom complet" value={form.fullName} />
                <ReviewRow label="Intitule du poste" value={form.jobTitle} />
                <ReviewRow label="Telephone" value={form.phone} />
                <ReviewRow label="Email" value={form.email} />
                <ReviewRow label="Ville / Pays" value={form.address} />
                <ReviewRow label="Profil" value={form.profile} />
              </ReviewBlock>

              <ReviewListBlock
                title="Formation"
                rows={form.education}
                render={(row) => (isRowStarted(row) ? `${row.title || '(sans titre)'} — ${row.place || '-'} (${row.period || '-'})` : null)}
                onEdit={() => setStep('form')}
              />

              <ReviewListBlock
                title={isStudent ? 'Stages / Experiences' : 'Experience professionnelle'}
                rows={form.experience}
                render={(row) => (isRowStarted(row) ? `${row.title || '(sans titre)'} — ${row.place || '-'} (${row.period || '-'})` : null)}
                onEdit={() => setStep('form')}
              />

              {isStudent && (
                <ReviewListBlock
                  title="Projets academiques"
                  rows={form.projects}
                  render={(row) => (isRowStarted(row) ? row.title || '(sans titre)' : null)}
                  onEdit={() => setStep('form')}
                />
              )}

              <ReviewListBlock
                title="Competences"
                rows={form.skills}
                render={(row) => (row.name ? `${row.name} (${row.level}/5)` : null)}
                onEdit={() => setStep('form')}
              />

              <ReviewListBlock
                title="Langues"
                rows={form.languages}
                render={(row) => (row.name ? `${row.name} (${row.level}/5)` : null)}
                onEdit={() => setStep('form')}
              />

              {form.hobbies.trim() && (
                <ReviewBlock title="Centres d'interet" onEdit={() => setStep('form')}>
                  <ReviewRow value={form.hobbies} />
                </ReviewBlock>
              )}

              <div className="cv-form__block">
                <h3>Moyen de paiement</h3>
                <div className="cv-form__payment-methods">
                  {[
                    { value: 'wave', label: 'Wave' },
                    { value: 'orange', label: 'Orange Money' },
                    { value: 'mtn', label: 'MTN Mobile Money' },
                    { value: 'moov', label: 'Moov Money' },
                  ].map((method) => (
                    <label key={method.value} className={`cv-form__payment-option ${paymentMethod === method.value ? 'is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                      />
                      {method.label}
                    </label>
                  ))}
                </div>
              </div>

              {submitError && <p className="admin-alert admin-alert--error">{submitError}</p>}

              <div className="cv-review__actions">
                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={() => setStep('form')}
                  disabled={submitting}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Modifier mes informations
                </button>
                <button
                  type="button"
                  className="btn btn-primary cv-form__submit"
                  onClick={handleConfirmPayment}
                  disabled={submitting}
                >
                  {submitting ? (
                    'Enregistrement...'
                  ) : (
                    <>Confirmer et payer {Number(template.price_fcfa)} FCFA <FontAwesomeIcon icon={faArrowRight} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="cv-order__preview">
          <div className="cv-order__preview-scale">
            <Layout data={previewData} palette={getPalette(template.palette_key)} photoUrl={photoPreview} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewBlock({ title, onEdit, children }) {
  return (
    <div className="cv-form__block cv-review__block">
      <div className="cv-review__block-header">
        <h3>{title}</h3>
        <button type="button" className="cv-review__edit" onClick={onEdit}>
          <FontAwesomeIcon icon={faPen} /> Modifier
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <p className="cv-review__row">
      {label && <strong>{label} : </strong>}
      {value?.trim() ? value : <span className="cv-review__empty">Non renseigne</span>}
    </p>
  );
}

function ReviewListBlock({ title, rows, render, onEdit }) {
  const items = rows.map(render).filter(Boolean);
  return (
    <ReviewBlock title={title} onEdit={onEdit}>
      {items.length > 0 ? (
        <ul className="cv-review__list">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="cv-review__row"><span className="cv-review__empty">Non renseigne</span></p>
      )}
    </ReviewBlock>
  );
}

export default CvOrder;
