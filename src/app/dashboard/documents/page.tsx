import { FileText, Download, Trash2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDocuments, getClients } from "@/lib/supabase/queries";
import { DocumentUploadDialog } from "./document-upload-dialog";
import { DocumentActions } from "./document-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const typeLabels: Record<string, string> = {
  entente: "Entente",
  mandat: "Mandat d'autorisation",
  soumission: "Soumission",
  facture_pdf: "Facture PDF",
  autre: "Autre",
};

const statutSignature: Record<string, { label: string; class: string }> = {
  en_attente: { label: "En attente", class: "bg-amber-500/15 text-amber-700 border-amber-200" },
  signe: { label: "Signé", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200" },
  expire: { label: "Expiré", class: "bg-red-500/15 text-red-700 border-red-200" },
};

export default async function DocumentsPage() {
  const [documents, clients] = await Promise.all([
    getDocuments(),
    getClients(),
  ]);

  // Clients mapping for the upload dialog
  const clientOptions = clients.map(c => ({ id: c.id, raison_sociale: c.raison_sociale }));

  const supabase = await createServerSupabaseClient();
  
  // We need a helper to generate signed URLs for download if the bucket is not public, 
  // but it is public. Even for public buckets, getPublicUrl is handy.
  const getFileUrl = (path: string | null) => {
    if (!path) return null;
    const { data } = supabase.storage.from('documents').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestion documentaire — contrats, ententes et soumissions
          </p>
        </div>
        <DocumentUploadDialog clients={clientOptions} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tous les documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du fichier</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead>Signature</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      {doc.nom}
                    </TableCell>
                    <TableCell>{doc.clients?.raison_sociale}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {typeLabels[doc.type] || doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString("fr-CA")}
                    </TableCell>
                    <TableCell>
                      {doc.type === "entente" || doc.type === "mandat" ? (
                        <Badge variant="outline" className={statutSignature[doc.statut_signature]?.class}>
                          {statutSignature[doc.statut_signature]?.label || doc.statut_signature}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {doc.url_stockage && (
                          <Button variant="ghost" size="icon" asChild title="Télécharger">
                            <a href={getFileUrl(doc.url_stockage) || '#'} target="_blank" rel="noreferrer" download>
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <DocumentActions documentId={doc.id} urlStockage={doc.url_stockage} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                Aucun document
              </h3>
              <p className="text-sm text-muted-foreground/70 mt-1 max-w-md mx-auto">
                Commencez par ajouter un document ou une entente pour un client.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
