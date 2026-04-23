"use client";

import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Mail className="w-8 h-8 text-primary" />
          Communications
        </h1>
        <p className="text-muted-foreground mt-1">
          Courriels, templates et suivi des envois
        </p>
      </div>
      <Card>
        <CardContent className="py-16 text-center">
          <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            Module en développement
          </h3>
          <p className="text-sm text-muted-foreground/70 mt-1 max-w-md mx-auto">
            Les templates de courriels automatisés et l&apos;intégration avec Resend arrivent en Phase 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
