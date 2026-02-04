const STORAGE_KEY = "sgd_settings";

export type Settings = {
  email: boolean;
  system: boolean;
  deadlineReminder: string;
};

export const DEFAULT_SETTINGS: Settings = {
  email: false,
  system: false,
  deadlineReminder: "3", // Valor padrão "3 dias"
};

export function loadSettings(): Settings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(saved);
    // Verificação extra: se parsed for nulo (ex: "null" no storage), retorna padrão
    if (!parsed) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}

export function resetSettings(): Settings {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_SETTINGS;
}