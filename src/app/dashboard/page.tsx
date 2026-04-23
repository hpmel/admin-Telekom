"use client";

import {
  Users,
  DollarSign,
  TrendingDown,
  Receipt,
  AlertTriangle,
  Clock,
  UserPlus,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CircleDot,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockKPIs, mockPipelineCounts, mockActivity, mockFactures } from "@/lib/mock-data";
import { formatCAD } from "@/lib/facturation";
import Link from "next/link";

const pipelineColors: Record<string, string> = {
  analyse: "bg-blue-500",
  negociation: "bg-amber-500",
  courtage: "bg-purple-500",
  client: "bg-primary",
};

const pipelineLabels: Record<string, string> = {
  analyse: "Analyse",
  negociation: "Négociation",
  courtage: "Courtage",
  client: "Client",
};

const activityIcons: Record<string, React.ReactNode> = {
  client_added: <UserPlus className="w-4 h-4 text-primary" />,
  status_changed: <CircleDot className="w-4 h-4 text-amber-500" />,
  invoice_sent: <Receipt className="w-4 h-4 text-blue-500" />,
  document_signed: <FileText className="w-4 h-4 text-purple-500" />,
  payment_received: <DollarSign className="w-4 h-4 text-emerald-500" />,
};

const statutBadgeVariant: Record<string, string> = {
  payee: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  envoyee: "bg-blue-500/15 text-blue-700 border-blue-200",
  en_retard: "bg-red-500/15 text-red-700 border-red-200",
  brouillon: "bg-gray-500/15 text-gray-700 border-gray-200",
};

export default function DashboardPage() {
  const kpis = mockKPIs;
  const pipeline = mockPipelineCounts;
  const total = pipeline.analyse + pipeline.negociation + pipeline.courtage + pipeline.client;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue Marie-Josée — voici votre vue d&apos;ensemble.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/clients">
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau client
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/documents">
              <FileText className="w-4 h-4 mr-2" />
              Générer un contrat
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Clients actifs"
          value={kpis.clients_actifs.toString()}
          subtitle={`${kpis.total_clients} au total`}
          icon={<Users className="w-5 h-5" />}
          trend={+12}
          delay="stagger-1"
        />
        <KPICard
          title="Économies générées"
          value={formatCAD(kpis.economies_generees)}
          subtitle="Depuis le début"
          icon={<TrendingDown className="w-5 h-5" />}
          trend={+8.5}
          delay="stagger-2"
        />
        <KPICard
          title="Revenus du mois"
          value={formatCAD(kpis.revenus_mois)}
          subtitle={`Total: ${formatCAD(kpis.revenus_total)}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={+22}
          delay="stagger-3"
        />
        <KPICard
          title="Taux de conversion"
          value={`${kpis.taux_conversion}%`}
          subtitle="Prospect → Client"
          icon={<ArrowUpRight className="w-5 h-5" />}
          trend={+5}
          delay="stagger-4"
        />
      </div>

      {/* Pipeline + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <Card className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline de vente</CardTitle>
            <CardDescription>Répartition des prospects par étape</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pipeline bar */}
            <div className="flex h-5 rounded-full overflow-hidden bg-muted mb-6">
              {Object.entries(pipeline).map(([key, count]) => (
                <div
                  key={key}
                  className={`${pipelineColors[key]} transition-all duration-700 ease-out`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              ))}
            </div>
            {/* Pipeline legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(pipeline).map(([key, count]) => (
                <Link
                  key={key}
                  href="/dashboard/pipeline"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className={`w-3 h-3 rounded-full ${pipelineColors[key]}`} />
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">
                      {pipelineLabels[key]}
                    </p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Alertes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpis.factures_en_attente > 0 && (
              <AlertItem
                icon={<Receipt className="w-4 h-4 text-amber-500" />}
                label={`${kpis.factures_en_attente} facture(s) en attente`}
                href="/dashboard/facturation"
                variant="warning"
              />
            )}
            {kpis.contrats_a_renouveler > 0 && (
              <AlertItem
                icon={<Clock className="w-4 h-4 text-blue-500" />}
                label={`${kpis.contrats_a_renouveler} contrat(s) à renouveler`}
                href="/dashboard/inventaire"
                variant="info"
              />
            )}
            {mockFactures.filter((f) => f.statut === "en_retard").length > 0 && (
              <AlertItem
                icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
                label={`${mockFactures.filter((f) => f.statut === "en_retard").length} facture(s) en retard`}
                href="/dashboard/facturation"
                variant="danger"
              />
            )}
            {kpis.soumissions_expirantes > 0 && (
              <AlertItem
                icon={<FileText className="w-4 h-4 text-purple-500" />}
                label={`${kpis.soumissions_expirantes} soumission(s) expirante(s)`}
                href="/dashboard/documents"
                variant="info"
              />
            )}
            {kpis.factures_en_attente === 0 &&
              kpis.contrats_a_renouveler === 0 &&
              kpis.soumissions_expirantes === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  ✅ Aucune alerte en ce moment
                </p>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity + Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity feed */}
        <Card className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <CardHeader>
            <CardTitle className="text-lg">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                    {activityIcons[item.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.client_name}</p>
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeDate(item.timestamp)}
                  </time>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent invoices */}
        <Card className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Dernières factures</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/facturation">
                Voir tout <ArrowUpRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockFactures.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{f.numero}</p>
                      <p className="text-xs text-muted-foreground">{f.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatCAD(f.montant_ttc)}</span>
                    <Badge
                      variant="outline"
                      className={statutBadgeVariant[f.statut]}
                    >
                      {f.statut === "payee" ? "Payée" :
                       f.statut === "envoyee" ? "Envoyée" :
                       f.statut === "en_retard" ? "En retard" : "Brouillon"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  delay,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: number;
  delay: string;
}) {
  const isPositive = trend >= 0;
  return (
    <Card className={`animate-fade-in-up opacity-0 ${delay} hover:shadow-lg hover:shadow-primary/5 transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              isPositive ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
        <p className="text-xs text-muted-foreground/70">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function AlertItem({
  icon,
  label,
  href,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  variant: "warning" | "danger" | "info";
}) {
  const bg =
    variant === "danger"
      ? "bg-red-50 border-red-200 hover:bg-red-100"
      : variant === "warning"
      ? "bg-amber-50 border-amber-200 hover:bg-amber-100"
      : "bg-blue-50 border-blue-200 hover:bg-blue-100";

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${bg}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      <ArrowUpRight className="w-3 h-3 ml-auto text-muted-foreground" />
    </Link>
  );
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} sem.`;
  return date.toLocaleDateString("fr-CA", { day: "numeric", month: "short" });
}
