"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PipelineStatus } from "@/types";

export type ClientFormState = {
  success?: boolean;
  error?: string;
  clientId?: string;
};

export async function createClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const supabase = await createServerSupabaseClient();

  const raison_sociale = formData.get("raison_sociale") as string;
  if (!raison_sociale?.trim()) {
    return { error: "Le nom de l'entreprise est requis." };
  }

  const proprietaire_nom = formData.get("proprietaire_nom") as string;
  if (!proprietaire_nom?.trim()) {
    return { error: "Le nom du propriétaire est requis." };
  }

  const nbEmployes = formData.get("nb_employes") as string;
  const chiffreAffaires = formData.get("chiffre_affaires") as string;

  const { data, error } = await supabase
    .from("clients")
    .insert({
      raison_sociale: raison_sociale.trim(),
      neq: (formData.get("neq") as string)?.trim() || null,
      adresse: (formData.get("adresse") as string)?.trim() || null,
      ville: (formData.get("ville") as string)?.trim() || null,
      province: (formData.get("province") as string)?.trim() || "QC",
      code_postal: (formData.get("code_postal") as string)?.trim() || null,
      statut: (formData.get("statut") as PipelineStatus) || "analyse",
      proprietaire_nom: proprietaire_nom.trim(),
      proprietaire_courriel: (formData.get("proprietaire_courriel") as string)?.trim() || null,
      proprietaire_telephone: (formData.get("proprietaire_telephone") as string)?.trim() || null,
      code_scian: (formData.get("code_scian") as string)?.trim() || null,
      nb_employes: nbEmployes ? parseInt(nbEmployes) : null,
      chiffre_affaires: chiffreAffaires ? parseFloat(chiffreAffaires) : null,
      notes: (formData.get("notes") as string)?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Un client avec ce NEQ existe déjà." };
    }
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/pipeline");
  revalidatePath("/dashboard");

  return { success: true, clientId: data.id };
}

export async function updateClient(
  id: string,
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const supabase = await createServerSupabaseClient();

  const raison_sociale = formData.get("raison_sociale") as string;
  if (!raison_sociale?.trim()) {
    return { error: "Le nom de l'entreprise est requis." };
  }

  const nbEmployes = formData.get("nb_employes") as string;
  const chiffreAffaires = formData.get("chiffre_affaires") as string;

  const { error } = await supabase
    .from("clients")
    .update({
      raison_sociale: raison_sociale.trim(),
      neq: (formData.get("neq") as string)?.trim() || null,
      adresse: (formData.get("adresse") as string)?.trim() || null,
      ville: (formData.get("ville") as string)?.trim() || null,
      province: (formData.get("province") as string)?.trim() || "QC",
      code_postal: (formData.get("code_postal") as string)?.trim() || null,
      statut: (formData.get("statut") as PipelineStatus) || "analyse",
      proprietaire_nom: (formData.get("proprietaire_nom") as string)?.trim() || "",
      proprietaire_courriel: (formData.get("proprietaire_courriel") as string)?.trim() || null,
      proprietaire_telephone: (formData.get("proprietaire_telephone") as string)?.trim() || null,
      code_scian: (formData.get("code_scian") as string)?.trim() || null,
      nb_employes: nbEmployes ? parseInt(nbEmployes) : null,
      chiffre_affaires: chiffreAffaires ? parseFloat(chiffreAffaires) : null,
      notes: (formData.get("notes") as string)?.trim() || null,
    })
    .eq("id", id);

  if (error) {
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath("/dashboard/clients");
  revalidatePath(`/dashboard/clients/${id}`);
  revalidatePath("/dashboard/pipeline");
  revalidatePath("/dashboard");

  return { success: true, clientId: id };
}

export async function deleteClient(id: string): Promise<ClientFormState> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/pipeline");
  revalidatePath("/dashboard");

  return { success: true };
}
