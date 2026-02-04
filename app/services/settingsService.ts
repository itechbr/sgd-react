export interface Settings {
  email: boolean;
  system: boolean;
  deadlineReminder: string;
}

export const DEFAULT_SETTINGS: Settings = {
  email: true,
  system: true,
  deadlineReminder: "3",
};

const STORAGE_KEY = "sgd-settings";

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Se não houver nada ou se for a string "undefined"/"null", retorna o padrão
    if (!stored || stored === "undefined" || stored === "null") {
      return DEFAULT_SETTINGS;
    }
    
    const parsed = JSON.parse(stored);
    // Garante que o objeto retornado tenha todas as chaves do padrão (merge)
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}

export function resetSettings(): Settings {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}