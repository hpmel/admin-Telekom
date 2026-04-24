"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addService(data: any) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("services_actuels").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/inventaire");
}

export async function updateService(id: string, data: any) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("services_actuels").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/inventaire");
}

export async function deleteService(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("services_actuels").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/inventaire");
}
