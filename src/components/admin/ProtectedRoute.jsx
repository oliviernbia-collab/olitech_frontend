import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchMe } from '../../api/authApi';

function ProtectedRoute({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setChecking(false);
      return;
    }

    let cancelled = false;
    fetchMe()
      .then(() => !cancelled && setValid(true))
      .catch(() => {
        if (cancelled) return;
        // Token present mais expire/invalide cote serveur : on nettoie la
        // session locale plutot que de laisser l'admin "connecte" dans une
        // interface qui ne fonctionne plus.
        logout();
        setValid(false);
      })
      .finally(() => !cancelled && setChecking(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (checking) {
    return null;
  }

  if (!valid) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
