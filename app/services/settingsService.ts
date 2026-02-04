const STORAGE_KEY = "sgd_settings";

export type Settings = {
  email: boolean;
  system: boolean;
  deadlineReminder: string;
};

export const DEFAULT_SETTINGS: Settings = {
  email: false,
  system: false,
  deadlineReminder: "",
};

export function loadSettings(): Settings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_SETTINGS;

  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function resetSettings(): Settings {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_SETTINGS;
}

