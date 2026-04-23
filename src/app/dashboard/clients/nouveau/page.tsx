import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClientForm } from "../client-form";

export default function NouveauClientPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/clients">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Nouveau client
          </h1>
          <p className="text-muted-foreground text-sm">
            Remplissez les informations pour créer une fiche client
          </p>
        </div>
      </div>

      <ClientForm />
    </div>
  );
}
