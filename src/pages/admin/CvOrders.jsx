import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck } from '@fortawesome/free-solid-svg-icons';
import { fetchCvOrdersAdmin, markCvOrderPaidManually } from '../../api/cvApi';
import './admin.css';

const statusLabels = {
  pending_payment: 'En attente',
  paid: 'Payee',
  failed: 'Echouee',
  cancelled: 'Annulee',
};

function CvOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [markingId, setMarkingId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchCvOrdersAdmin()
      .then(setOrders)
      .catch(() => setError('Impossible de charger les commandes.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkPaid = async (id) => {
    if (!window.confirm("Marquer cette commande comme payee et generer le PDF ?")) return;
    setMarkingId(id);
    try {
      await markCvOrderPaidManually(id);
      load();
    } catch (err) {
      window.alert(err.response?.data?.message || 'Impossible de marquer cette commande comme payee.');
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <div>
          <h1>Commandes CV</h1>
          <p>{orders.length} commande(s) au total.</p>
        </div>
      </div>

      {error && <p className="admin-alert admin-alert--error">{error}</p>}

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="admin-empty">Aucune commande pour le moment.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Modele</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.buyer_name}<br /><small>{order.buyer_email}</small></td>
                  <td>{order.template_name}</td>
                  <td>{Number(order.amount_fcfa)} FCFA</td>
                  <td>
                    <span className={`admin-badge admin-badge--${order.status === 'paid' ? 'read' : 'unread'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleString('fr-FR')}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDetail(order)}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      {order.status !== 'paid' && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary"
                          disabled={markingId === order.id}
                          onClick={() => handleMarkPaid(order.id)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {detail && (
        <div className="admin-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Commande #{detail.id}</h2>
            <p><strong>Client :</strong> {detail.buyer_name} ({detail.buyer_email}, {detail.buyer_phone || '-'})</p>
            <p><strong>Modele :</strong> {detail.template_name}</p>
            <p><strong>Reference :</strong> {detail.order_reference}</p>
            <p><strong>Statut :</strong> {statusLabels[detail.status] || detail.status}</p>
            <pre className="cv-orders__data">
              {(() => {
                try {
                  const data = typeof detail.form_data === 'string' ? JSON.parse(detail.form_data) : detail.form_data;
                  return JSON.stringify(data, null, 2);
                } catch (e) {
                  return 'Donnees illisibles (JSON invalide en base).';
                }
              })()}
            </pre>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setDetail(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CvOrders;
