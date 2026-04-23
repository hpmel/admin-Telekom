"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

// ---- CONTACTS ----

export async function addContact(
  clientId: string,
  formData: FormData
): Promise<ContactFormState> {
  const supabase = await createServerSupabaseClient();

  const prenom = formData.get("prenom") as string;
  const nom = formData.get("nom") as string;

  if (!prenom?.trim() || !nom?.trim()) {
    return { error: "Le prénom et le nom sont requis." };
  }

  const { error } = await supabase.from("contacts").insert({
    client_id: clientId,
    prenom: prenom.trim(),
    nom: nom.trim(),
    fonction: (formData.get("fonction") as string)?.trim() || null,
    courriel: (formData.get("courriel") as string)?.trim() || null,
    telephone: (formData.get("telephone") as string)?.trim() || null,
    est_principal: formData.get("est_principal") === "on",
    est_mandataire: formData.get("est_mandataire") === "on",
  });

  if (error) {
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath(`/dashboard/clients/${clientId}`);
  return { success: true };
}

export async function deleteContact(
  clientId: string,
  contactId: string
): Promise<ContactFormState> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId);

  if (error) {
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath(`/dashboard/clients/${clientId}`);
  return { success: true };
}

// ---- EMPLOYÉS ----

export async function addEmploye(
  clientId: string,
  formData: FormData
): Promise<ContactFormState> {
  const supabase = await createServerSupabaseClient();

  const prenom = formData.get("prenom") as string;
  const nom = formData.get("nom") as string;

  if (!prenom?.trim() || !nom?.trim()) {
    return { error: "Le prénom et le nom sont requis." };
  }

  const { error } = await supabase.from("employes").insert({
    client_id: clientId,
    prenom: prenom.trim(),
    nom: nom.trim(),
    fonction: (formData.get("fonction") as string)?.trim() || null,
    courriel: (formData.get("courriel") as string)?.trim() || null,
    telephone: (formData.get("telephone") as string)?.trim() || null,
    carte_sim: (formData.get("carte_sim") as string)?.trim() || null,
  });

  if (error) {
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath(`/dashboard/clients/${clientId}`);
  return { success: true };
}

export async function deleteEmploye(
  clientId: string,
  employeId: string
): Promise<ContactFormState> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("employes")
    .delete()
    .eq("id", employeId);

  if (error) {
    return { error: `Erreur: ${error.message}` };
  }

  revalidatePath(`/dashboard/clients/${clientId}`);
  return { success: true };
}
