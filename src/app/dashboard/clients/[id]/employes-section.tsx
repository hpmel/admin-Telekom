"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Mail,
  Phone,
  Trash2,
  X,
  Loader2,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { addEmploye, deleteEmploye } from "./contact-actions";
import type { Employe } from "@/types";

interface EmployesSectionProps {
  clientId: string;
  employes: Employe[];
}

export function EmployesSection({ clientId, employes }: EmployesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addEmploye(clientId, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Employé ajouté!");
        setShowForm(false);
      }
    });
  };

  const handleDelete = async (employeId: string) => {
    if (!confirm("Supprimer cet employé?")) return;
    setDeletingId(employeId);
    startTransition(async () => {
      const result = await deleteEmploye(clientId, employeId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Employé supprimé.");
      }
      setDeletingId(null);
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Employés ({employes.length})
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X className="w-3 h-3" /> Annuler
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" /> Ajouter
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add form */}
        {showForm && (
          <form action={handleSubmit} className="border rounded-lg p-4 bg-muted/20 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="emp-prenom" className="text-xs">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="emp-prenom"
                  name="prenom"
                  placeholder="Marc"
                  required
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-nom" className="text-xs">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="emp-nom"
                  name="nom"
                  placeholder="Gagnon"
                  required
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-fonction" className="text-xs">Fonction / Poste</Label>
                <Input
                  id="emp-fonction"
                  name="fonction"
                  placeholder="Technicien"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-courriel" className="text-xs">Courriel</Label>
                <Input
                  id="emp-courriel"
                  name="courriel"
                  type="email"
                  placeholder="marc.g@entreprise.ca"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-telephone" className="text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Téléphone
                </Label>
                <Input
                  id="emp-telephone"
                  name="telephone"
                  type="tel"
                  placeholder="514-555-6789"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-carte_sim" className="text-xs flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  N° Carte SIM
                </Label>
                <Input
                  id="emp-carte_sim"
                  name="carte_sim"
                  placeholder="8912 3456 7890 1234"
                  className="h-9 text-sm font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={isPending} className="gap-1.5">
                {isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                Ajouter l&apos;employé
              </Button>
            </div>
          </form>
        )}

        {/* Employee list */}
        {employes.length > 0 ? (
          <div className="space-y-2">
            {employes.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 group hover:border-primary/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                      {emp.prenom} {emp.nom}
                    </p>
                    {emp.fonction && (
                      <Badge variant="secondary" className="text-[10px]">
                        {emp.fonction}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                    {emp.telephone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-blue-500" />
                        {emp.telephone}
                      </span>
                    )}
                    {emp.carte_sim && (
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-amber-500" />
                        <span className="font-mono">{emp.carte_sim}</span>
                      </span>
                    )}
                    {emp.courriel && (
                      <a
                        href={`mailto:${emp.courriel}`}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Mail className="w-3 h-3" />
                        {emp.courriel}
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  onClick={() => handleDelete(emp.id)}
                  disabled={deletingId === emp.id}
                >
                  {deletingId === emp.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            Aucun employé enregistré pour ce client.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
