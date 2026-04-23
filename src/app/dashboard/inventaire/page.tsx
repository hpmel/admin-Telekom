import { Wifi, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllServices, getClients } from "@/lib/supabase/queries";
import { formatCAD } from "@/lib/facturation";

const typeLabels: Record<string, string> = {
  internet: "🌐 Internet",
  telephonie_ip: "📞 Téléphonie IP",
  telephonie_conv: "☎️ Téléphonie conv.",
  mobilite: "📱 Mobilité",
  tv: "📺 Télévision",
  paiement: "💳 Paiement",
};

export default async function InventairePage() {
  const [services, clients] = await Promise.all([getAllServices(), getClients()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Wifi className="w-8 h-8 text-primary" />
            Inventaire Télécom
          </h1>
          <p className="text-muted-foreground mt-1">
            {services.length} services actifs de vos clients
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un service
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Fournisseur</TableHead>
                <TableHead className="font-semibold">Forfait</TableHead>
                <TableHead className="font-semibold text-right">Lignes</TableHead>
                <TableHead className="font-semibold text-right">Prix/mois</TableHead>
                <TableHead className="font-semibold">Fin engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => {
                const client = clients.find((c) => c.id === s.client_id);
                return (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {client?.raison_sociale ?? "—"}
                    </TableCell>
                    <TableCell>{typeLabels[s.type_service] ?? s.type_service}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{s.fournisseur}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{s.forfait ?? "—"}</TableCell>
                    <TableCell className="text-right">{s.nb_lignes}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCAD(s.prix_mensuel)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.date_fin_engagement
                        ? new Date(s.date_fin_engagement).toLocaleDateString("fr-CA")
                        : <span className="text-muted-foreground">Sans contrat</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Aucun service enregistré.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
