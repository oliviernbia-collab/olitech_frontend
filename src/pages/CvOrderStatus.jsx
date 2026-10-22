import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faClock, faDownload, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { fetchCvOrderStatus, getCvDownloadUrl } from '../api/cvApi';
import './CvOrderStatus.css';

const POLL_INTERVAL = 5000;

function CvOrderStatus() {
  const { reference } = useParams();
  const [searchParams] = useSearchParams();
  const paiementEchec = searchParams.get('paiement') === 'echec';
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetchCvOrderStatus(reference)
        .then((data) => {
          if (cancelled) return;
          setOrder(data);
          if (data.status !== 'paid') {
            timerRef.current = setTimeout(load, POLL_INTERVAL);
          }
        })
        .catch(() => !cancelled && setError('Commande introuvable.'));
    };

    load();

    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reference]);

  if (error) {
    return (
      <section className="section">
        <div className="container cv-status__notice">
          <p>{error}</p>
          <Link to="/cv" className="btn btn-primary">Retour au catalogue</Link>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="section">
        <div className="container cv-status__notice">
          <p>Chargement...</p>
        </div>
      </section>
    );
  }

  const isPaid = order.status === 'paid';

  return (
    <section className="section">
      <div className="container cv-status">
        <div className={`cv-status__icon ${isPaid ? 'is-paid' : ''}`}>
          <FontAwesomeIcon icon={isPaid ? faCircleCheck : faClock} />
        </div>
        <h1>{isPaid ? 'Votre CV est pret !' : 'Commande enregistree'}</h1>
        <p className="cv-status__template">Modele : {order.template_name}</p>

        {isPaid ? (
          <>
            <p>Merci {order.buyer_name}, votre CV personnalise est pret a etre telecharge.</p>
            <a
              href={getCvDownloadUrl(order.order_reference)}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faDownload} /> Telecharger mon CV (PDF)
            </a>
          </>
        ) : (
          <>
            {paiementEchec && (
              <p className="cv-status__warning">
                <FontAwesomeIcon icon={faTriangleExclamation} /> Le paiement n'a pas abouti. Vous
                pouvez reessayer depuis la page de commande, votre saisie n'est pas perdue.
              </p>
            )}
            <p className="cv-status__pending">
              Votre commande est enregistree et en attente de confirmation de paiement.
              Cette page se mettra a jour automatiquement, et vous recevrez un email des
              que votre CV sera pret.
            </p>
          </>
        )}

        <p className="cv-status__ref">Reference : {order.order_reference}</p>
      </div>
    </section>
  );
}

export default CvOrderStatus;
