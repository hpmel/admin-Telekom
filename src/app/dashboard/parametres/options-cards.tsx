"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Edit2, Trash2, Wifi, Building2, Package,
  GripVertical, ToggleLeft, ToggleRight
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { OptionTypeService, OptionFournisseur, OptionForfait } from "@/types";
import {
  addTypeService, updateTypeService, deleteTypeService,
  addFournisseur, updateFournisseur, deleteFournisseur,
  addForfait, updateForfait, deleteForfait,
} from "./actions";

// ========================================
// Generic editable list card
// ========================================

interface EditableItem {
  id: string;
  actif: boolean;
  [key: string]: any;
}

// ========================================
// 1. Types de Services
// ========================================
export function TypesServicesCard({ initialData }: { initialData: OptionTypeService[] }) {
  const [items, setItems] = useState<OptionTypeService[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<OptionTypeService | null>(null);
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [isPending, startTransition] = useTransition();

  const openNew = () => {
    setEditItem(null);
    setLabel("");
    setEmoji("📦");
    setDialogOpen(true);
  };

  const openEdit = (item: OptionTypeService) => {
    setEditItem(item);
    setLabel(item.label);
    setEmoji(item.emoji);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!label.trim()) return toast.error("Le nom est requis");
    startTransition(async () => {
      try {
        if (editItem) {
          await updateTypeService(editItem.id, { label, emoji });
          setItems(items.map(i => i.id === editItem.id ? { ...i, label, emoji } : i));
          toast.success("Type mis à jour");
        } else {
          await addTypeService({ label, emoji });
          window.location.reload();
          toast.success("Type ajouté");
        }
        setDialogOpen(false);
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer ce type de service ?")) return;
    startTransition(async () => {
      try {
        await deleteTypeService(id);
        setItems(items.filter(i => i.id !== id));
        toast.success("Type supprimé");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const handleToggle = (item: OptionTypeService) => {
    startTransition(async () => {
      try {
        await updateTypeService(item.id, { actif: !item.actif });
        setItems(items.map(i => i.id === item.id ? { ...i, actif: !i.actif } : i));
        toast.success(item.actif ? "Désactivé" : "Activé");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const emojiOptions = ["🌐", "📞", "☎️", "📱", "📺", "💳", "📦", "🔌", "📡", "💻", "🖥️", "🛜"];

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <Wifi className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              Types de Services
            </CardTitle>
            <Button size="sm" onClick={openNew} className="bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Gérez les catégories de services disponibles dans l'inventaire.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all group
                  ${item.actif
                    ? "bg-background/80 border-border/50 hover:border-primary/30 hover:shadow-sm"
                    : "bg-muted/30 border-border/30 opacity-60"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <span className={`font-medium ${!item.actif ? "line-through text-muted-foreground" : ""}`}>
                    {item.label}
                  </span>
                  {!item.actif && <Badge variant="outline" className="text-xs text-muted-foreground">Inactif</Badge>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggle(item)} title={item.actif ? "Désactiver" : "Activer"}>
                    {item.actif ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => openEdit(item)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Wifi className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun type de service.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px] glass border-border/50">
          <DialogHeader>
            <DialogTitle>{editItem ? "Modifier le type" : "Nouveau type de service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du type</Label>
              <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Ex: Internet fibre" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Icône emoji</Label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`text-xl p-2 rounded-lg border-2 transition-all hover:scale-110
                      ${emoji === e ? "border-primary bg-primary/10 shadow-sm" : "border-transparent hover:border-border"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={isPending} className="bg-primary hover:bg-primary/90 text-white">
              {isPending ? "..." : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ========================================
// 2. Fournisseurs
// ========================================
export function FournisseursCard({ initialData }: { initialData: OptionFournisseur[] }) {
  const [items, setItems] = useState<OptionFournisseur[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<OptionFournisseur | null>(null);
  const [nom, setNom] = useState("");
  const [isPending, startTransition] = useTransition();

  const openNew = () => { setEditItem(null); setNom(""); setDialogOpen(true); };
  const openEdit = (item: OptionFournisseur) => { setEditItem(item); setNom(item.nom); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!nom.trim()) return toast.error("Le nom est requis");
    startTransition(async () => {
      try {
        if (editItem) {
          await updateFournisseur(editItem.id, { nom });
          setItems(items.map(i => i.id === editItem.id ? { ...i, nom } : i));
          toast.success("Fournisseur mis à jour");
        } else {
          await addFournisseur({ nom });
          window.location.reload();
          toast.success("Fournisseur ajouté");
        }
        setDialogOpen(false);
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer ce fournisseur ?")) return;
    startTransition(async () => {
      try {
        await deleteFournisseur(id);
        setItems(items.filter(i => i.id !== id));
        toast.success("Fournisseur supprimé");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const handleToggle = (item: OptionFournisseur) => {
    startTransition(async () => {
      try {
        await updateFournisseur(item.id, { actif: !item.actif });
        setItems(items.map(i => i.id === item.id ? { ...i, actif: !i.actif } : i));
        toast.success(item.actif ? "Désactivé" : "Activé");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Fournisseurs
            </CardTitle>
            <Button size="sm" onClick={openNew} className="bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Liste partagée pour « Fournisseur actuel » et « Futur fournisseur ».
          </p>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all group
                  ${item.actif
                    ? "bg-background/80 border-border/50 hover:border-blue-200 hover:shadow-sm"
                    : "bg-muted/30 border-border/30 opacity-60"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-blue-500/60" />
                  <span className={`font-medium ${!item.actif ? "line-through text-muted-foreground" : ""}`}>
                    {item.nom}
                  </span>
                  {!item.actif && <Badge variant="outline" className="text-xs text-muted-foreground">Inactif</Badge>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggle(item)}>
                    {item.actif ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => openEdit(item)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun fournisseur.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px] glass border-border/50">
          <DialogHeader>
            <DialogTitle>{editItem ? "Modifier le fournisseur" : "Nouveau fournisseur"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du fournisseur</Label>
              <Input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: Bell, Vidéotron..." className="bg-background/50" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={isPending} className="bg-primary hover:bg-primary/90 text-white">
              {isPending ? "..." : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ========================================
// 3. Forfaits
// ========================================
export function ForfaitsCard({ initialData, fournisseurs }: { initialData: OptionForfait[]; fournisseurs: OptionFournisseur[] }) {
  const [items, setItems] = useState<OptionForfait[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<OptionForfait | null>(null);
  const [nom, setNom] = useState("");
  const [fournisseurId, setFournisseurId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const openNew = () => { setEditItem(null); setNom(""); setFournisseurId(""); setDialogOpen(true); };
  const openEdit = (item: OptionForfait) => { setEditItem(item); setNom(item.nom); setFournisseurId(item.fournisseur_id ?? ""); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!nom.trim()) return toast.error("Le nom est requis");
    startTransition(async () => {
      try {
        if (editItem) {
          await updateForfait(editItem.id, { nom, fournisseur_id: fournisseurId || null });
          setItems(items.map(i => i.id === editItem.id ? { ...i, nom, fournisseur_id: fournisseurId || null } : i));
          toast.success("Forfait mis à jour");
        } else {
          await addForfait({ nom, fournisseur_id: fournisseurId || null });
          window.location.reload();
          toast.success("Forfait ajouté");
        }
        setDialogOpen(false);
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Supprimer ce forfait ?")) return;
    startTransition(async () => {
      try {
        await deleteForfait(id);
        setItems(items.filter(i => i.id !== id));
        toast.success("Forfait supprimé");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const handleToggle = (item: OptionForfait) => {
    startTransition(async () => {
      try {
        await updateForfait(item.id, { actif: !item.actif });
        setItems(items.map(i => i.id === item.id ? { ...i, actif: !i.actif } : i));
        toast.success(item.actif ? "Désactivé" : "Activé");
      } catch (e: any) {
        toast.error(e.message);
      }
    });
  };

  const getFournisseurNom = (id: string | null) => {
    if (!id) return null;
    return fournisseurs.find(f => f.id === id)?.nom ?? null;
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-lg">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              Forfaits
            </CardTitle>
            <Button size="sm" onClick={openNew} className="bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Forfaits disponibles dans les menus déroulants de l'inventaire. Associez-les optionnellement à un fournisseur.
          </p>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <AnimatePresence>
            {items.map((item, index) => {
              const fName = getFournisseurNom(item.fournisseur_id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all group
                    ${item.actif
                      ? "bg-background/80 border-border/50 hover:border-amber-200 hover:shadow-sm"
                      : "bg-muted/30 border-border/30 opacity-60"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-amber-500/60" />
                    <span className={`font-medium ${!item.actif ? "line-through text-muted-foreground" : ""}`}>
                      {item.nom}
                    </span>
                    {fName && (
                      <Badge variant="outline" className="text-xs bg-blue-50/50 text-blue-600 border-blue-200">
                        {fName}
                      </Badge>
                    )}
                    {!item.actif && <Badge variant="outline" className="text-xs text-muted-foreground">Inactif</Badge>}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggle(item)}>
                      {item.actif ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => openEdit(item)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun forfait.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px] glass border-border/50">
          <DialogHeader>
            <DialogTitle>{editItem ? "Modifier le forfait" : "Nouveau forfait"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom du forfait</Label>
              <Input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: Fibe 500, Helix Gigabit..." className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Fournisseur associé <span className="text-muted-foreground">(optionnel)</span></Label>
              <Select value={fournisseurId} onValueChange={setFournisseurId}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Aucun (tous les fournisseurs)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun (tous les fournisseurs)</SelectItem>
                  {fournisseurs.filter(f => f.actif).map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={isPending} className="bg-primary hover:bg-primary/90 text-white">
              {isPending ? "..." : "Sauvegarder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
