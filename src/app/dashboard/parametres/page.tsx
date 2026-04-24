import { Settings } from "lucide-react";
import { getTypesServices, getFournisseurs, getForfaits } from "@/lib/supabase/queries";
import { TypesServicesCard, FournisseursCard, ForfaitsCard } from "./options-cards";
import { MotionFadeIn } from "@/components/motion-wrapper";

export default async function ParametresPage() {
  const [typesServices, fournisseurs, forfaits] = await Promise.all([
    getTypesServices(),
    getFournisseurs(),
    getForfaits(),
  ]);

  return (
    <div className="space-y-8 pb-10">
      <MotionFadeIn delay={0.1}>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gradient flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Configuration du CRM et préférences système
          </p>
        </div>
      </MotionFadeIn>

      <MotionFadeIn delay={0.2} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <TypesServicesCard initialData={typesServices} />
        <FournisseursCard initialData={fournisseurs} />
        <ForfaitsCard initialData={forfaits} fournisseurs={fournisseurs} />
      </MotionFadeIn>
    </div>
  );
}
