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
      registration_id: data.registration_id,
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

  // Ajuste: Verifique se a coluna na tabela 'defesas' é 'user_id' ou 'aluno_id'
  // Geralmente em sistemas escolares, a defesa está ligada ao ID do aluno, 
  // que por sua vez está ligado ao user.id. 
  // Assumindo aqui que existe uma coluna direta ou que você ajustará a query.
  const { data, error } = await supabase
    .from("defesas")
    .select("id, titulo, data, status")
    // .eq("aluno_id", user.id) <--- Verifique qual campo liga a defesa ao usuário
    .order("data", { ascending: false });

  if (error) {
    console.error("Erro ao buscar atividades:", error);
    return [];
  }

  // CORREÇÃO AQUI:
  // As propriedades retornadas devem ter o MESMO NOME da interface Activity
  return data.map((d: any) => ({
    id: d.id,
    titulo: d.titulo, // Corrigido de 'action' para 'titulo'
    data: d.data,     // Corrigido de 'date' para 'data'
    status: d.status  // Corrigido de 'type' para 'status'
  }));
}