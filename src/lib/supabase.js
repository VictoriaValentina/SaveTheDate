import { createClient } from "@supabase/supabase-js";

// As credenciais do Supabase devem ser definidas como variáveis de ambiente
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "VITE_SUPABASE_URL e VITE_SUPABASE_KEY devem ser definidas como variáveis de ambiente.",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const submitRSVP = async (formData) => {
  try {
    const { data, error } = await supabase.from("convidados").insert([
      {
        name: formData.name,
        email: formData.email,
        confirmed_church: formData.confirmed_church,
        confirmed_barbecue: formData.confirmed_barbecue,
        companions: formData.companions,
        companions_names: formData.companions_names,
      },
    ]);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Erro ao enviar RSVP:", error);
    return { success: false, error: error.message };
  }
};

export const getRSVPs = async () => {
  try {
    const { data, error } = await supabase.from("convidados").select("*");

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Erro ao buscar RSVPs:", error);
    return { success: false, error: error.message };
  }
};
