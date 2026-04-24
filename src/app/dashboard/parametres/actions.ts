"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ========================================
// Types de services
// ========================================

export async function addTypeService(data: { label: string; emoji: string }) {
  const supabase = await createServerSupabaseClient();
  // Get max ordre
  const { data: maxData } = await supabase
    .from("options_types_services")
    .select("ordre")
    .order("ordre", { ascending: false })
    .limit(1);
  const nextOrdre = (maxData?.[0]?.ordre ?? 0) + 1;

  const { error } = await supabase
    .from("options_types_services")
    .insert({ ...data, ordre: nextOrdre, actif: true });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}

export async function updateTypeService(
  id: string,
  data: { label?: string; emoji?: string; actif?: boolean }
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("options_types_services")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}

export async function deleteTypeService(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("options_types_services")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}

// ========================================
// Fournisseurs
// ========================================

export async function addFournisseur(data: { nom: string }) {
  const supabase = await createServerSupabaseClient();
  const { data: maxData } = await supabase
    .from("options_fournisseurs")
    .select("ordre")
    .order("ordre", { ascending: false })
    .limit(1);
  const nextOrdre = (maxData?.[0]?.ordre ?? 0) + 1;

  const { error } = await supabase
    .from("options_fournisseurs")
    .insert({ ...data, ordre: nextOrdre, actif: true });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}

export async function updateFournisseur(
  id: string,
  data: { nom?: string; actif?: boolean }
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("options_fournisseurs")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}

export async function deleteFournisseur(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("options_fournisseurs")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}

// ========================================
// Forfaits
// ========================================

export async function addForfait(data: {
  nom: string;
  fournisseur_id?: string | null;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: maxData } = await supabase
    .from("options_forfaits")
    .select("ordre")
    .order("ordre", { ascending: false })
    .limit(1);
  const nextOrdre = (maxData?.[0]?.ordre ?? 0) + 1;

  const { error } = await supabase
    .from("options_forfaits")
    .insert({
      nom: data.nom,
      fournisseur_id: data.fournisseur_id || null,
      ordre: nextOrdre,
      actif: true,
    });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}

export async function updateForfait(
  id: string,
  data: { nom?: string; fournisseur_id?: string | null; actif?: boolean }
) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("options_forfaits")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}

export async function deleteForfait(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("options_forfaits")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/parametres");
}
