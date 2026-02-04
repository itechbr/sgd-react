const STORAGE_KEY = "sgd_permissions";

export type Permissions = {
  alunoEnviarProrrogacao: boolean;
  alunoAgendarDefesa: boolean;
  orientadorCriarBanca: boolean;
  orientadorEditarNotas: boolean;
};

export const DEFAULT_PERMISSIONS: Permissions = {
  alunoEnviarProrrogacao: false,
  alunoAgendarDefesa: false,
  orientadorCriarBanca: false,
  orientadorEditarNotas: false,
};

export function loadPermissions(): Permissions {
  if (typeof window === "undefined") {
    return DEFAULT_PERMISSIONS;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_PERMISSIONS;

  try {
    return { ...DEFAULT_PERMISSIONS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_PERMISSIONS;
  }
}

export function savePermissions(permissions: Permissions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
}

export function resetPermissions(): Permissions {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_PERMISSIONS;
}
