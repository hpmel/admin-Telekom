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
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardKPIs, getPipelineCounts, getFactures } from "@/lib/supabase/queries";
import { formatCAD } from "@/lib/facturation";
import Link from "next/link";
import { MotionFadeIn, MotionStaggerGroup, MotionStaggerItem } from "@/components/motion-wrapper";

const pipelineColors: Record<string, string> = {
  analyse: "bg-blue-500 shadow-blue-500/20",
  negociation: "bg-amber-500 shadow-amber-500/20",
  courtage: "bg-purple-500 shadow-purple-500/20",
  client: "bg-primary shadow-primary/20",
};

const pipelineLabels: Record<string, string> = {
  analyse: "Analyse",
  negociation: "Négociation",
  courtage: "Courtage",
  client: "Client",
};

const statutBadgeVariant: Record<string, string> = {
  payee: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  envoyee: "bg-blue-500/15 text-blue-700 border-blue-200",
  en_retard: "bg-red-500/15 text-red-700 border-red-200",
  brouillon: "bg-gray-500/15 text-gray-700 border-gray-200",
};

export default async function DashboardPage() {
  const [kpis, pipeline, factures] = await Promise.all([
    getDashboardKPIs(),
    getPipelineCounts(),
    getFactures(),
  ]);

  const total = pipeline.analyse + pipeline.negociation + pipeline.courtage + pipeline.client;
  const facturesEnRetard = factures.filter((f) => f.statut === "en_retard").length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <MotionFadeIn delay={0.1} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gradient">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Aperçu de vos opérations télécoms
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border/50 shadow-sm" asChild>
            <Link href="/dashboard/clients/nouveau">
              <UserPlus className="w-4 h-4 mr-2 text-primary" />
              Nouveau client
            </Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20" asChild>
            <Link href="/dashboard/documents">
              <Zap className="w-4 h-4 mr-2" />
              Générer un contrat
            </Link>
          </Button>
        </div>
      </MotionFadeIn>

      {/* KPI Cards */}
      <MotionStaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Clients actifs"
          value={kpis.clients_actifs.toString()}
          subtitle={`${kpis.total_clients} au total`}
          icon={<Users className="w-6 h-6" />}
          trend={+12}
        />
        <KPICard
          title="Économies générées"
          value={formatCAD(kpis.economies_generees)}
          subtitle="Depuis le début"
          icon={<TrendingDown className="w-6 h-6" />}
          trend={+8.5}
        />
        <KPICard
          title="Revenus du mois"
          value={formatCAD(kpis.revenus_mois)}
          subtitle={`Total: ${formatCAD(kpis.revenus_total)}`}
          icon={<DollarSign className="w-6 h-6" />}
          trend={+22}
        />
        <KPICard
          title="Taux de conversion"
          value={`${kpis.taux_conversion}%`}
          subtitle="Prospect → Client"
          icon={<ArrowUpRight className="w-6 h-6" />}
          trend={+5}
        />
      </MotionStaggerGroup>

      {/* Pipeline + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <MotionFadeIn delay={0.4} className="lg:col-span-2">
          <Card className="h-full border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Pipeline de vente</CardTitle>
              <CardDescription>Répartition des prospects par étape</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pipeline bar */}
              <div className="flex h-4 rounded-full overflow-hidden bg-muted mb-8 shadow-inner">
                {Object.entries(pipeline).map(([key, count]) => (
                  <div
                    key={key}
                    className={`${pipelineColors[key]} transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                  />
                ))}
              </div>
              {/* Pipeline legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(pipeline).map(([key, count]) => (
                  <Link
                    key={key}
                    href="/dashboard/pipeline"
                    className="flex flex-col gap-2 p-4 rounded-xl border border-border/40 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full shadow-sm ${pipelineColors[key]}`} />
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {pipelineLabels[key]}
                      </p>
                    </div>
                    <p className="text-3xl font-bold tracking-tight text-foreground">{count}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </MotionFadeIn>

        {/* Alerts */}
        <MotionFadeIn delay={0.5}>
          <Card className="h-full border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {kpis.factures_en_attente > 0 && (
                <AlertItem
                  icon={<Receipt className="w-5 h-5 text-amber-500" />}
                  label={`${kpis.factures_en_attente} facture(s) en attente`}
                  href="/dashboard/facturation"
                  variant="warning"
                />
              )}
              {kpis.contrats_a_renouveler > 0 && (
                <AlertItem
                  icon={<Clock className="w-5 h-5 text-blue-500" />}
                  label={`${kpis.contrats_a_renouveler} contrat(s) à renouveler`}
                  href="/dashboard/inventaire"
                  variant="info"
                />
              )}
              {facturesEnRetard > 0 && (
                <AlertItem
                  icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                  label={`${facturesEnRetard} facture(s) en retard`}
                  href="/dashboard/facturation"
                  variant="danger"
                />
              )}
              {kpis.soumissions_expirantes > 0 && (
                <AlertItem
                  icon={<FileText className="w-5 h-5 text-purple-500" />}
                  label={`${kpis.soumissions_expirantes} soumission(s) expirante(s)`}
                  href="/dashboard/documents"
                  variant="info"
                />
              )}
              {kpis.factures_en_attente === 0 &&
                kpis.contrats_a_renouveler === 0 &&
                kpis.soumissions_expirantes === 0 &&
                facturesEnRetard === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                      <Zap className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Tout est au vert</p>
                    <p className="text-xs text-muted-foreground mt-1">Aucune action requise</p>
                  </div>
                )}
            </CardContent>
          </Card>
        </MotionFadeIn>
      </div>

      {/* Recent Invoices */}
      <MotionFadeIn delay={0.6}>
        <Card className="border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/10 pb-4">
            <CardTitle className="text-xl">Dernières factures</CardTitle>
            <Button variant="ghost" size="sm" className="font-medium text-primary hover:bg-primary/10" asChild>
              <Link href="/dashboard/facturation">
                Voir tout <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {factures.slice(0, 5).map((f) => (
                <Link
                  key={f.id}
                  href={`/dashboard/facturation`}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Receipt className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{f.numero}</p>
                      <p className="text-xs text-muted-foreground">{f.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold tracking-tight">{formatCAD(f.montant_ttc)}</span>
                    <Badge
                      variant="outline"
                      className={`${statutBadgeVariant[f.statut]} border shadow-sm px-2.5 py-0.5`}
                    >
                      {f.statut === "payee" ? "Payée" :
                       f.statut === "envoyee" ? "Envoyée" :
                       f.statut === "en_retard" ? "En retard" : "Brouillon"}
                    </Badge>
                  </div>
                </Link>
              ))}
              {factures.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Aucune facture pour le moment.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </MotionFadeIn>
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
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: number;
}) {
  const isPositive = trend >= 0;
  return (
    <MotionStaggerItem>
      <Card className="border-border/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden relative group bg-card">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 font-semibold px-2 py-1 shadow-sm ${
                isPositive ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" : "text-red-600 bg-red-500/10 border-red-500/20"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {Math.abs(trend)}%
            </Badge>
          </div>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          <p className="text-sm font-medium text-muted-foreground mt-2">{title}</p>
          <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>
        </CardContent>
      </Card>
    </MotionStaggerItem>
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
      ? "bg-red-500/5 border-red-500/20 hover:bg-red-500/10 text-red-700 dark:text-red-400"
      : variant === "warning"
      ? "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400"
      : "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10 text-blue-700 dark:text-blue-400";

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group hover:shadow-sm ${bg}`}
    >
      <div className="bg-background rounded-full p-2 shadow-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
      <ArrowUpRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
    </Link>
  );
}
