"use client";

import { useState } from "react";
import { formatCAD } from "@/lib/facturation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Search, Wifi, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addService, updateService, deleteService } from "./actions";
import { toast } from "sonner";
import { ServiceActuel, Client, OptionTypeService, OptionFournisseur, OptionForfait } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export function InventaireTable({
  initialServices,
  clients,
  optionsTypes,
  optionsFournisseurs,
  optionsForfaits
}: {
  initialServices: ServiceActuel[];
  clients: Client[];
  optionsTypes: OptionTypeService[];
  optionsFournisseurs: OptionFournisseur[];
  optionsForfaits: OptionForfait[];
}) {
  const [services, setServices] = useState<ServiceActuel[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceActuel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ServiceActuel>>({
    client_id: "",
    type_service: optionsTypes[0]?.label || "Internet",
    fournisseur: "",
    forfait: "",
    nb_lignes: 1,
    prix_mensuel: 0,
    date_fin_engagement: "",
    futur_fournisseur: "",
    date_activation: "",
    economie: 0,
  });

  const getTypeDisplay = (typeLabel: string) => {
    const option = optionsTypes.find(t => t.label === typeLabel);
    return option ? `${option.emoji} ${option.label}` : typeLabel;
  };

  const filteredServices = services.filter((s) => {
    const client = clients.find(c => c.id === s.client_id);
    const searchStr = `${client?.raison_sociale} ${s.fournisseur} ${s.forfait} ${s.type_service}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const handleOpenDialog = (service?: ServiceActuel) => {
    if (service) {
      setEditingService(service);
      setFormData({
        client_id: service.client_id,
        type_service: service.type_service,
        fournisseur: service.fournisseur,
        forfait: service.forfait || "",
        nb_lignes: service.nb_lignes,
        prix_mensuel: service.prix_mensuel,
        date_fin_engagement: service.date_fin_engagement || "",
        futur_fournisseur: service.futur_fournisseur || "",
        date_activation: service.date_activation || "",
        economie: service.economie || 0,
      });
    } else {
      setEditingService(null);
      setFormData({
        client_id: clients[0]?.id || "",
        type_service: optionsTypes[0]?.label || "Internet",
        fournisseur: "",
        forfait: "",
        nb_lignes: 1,
        prix_mensuel: 0,
        date_fin_engagement: "",
        futur_fournisseur: "",
        date_activation: "",
        economie: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Clean empty dates to null
    const dataToSave = {
      ...formData,
      date_fin_engagement: formData.date_fin_engagement || null,
      date_activation: formData.date_activation || null,
    };

    try {
      if (editingService) {
        await updateService(editingService.id, dataToSave);
        setServices(services.map(s => s.id === editingService.id ? { ...s, ...dataToSave } as ServiceActuel : s));
        toast.success("Service mis à jour avec succès");
      } else {
        await addService(dataToSave);
        window.location.reload(); 
        toast.success("Nouveau service ajouté");
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Erreur: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return;
    try {
      await deleteService(id);
      setServices(services.filter(s => s.id !== id));
      toast.success("Service supprimé");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Les forfaits peuvent être filtrés par le fournisseur actuel si nécessaire, mais on liste tous les forfaits pour la simplicité,
  // ou on propose une liste filtrée basée sur formData.fournisseur
  const getFilteredForfaits = () => {
    const currentFournisseurId = optionsFournisseurs.find(f => f.nom === formData.fournisseur)?.id;
    if (!currentFournisseurId) return optionsForfaits.filter(f => f.actif);
    return optionsForfaits.filter(f => f.actif && (!f.fournisseur_id || f.fournisseur_id === currentFournisseurId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par client, fournisseur, forfait..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/50 border-border/50 focus:bg-background"
          />
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un service
        </Button>
      </div>

      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="font-semibold py-4">Client</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Fournisseur</TableHead>
              <TableHead className="font-semibold">Forfait</TableHead>
              <TableHead className="font-semibold text-center">Lignes</TableHead>
              <TableHead className="font-semibold text-right">Prix</TableHead>
              <TableHead className="font-semibold">Fin engagement</TableHead>
              <TableHead className="font-semibold">Futur fournisseur</TableHead>
              <TableHead className="font-semibold">Activation</TableHead>
              <TableHead className="font-semibold text-right text-emerald-600">Économie</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredServices.map((s) => {
                const client = clients.find((c) => c.id === s.client_id);
                return (
                  <motion.tr 
                    key={s.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-muted/30 group"
                  >
                    <TableCell className="font-medium py-3">
                      {client?.raison_sociale ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{getTypeDisplay(s.type_service)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-background shadow-sm">{s.fournisseur}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{s.forfait || "—"}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-muted font-mono">{s.nb_lignes}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCAD(s.prix_mensuel)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.date_fin_engagement
                        ? new Date(s.date_fin_engagement).toLocaleDateString("fr-CA")
                        : <span className="text-muted-foreground/60 italic">Sans contrat</span>}
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.futur_fournisseur ? <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50">{s.futur_fournisseur}</Badge> : "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.date_activation
                        ? new Date(s.date_activation).toLocaleDateString("fr-CA")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">
                      {s.economie ? formatCAD(s.economie) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" onClick={() => handleOpenDialog(s)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-16 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Wifi className="w-8 h-8 text-muted-foreground/40" />
                    <p>Aucun service trouvé.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] border-border/50 shadow-2xl glass">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingService ? "Modifier le service" : "Nouveau service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Colonne 1: Infos de base */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={formData.client_id} onValueChange={(val) => setFormData({...formData, client_id: val})}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.raison_sociale}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Type de service</Label>
                  <Select value={formData.type_service as string} onValueChange={(val) => setFormData({...formData, type_service: val})}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {optionsTypes.filter(t => t.actif).map((type) => (
                        <SelectItem key={type.id} value={type.label}>{type.emoji} {type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fournisseur Actuel</Label>
                  <Select value={formData.fournisseur} onValueChange={(val) => setFormData({...formData, fournisseur: val})}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Choisir un fournisseur..." />
                    </SelectTrigger>
                    <SelectContent>
                      {optionsFournisseurs.filter(f => f.actif).map((f) => (
                        <SelectItem key={f.id} value={f.nom}>{f.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Forfait (nom/vitesse)</Label>
                    <Select value={formData.forfait} onValueChange={(val) => setFormData({...formData, forfait: val})}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Choisir..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun / Autre</SelectItem>
                        {getFilteredForfaits().map((f) => (
                          <SelectItem key={f.id} value={f.nom}>{f.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nb Lignes</Label>
                    <Input 
                      type="number" 
                      min="1"
                      value={formData.nb_lignes} 
                      onChange={e => setFormData({...formData, nb_lignes: parseInt(e.target.value) || 1})} 
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prix / Mois ($)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={formData.prix_mensuel} 
                      onChange={e => setFormData({...formData, prix_mensuel: parseFloat(e.target.value) || 0})} 
                      className="bg-background/50 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fin engagement</Label>
                    <Input 
                      type="date" 
                      value={formData.date_fin_engagement} 
                      onChange={e => setFormData({...formData, date_fin_engagement: e.target.value})} 
                      className="bg-background/50 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Colonne 2: Opportunité & Future */}
              <div className="space-y-4 bg-primary/5 p-5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Migration & Économie</h3>
                </div>

                <div className="space-y-2">
                  <Label>Futur Fournisseur</Label>
                  <Select value={formData.futur_fournisseur} onValueChange={(val) => setFormData({...formData, futur_fournisseur: val})}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Choisir un fournisseur..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun (à déterminer)</SelectItem>
                      {optionsFournisseurs.filter(f => f.actif).map((f) => (
                        <SelectItem key={f.id} value={f.nom}>{f.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date d'activation (prévue/réelle)</Label>
                  <Input 
                    type="date" 
                    value={formData.date_activation} 
                    onChange={e => setFormData({...formData, date_activation: e.target.value})} 
                    className="bg-background text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Économie générée ($ / mois)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={formData.economie} 
                    onChange={e => setFormData({...formData, economie: parseFloat(e.target.value) || 0})} 
                    className="bg-background font-bold text-emerald-600"
                    placeholder="0.00"
                  />
                </div>
              </div>

            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
                {isLoading ? "Enregistrement..." : "Sauvegarder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
