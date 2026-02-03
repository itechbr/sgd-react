import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/app/type/perfil";
import { Activity } from "@/app/type/activity";

const supabase = createClient();

export async function getProfile(): Promise<Profile | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Usuário não autenticado");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, phone, campus, department, registration_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar perfil:", error);
    throw error;
  }

  return data ?? null;
}

// ATUALIZADO: Agora aceita registration_id
export async function updateProfile(
  data: Pick<Profile, "full_name" | "role" | "phone" | "campus" | "department" | "registration_id">
) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      role: data.role,
      phone: data.phone,
      campus: data.campus,
      department: data.department,
      registration_id: data.registration_id, // Adicionado aqui
    })
    .eq("id", user.id);

  if (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
}

export async function getActivityHistory(): Promise<Activity[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("defesas")
    .select("id, titulo, data, status")
    .eq("user_id", user.id)
    .order("data", { ascending: false });

  if (error) return [];

  return data.map((d: any) => ({
    id: d.id,
    action: `Defesa: ${d.titulo}`,
    date: d.data,
    type: d.status
  }));
}