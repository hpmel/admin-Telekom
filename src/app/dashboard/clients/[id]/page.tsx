import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Pencil,
  Wifi,
  Receipt,
  FileText,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getClientById,
  getContactsByClient,
  getEmployesByClient,
  getServicesByClient,
  getFacturesByClient,
} from "@/lib/supabase/queries";
import { formatCAD } from "@/lib/facturation";
import { ContactsSection } from "./contacts-section";
import { EmployesSection } from "./employes-section";

const statusConfig: Record<string, { label: string; class: string; emoji: string }> = {
  analyse: { label: "Analyse", class: "bg-blue-500/15 text-blue-700 border-blue-200", emoji: "🔍" },
  negociation: { label: "Négociation", class: "bg-amber-500/15 text-amber-700 border-amber-200", emoji: "🤝" },
  courtage: { label: "Courtage", class: "bg-purple-500/15 text-purple-700 border-purple-200", emoji: "📋" },
  client: { label: "Client", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200", emoji: "✅" },
};

const typeLabels: Record<string, string> = {
  internet: "🌐 Internet",
  telephonie_ip: "📞 Téléphonie IP",
  telephonie_conv: "☎️ Téléphonie conv.",
  mobilite: "📱 Mobilité",
  tv: "📺 Télévision",
  paiement: "💳 Paiement",
};

const statutFacture: Record<string, { label: string; class: string }> = {
  payee: { label: "Payée", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200" },
  envoyee: { label: "Envoyée", class: "bg-blue-500/15 text-blue-700 border-blue-200" },
  en_retard: { label: "En retard", class: "bg-red-500/15 text-red-700 border-red-200" },
  brouillon: { label: "Brouillon", class: "bg-gray-500/15 text-gray-700 border-gray-200" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [client, contacts, employes, services, factures] = await Promise.all([
    getClientById(id),
    getContactsByClient(id),
    getEmployesByClient(id),
    getServicesByClient(id),
    getFacturesByClient(id),
  ]);

  if (!client) {
    notFound();
  }

  const status = statusConfig[client.statut];
  const totalMensuel = services.reduce((sum, s) => sum + s.prix_mensuel, 0);
  const totalFacture = factures.reduce((sum, f) => sum + f.montant_ttc, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clients">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 bg-primary/10">
              <AvatarFallback className="text-primary font-bold text-xl bg-primary/10">
                {client.raison_sociale.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {client.raison_sociale}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <Badge variant="outline" className={status.class}>
                  {status.emoji} {status.label}
                </Badge>
                {client.neq && (
                  <span className="font-mono text-xs">NEQ: {client.neq}</span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Client depuis {new Date(client.created_at).toLocaleDateString("fr-CA")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href={`/dashboard/clients/${id}/modifier`}>
            <Pencil className="w-4 h-4" />
            Modifier
          </Link>
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MiniKPI
          icon={<Users className="w-4 h-4" />}
          label="Contacts"
          value={contacts.length.toString()}
        />
        <MiniKPI
          icon={<Users className="w-4 h-4" />}
          label="Employés"
          value={employes.length.toString()}
        />
        <MiniKPI
          icon={<Wifi className="w-4 h-4" />}
          label="Services"
          value={services.length.toString()}
        />
        <MiniKPI
          icon={<DollarSign className="w-4 h-4" />}
          label="Coût/mois"
          value={formatCAD(totalMensuel)}
        />
        <MiniKPI
          icon={<Receipt className="w-4 h-4" />}
          label="Facturé"
          value={formatCAD(totalFacture)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Company info */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <InfoRow icon={<Users className="w-4 h-4" />} label="Propriétaire" value={client.proprietaire_nom} />
            {client.proprietaire_courriel && (
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Courriel" value={client.proprietaire_courriel} isEmail />
            )}
            {client.proprietaire_telephone && (
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Téléphone" value={client.proprietaire_telephone} />
            )}
            <Separator />
            {client.adresse && (
              <InfoRow
                icon={<MapPin className="w-4 h-4" />}
                label="Adresse"
                value={`${client.adresse}, ${client.ville} ${client.province} ${client.code_postal}`}
              />
            )}
            {client.nb_employes && (
              <InfoRow icon={<Users className="w-4 h-4" />} label="Employés" value={client.nb_employes.toString()} />
            )}
            {client.chiffre_affaires && (
              <InfoRow icon={<DollarSign className="w-4 h-4" />} label="Chiffre d'affaires" value={formatCAD(client.chiffre_affaires)} />
            )}
            {client.code_scian && (
              <InfoRow icon={<FileText className="w-4 h-4" />} label="SCIAN" value={client.code_scian} />
            )}

            {client.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm whitespace-pre-wrap">{client.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right: Contacts, Employés, Services, Factures */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Contacts principaux */}
          <ContactsSection clientId={id} contacts={contacts} />

          {/* 2. Employés */}
          <EmployesSection clientId={id} employes={employes} />

          {/* 3. Services télécom */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary" />
                Services télécom ({services.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Forfait</TableHead>
                      <TableHead className="text-right">Prix/mois</TableHead>
                      <TableHead>Fin contrat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="text-sm">{typeLabels[s.type_service] ?? s.type_service}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{s.fournisseur}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{s.forfait ?? "—"}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCAD(s.prix_mensuel)}</TableCell>
                        <TableCell className="text-sm">
                          {s.date_fin_engagement
                            ? new Date(s.date_fin_engagement).toLocaleDateString("fr-CA")
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Aucun service enregistré.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 4. Factures */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                Factures ({factures.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {factures.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Facture</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">TTC</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Échéance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factures.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-mono text-sm">{f.numero}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{f.description}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCAD(f.montant_ttc)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statutFacture[f.statut]?.class}>
                            {statutFacture[f.statut]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(f.date_echeance).toLocaleDateString("fr-CA")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Aucune facture pour ce client.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function MiniKPI({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <p className="text-lg font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon,
  label,
  value,
  isEmail = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isEmail?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {isEmail ? (
          <a href={`mailto:${value}`} className="text-sm hover:text-primary transition-colors">
            {value}
          </a>
        ) : (
          <p className="text-sm">{value}</p>
        )}
      </div>
    </div>
  );
}
