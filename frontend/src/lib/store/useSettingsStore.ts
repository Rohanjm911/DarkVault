import { useState, useEffect } from 'react';
import { AppSettings } from '../types';

const SETTINGS_KEY = 'darkvault_settings';

const DEFAULT_SETTINGS: AppSettings = {
  useBackendProxy: true,
  anonymousTelemetry: true,
  clearMemoryOnClose: false,
  nistStrictRules: true,
  accentColor: 'blue',
  soundEffects: false,
};

export function useSettingsStore() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const clearVaultMemory = () => {
    try {
      localStorage.removeItem('darkvault_audits');
      sessionStorage.clear();
    } catch {
      // ignore
    }
  };

  return {
    settings,
    updateSetting,
    resetSettings,
    clearVaultMemory,
  };
}

