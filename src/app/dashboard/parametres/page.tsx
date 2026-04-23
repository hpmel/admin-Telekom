"use client";

import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Paramètres
        </h1>
        <p className="text-muted-foreground mt-1">
          Configuration du CRM et préférences
        </p>
      </div>
      <Card>
        <CardContent className="py-16 text-center">
          <Settings className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Paramètres à venir
          </h3>
          <p className="text-sm text-muted-foreground/70 mt-1 max-w-md mx-auto">
            Profil utilisateur, connexion Supabase, intégrations et préférences de notification.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
