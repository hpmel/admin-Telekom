import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClientById } from "@/lib/supabase/queries";
import { ClientForm } from "../../client-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModifierClientPage({ params }: PageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clients/${id}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Modifier — {client.raison_sociale}
          </h1>
          <p className="text-muted-foreground text-sm">
            Mise à jour de la fiche client
          </p>
        </div>
      </div>

      <ClientForm client={client} />
    </div>
  );
}
