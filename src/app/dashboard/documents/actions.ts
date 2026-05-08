"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDocumentAction(data: {
  client_id: string;
  type: string;
  nom: string;
  url_stockage: string;
}) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase
    .from("documents")
    .insert([
      {
        client_id: data.client_id,
        type: data.type,
        nom: data.nom,
        url_stockage: data.url_stockage,
      },
    ]);

  if (error) {
    console.error("Error creating document:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/documents");
  revalidatePath(`/dashboard/clients/${data.client_id}`);
  
  return { success: true };
}

export async function deleteDocumentAction(id: string, url_stockage: string | null) {
  const supabase = await createServerSupabaseClient();
  
  if (url_stockage) {
    // Extract filename from URL if necessary, but actually in Supabase storage, url_stockage might be the path.
    // Assuming url_stockage is the file path within the 'documents' bucket.
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([url_stockage]);
      
    if (storageError) {
      console.error("Error removing file from storage:", storageError);
    }
  }

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/documents");
  // Could revalidate client page if we knew the client_id, but the global path also gets revalidated.
  
  return { success: true };
}
