import { Receipt, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getFactures, getClients } from "@/lib/supabase/queries";
import { formatCAD } from "@/lib/facturation";

const statutConfig: Record<string, { label: string; class: string }> = {
  payee: { label: "Payée", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200" },
  envoyee: { label: "Envoyée", class: "bg-blue-500/15 text-blue-700 border-blue-200" },
  en_retard: { label: "En retard", class: "bg-red-500/15 text-red-700 border-red-200" },
  brouillon: { label: "Brouillon", class: "bg-gray-500/15 text-gray-700 border-gray-200" },
};

export default async function FacturationPage() {
  const [factures, clients] = await Promise.all([getFactures(), getClients()]);

  const totalPayee = factures
    .filter((f) => f.statut === "payee")
    .reduce((s, f) => s + f.montant_ttc, 0);
  const totalEnvoyee = factures
    .filter((f) => f.statut === "envoyee")
    .reduce((s, f) => s + f.montant_ttc, 0);
  const totalRetard = factures
    .filter((f) => f.statut === "en_retard")
    .reduce((s, f) => s + f.montant_ttc, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Receipt className="w-8 h-8 text-primary" />
            Facturation
          </h1>
          <p className="text-muted-foreground mt-1">
            {factures.length} factures — gérez vos paiements
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle facture
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <p className="text-sm text-emerald-700">Payées</p>
            <p className="text-2xl font-bold text-emerald-800">{formatCAD(totalPayee)}</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700">En attente</p>
            <p className="text-2xl font-bold text-blue-800">{formatCAD(totalEnvoyee)}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <p className="text-sm text-red-700">En retard</p>
            <p className="text-2xl font-bold text-red-800">{formatCAD(totalRetard)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">N° Facture</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold text-right">HT</TableHead>
                <TableHead className="font-semibold text-right">TPS</TableHead>
                <TableHead className="font-semibold text-right">TVQ</TableHead>
                <TableHead className="font-semibold text-right">TTC</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Échéance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factures.map((f) => {
                const client = clients.find((c) => c.id === f.client_id);
                return (
                  <TableRow key={f.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm font-medium">{f.numero}</TableCell>
                    <TableCell className="text-sm">{client?.raison_sociale ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {f.description}
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatCAD(f.montant_ht)}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatCAD(f.tps)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatCAD(f.tvq)}
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold">
                      {formatCAD(f.montant_ttc)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statutConfig[f.statut]?.class}>
                        {statutConfig[f.statut]?.label ?? f.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(f.date_echeance).toLocaleDateString("fr-CA")}
                    </TableCell>
                  </TableRow>
                );
              })}
              {factures.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    Aucune facture enregistrée.
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
