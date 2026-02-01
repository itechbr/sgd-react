import { createClient} from "@/lib/supabase/client";

const supabase = createClient()

export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, registration_number")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    name_full: data.full_name,          
    role: "Usuário Veterano",            
    phone: "",                           
    email: data.email,
  };
}

export async function updateProfile({
  name_full,
  phone,
}: {
  name_full: string;
  phone: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  const { error } = await supabase
    .from("profiles")
    .update({ name_full, phone })
    .eq("id", user.id);

  if (error) throw error;

  // registra atividade
  await supabase.from("activity_history").insert({
    user_id: user.id,
    description: "Atualizou o perfil de usuário",
  });

  return { name_full, phone };
}

export async function getActivities() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado");

  const { data, error } = await supabase
    .from("activity_history")
    .select("id, description, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addActivity(description: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("activity_history").insert({
    user_id: user.id,
    description,
  });
}