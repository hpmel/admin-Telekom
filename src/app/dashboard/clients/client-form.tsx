"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Building2, User, MapPin, Briefcase, Save, Loader2 } from "lucide-react";
import { createClient, updateClient, type ClientFormState } from "./actions";
import type { Client, PipelineStatus } from "@/types";

interface ClientFormProps {
  client?: Client; // If provided, we're in edit mode
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const isEdit = !!client;

  const boundUpdate = client
    ? updateClient.bind(null, client.id)
    : undefined;

  const [state, formAction, isPending] = useActionState<ClientFormState, FormData>(
    isEdit ? boundUpdate! : createClient,
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success(isEdit ? "Client modifié avec succès!" : "Client créé avec succès!");
      router.push(`/dashboard/clients/${state.clientId}`);
    }
  }, [state.success, state.clientId, isEdit, router]);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.error}
        </div>
      )}

      {/* Entreprise */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Informations de l&apos;entreprise
          </CardTitle>
          <CardDescription>
            Détails généraux de l&apos;entreprise cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="raison_sociale">
                Raison sociale <span className="text-red-500">*</span>
              </Label>
              <Input
                id="raison_sociale"
                name="raison_sociale"
                placeholder="Ex: Transport Québec Express Ltée"
                defaultValue={client?.raison_sociale ?? ""}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neq">NEQ (optionnel)</Label>
              <Input
                id="neq"
                name="neq"
                placeholder="1234567890"
                defaultValue={client?.neq ?? ""}
                maxLength={20}
                className="h-10 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code_scian">Code SCIAN</Label>
              <Input
                id="code_scian"
                name="code_scian"
                placeholder="484110"
                defaultValue={client?.code_scian ?? ""}
                maxLength={10}
                className="h-10 font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nb_employes">Nombre d&apos;employés</Label>
              <Input
                id="nb_employes"
                name="nb_employes"
                type="number"
                placeholder="25"
                defaultValue={client?.nb_employes ?? ""}
                min={0}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chiffre_affaires">Chiffre d&apos;affaires ($)</Label>
              <Input
                id="chiffre_affaires"
                name="chiffre_affaires"
                type="number"
                placeholder="1500000"
                defaultValue={client?.chiffre_affaires ?? ""}
                min={0}
                step={0.01}
                className="h-10"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="statut">Statut pipeline</Label>
            <Select name="statut" defaultValue={client?.statut ?? "analyse"}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analyse">🔍 Analyse</SelectItem>
                <SelectItem value="negociation">🤝 Négociation</SelectItem>
                <SelectItem value="courtage">📋 Courtage</SelectItem>
                <SelectItem value="client">✅ Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Propriétaire */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Propriétaire / Contact principal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="proprietaire_nom">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="proprietaire_nom"
                name="proprietaire_nom"
                placeholder="Jean-Pierre Tremblay"
                defaultValue={client?.proprietaire_nom ?? ""}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proprietaire_courriel">Courriel</Label>
              <Input
                id="proprietaire_courriel"
                name="proprietaire_courriel"
                type="email"
                placeholder="jp.tremblay@entreprise.ca"
                defaultValue={client?.proprietaire_courriel ?? ""}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proprietaire_telephone">Téléphone</Label>
              <Input
                id="proprietaire_telephone"
                name="proprietaire_telephone"
                type="tel"
                placeholder="450-555-1234"
                defaultValue={client?.proprietaire_telephone ?? ""}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Adresse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                name="adresse"
                placeholder="1500 Boul. Le Corbusier"
                defaultValue={client?.adresse ?? ""}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                name="ville"
                placeholder="Montréal"
                defaultValue={client?.ville ?? ""}
                className="h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  name="province"
                  placeholder="QC"
                  defaultValue={client?.province ?? "QC"}
                  maxLength={2}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  name="code_postal"
                  placeholder="H2X 3L3"
                  defaultValue={client?.code_postal ?? ""}
                  maxLength={7}
                  className="h-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Notes internes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Notes internes sur le client, contexte, historique..."
            defaultValue={client?.notes ?? ""}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isPending} className="gap-2 min-w-[160px]">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEdit ? "Sauvegarder" : "Créer le client"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
