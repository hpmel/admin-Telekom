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
  Shield,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { addContact, deleteContact } from "./contact-actions";
import type { Contact } from "@/types";

interface ContactsSectionProps {
  clientId: string;
  contacts: Contact[];
}

export function ContactsSection({ clientId, contacts }: ContactsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addContact(clientId, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Contact ajouté!");
        setShowForm(false);
      }
    });
  };

  const handleDelete = async (contactId: string) => {
    if (!confirm("Supprimer ce contact?")) return;
    setDeletingId(contactId);
    startTransition(async () => {
      const result = await deleteContact(clientId, contactId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Contact supprimé.");
      }
      setDeletingId(null);
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Contacts principaux ({contacts.length})
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
                <Label htmlFor="contact-prenom" className="text-xs">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact-prenom"
                  name="prenom"
                  placeholder="Jean-Pierre"
                  required
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-nom" className="text-xs">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact-nom"
                  name="nom"
                  placeholder="Tremblay"
                  required
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-fonction" className="text-xs">Fonction</Label>
                <Input
                  id="contact-fonction"
                  name="fonction"
                  placeholder="Directeur général"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-courriel" className="text-xs">Courriel</Label>
                <Input
                  id="contact-courriel"
                  name="courriel"
                  type="email"
                  placeholder="jp@entreprise.ca"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-telephone" className="text-xs">Téléphone</Label>
                <Input
                  id="contact-telephone"
                  name="telephone"
                  type="tel"
                  placeholder="450-555-1234"
                  className="h-9 text-sm"
                />
              </div>
              <div className="flex items-end gap-4 pb-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" name="est_principal" defaultChecked className="rounded" />
                  <Star className="w-3 h-3 text-amber-500" />
                  Principal
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" name="est_mandataire" className="rounded" />
                  <Shield className="w-3 h-3 text-blue-500" />
                  Mandataire
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={isPending} className="gap-1.5">
                {isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                Ajouter le contact
              </Button>
            </div>
          </form>
        )}

        {/* Contact list */}
        {contacts.length > 0 ? (
          contacts.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 group hover:border-primary/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">
                    {c.prenom} {c.nom}
                  </p>
                  {c.est_principal && (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Star className="w-2.5 h-2.5 text-amber-500" />
                      Principal
                    </Badge>
                  )}
                  {c.est_mandataire && (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Shield className="w-2.5 h-2.5 text-blue-500" />
                      Mandataire
                    </Badge>
                  )}
                </div>
                {c.fonction && (
                  <p className="text-xs text-muted-foreground mt-0.5">{c.fonction}</p>
                )}
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  {c.courriel && (
                    <a
                      href={`mailto:${c.courriel}`}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      {c.courriel}
                    </a>
                  )}
                  {c.telephone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {c.telephone}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id}
              >
                {deletingId === c.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            Aucun contact. Ajoutez le contact principal de l&apos;entreprise.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
