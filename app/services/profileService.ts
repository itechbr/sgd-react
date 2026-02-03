import {createClient} from "@/lib/supabase/client";
import { Profile } from "@/app/type/perfil";
import { Activity } from "@/app/type/activity";

const supabase = createClient()

//info do perfil
export async function getProfile(): Promise<Profile | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }

  return data ?? null;
}

export async function updateProfile(
  data: Pick<Profile, "full_name" | "role" | "phone">
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      role: data.role,
      phone: data.phone,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}


// Historico
export async function getActivityHistory(): Promise<Activity[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Usuário não autenticado");
  }

  const { data, error } = await supabase
    .from("defesas")
    .select("id, titulo, data, status")
    .eq("user_id", user.id)
    .order("data", { ascending: false });

  if (error) {
    console.error("Erro ao buscar histórico:", error);
    throw error;
  }

  return data ?? [];
}
