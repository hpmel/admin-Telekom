"use client";

import { mockClients } from "@/lib/mock-data";
import type { PipelineStatus, Client } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, MapPin, Users as UsersIcon } from "lucide-react";
import Link from "next/link";

const columns: { key: PipelineStatus; label: string; color: string; bgColor: string }[] = [
  { key: "analyse", label: "🔍 Analyse", color: "bg-blue-500", bgColor: "bg-blue-50" },
  { key: "negociation", label: "🤝 Négociation", color: "bg-amber-500", bgColor: "bg-amber-50" },
  { key: "courtage", label: "📋 Courtage", color: "bg-purple-500", bgColor: "bg-purple-50" },
  { key: "client", label: "✅ Client", color: "bg-emerald-500", bgColor: "bg-emerald-50" },
];

export default function PipelinePage() {
  const clientsByStatus = (status: PipelineStatus): Client[] =>
    mockClients.filter((c) => c.statut === status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline de vente</h1>
        <p className="text-muted-foreground mt-1">
          Suivez vos prospects à travers les étapes du processus
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[calc(100vh-220px)]">
        {columns.map((col) => {
          const clients = clientsByStatus(col.key);
          return (
            <div key={col.key} className="flex flex-col">
              {/* Column header */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-t-xl ${col.bgColor}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {clients.length}
                </Badge>
              </div>

              {/* Column body */}
              <div className="flex-1 bg-muted/20 rounded-b-xl p-3 space-y-3 border border-t-0 border-border/50">
                {clients.map((client) => (
                  <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
                    <Card className="hover:shadow-md hover:shadow-primary/5 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10 bg-primary/10">
                            <AvatarFallback className="text-primary font-semibold text-sm bg-primary/10">
                              {client.raison_sociale.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                              {client.raison_sociale}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {client.proprietaire_nom}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {client.ville}
                          </span>
                          {client.nb_employes && (
                            <span className="flex items-center gap-1">
                              <UsersIcon className="w-3 h-3" />
                              {client.nb_employes}
                            </span>
                          )}
                        </div>
                        {client.notes && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">
                            {client.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                {clients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Aucun prospect
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
