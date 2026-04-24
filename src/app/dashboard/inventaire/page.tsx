import { Wifi } from "lucide-react";
import { getAllServices, getClients, getTypesServices, getFournisseurs, getForfaits } from "@/lib/supabase/queries";
import { InventaireTable } from "./inventaire-table";
import { MotionFadeIn } from "@/components/motion-wrapper";

export default async function InventairePage() {
  const [services, clients, typesServices, fournisseurs, forfaits] = await Promise.all([
    getAllServices(),
    getClients(),
    getTypesServices(),
    getFournisseurs(),
    getForfaits(),
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <MotionFadeIn delay={0.1}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gradient flex items-center gap-3">
              <Wifi className="w-8 h-8 text-primary" />
              Inventaire Télécom
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {services.length} services gérés au total
            </p>
          </div>
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.2}>
        <InventaireTable
          initialServices={services}
          clients={clients}
          optionsTypes={typesServices}
          optionsFournisseurs={fournisseurs}
          optionsForfaits={forfaits}
        />
      </MotionFadeIn>
    </div>
  );
}
