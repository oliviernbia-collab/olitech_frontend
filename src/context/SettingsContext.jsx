import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchSettings } from '../api/settingsApi';

const SettingsContext = createContext({ settings: null, loading: true, refresh: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      console.error('Impossible de charger les parametres du site:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
