-- Création du bucket 'documents'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques de sécurité pour le bucket 'documents'
-- (Permettre à tous de lire pour l'instant, et aux utilisateurs authentifiés d'ajouter)

CREATE POLICY "Lecture publique des documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'documents');

CREATE POLICY "Ajout de documents par utilisateurs authentifiés" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'documents');

-- Permettre la suppression par les utilisateurs authentifiés
CREATE POLICY "Suppression de documents par utilisateurs authentifiés" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'documents');

-- Permettre la mise à jour par les utilisateurs authentifiés
CREATE POLICY "Mise à jour de documents par utilisateurs authentifiés" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'documents');
