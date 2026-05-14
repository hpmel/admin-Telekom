"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Loader2 } from "lucide-react";
import { createDocumentAction } from "./actions";
import { toast } from "sonner";

interface ClientOption {
  id: string;
  raison_sociale: string;
}

interface DocumentUploadDialogProps {
  clientId?: string;
  clients?: ClientOption[];
}

export function DocumentUploadDialog({ clientId, clients }: DocumentUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("autre");
  const [nom, setNom] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>(clientId || "");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!nom) {
        setNom(selectedFile.name);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }
    if (!selectedClient) {
      toast.error("Veuillez sélectionner un client.");
      return;
    }
    if (!nom) {
      toast.error("Veuillez entrer un nom pour le document.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${selectedClient}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Erreur de téléversement: ${uploadError.message}`);
      }

      // 2. Save record in database
      const result = await createDocumentAction({
        client_id: selectedClient,
        type,
        nom,
        url_stockage: filePath,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Document ajouté avec succès");
      setOpen(false);
      
      // Reset form
      setFile(null);
      setNom("");
      setType("autre");
      if (!clientId) setSelectedClient("");
      
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Une erreur est survenue");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Ajouter un document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Téléverser un document</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!clientId && clients && (
            <div className="grid gap-2">
              <Label>Client</Label>
              <Select value={selectedClient} onValueChange={(value) => setSelectedClient(value || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.raison_sociale}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Type de document</Label>
            <Select value={type} onValueChange={(value) => setType(value || "autre")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entente">Entente</SelectItem>
                <SelectItem value="mandat">Mandat d'autorisation</SelectItem>
                <SelectItem value="soumission">Soumission</SelectItem>
                <SelectItem value="facture_pdf">Facture (PDF)</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Nom du document</Label>
            <Input 
              value={nom} 
              onChange={(e) => setNom(e.target.value)} 
              placeholder="Ex: Contrat Internet 2024"
            />
          </div>

          <div className="grid gap-2">
            <Label>Fichier</Label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors">
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FileText className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Cliquez pour sélectionner un fichier"}
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, DOCX, PNG ou JPG (Max 10MB)
                </span>
              </Label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Téléversement...
              </>
            ) : (
              "Ajouter"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
