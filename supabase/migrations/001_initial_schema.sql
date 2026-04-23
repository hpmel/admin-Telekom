-- ========================================
-- Écono Télékom CRM — Database Schema
-- Supabase (PostgreSQL)
-- ========================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- ENUM Types
-- ========================================
CREATE TYPE pipeline_status AS ENUM ('analyse', 'negociation', 'courtage', 'client');
CREATE TYPE type_service AS ENUM ('internet', 'telephonie_ip', 'telephonie_conv', 'mobilite', 'tv', 'paiement');
CREATE TYPE statut_facture AS ENUM ('brouillon', 'envoyee', 'payee', 'en_retard');
CREATE TYPE type_document AS ENUM ('entente', 'mandat', 'soumission', 'facture_pdf', 'autre');
CREATE TYPE statut_signature AS ENUM ('en_attente', 'signe', 'expire');
CREATE TYPE statut_communication AS ENUM ('brouillon', 'envoye', 'lu', 'erreur');
CREATE TYPE methode_paiement AS ENUM ('stripe', 'interac', 'virement', 'cheque', 'autre');

-- ========================================
-- 1. CLIENTS
-- ========================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  neq VARCHAR(20) UNIQUE,
  raison_sociale VARCHAR(255) NOT NULL,
  adresse TEXT,
  ville VARCHAR(100),
  province VARCHAR(2) DEFAULT 'QC',
  code_postal VARCHAR(7),
  statut pipeline_status NOT NULL DEFAULT 'analyse',
  proprietaire_nom VARCHAR(255) NOT NULL,
  proprietaire_courriel VARCHAR(255),
  proprietaire_telephone VARCHAR(20),
  code_scian VARCHAR(10),
  nb_employes INTEGER,
  chiffre_affaires NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 2. CONTACTS
-- ========================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  fonction VARCHAR(150),
  courriel VARCHAR(255) NOT NULL,
  telephone VARCHAR(20),
  est_principal BOOLEAN NOT NULL DEFAULT false,
  est_mandataire BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 3. EMPLOYÉS
-- ========================================
CREATE TABLE employes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  prenom VARCHAR(100) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  fonction VARCHAR(150),
  courriel VARCHAR(255),
  telephone VARCHAR(20),
  carte_sim VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 4. SERVICES ACTUELS (forfaits existants du client)
-- ========================================
CREATE TABLE services_actuels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type_service type_service NOT NULL,
  fournisseur VARCHAR(100) NOT NULL,
  forfait VARCHAR(255),
  nb_lignes INTEGER NOT NULL DEFAULT 1,
  no_contrat VARCHAR(100),
  date_facturation DATE,
  date_fin_engagement DATE,
  prix_mensuel NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 5. SERVICES TÉLÉKOM (nouveaux forfaits négociés)
-- ========================================
CREATE TABLE services_telekom (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type_service type_service NOT NULL,
  fournisseur VARCHAR(100) NOT NULL,
  description TEXT,
  prix NUMERIC(10,2) NOT NULL,
  date_activation DATE,
  no_contrat VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 6. FACTURES
-- ========================================
CREATE TABLE factures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  numero VARCHAR(20) NOT NULL UNIQUE,
  montant_ht NUMERIC(10,2) NOT NULL,
  tps NUMERIC(10,2) NOT NULL,
  tvq NUMERIC(10,2) NOT NULL,
  montant_ttc NUMERIC(10,2) NOT NULL,
  statut statut_facture NOT NULL DEFAULT 'brouillon',
  date_echeance DATE NOT NULL,
  date_paiement DATE,
  methode_paiement methode_paiement,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 7. DOCUMENTS
-- ========================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type type_document NOT NULL,
  nom VARCHAR(255) NOT NULL,
  url_stockage TEXT,
  statut_signature statut_signature NOT NULL DEFAULT 'en_attente',
  date_expiration DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 8. COMMUNICATIONS (courriels)
-- ========================================
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sujet VARCHAR(255) NOT NULL,
  contenu TEXT NOT NULL,
  template_id VARCHAR(100),
  date_envoi TIMESTAMPTZ,
  statut statut_communication NOT NULL DEFAULT 'brouillon',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_clients_statut ON clients(statut);
CREATE INDEX idx_clients_neq ON clients(neq);
CREATE INDEX idx_contacts_client ON contacts(client_id);
CREATE INDEX idx_employes_client ON employes(client_id);
CREATE INDEX idx_services_actuels_client ON services_actuels(client_id);
CREATE INDEX idx_services_telekom_client ON services_telekom(client_id);
CREATE INDEX idx_factures_client ON factures(client_id);
CREATE INDEX idx_factures_statut ON factures(statut);
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_communications_client ON communications(client_id);

-- ========================================
-- AUTO-UPDATE updated_at TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- Enable when Supabase Auth is configured
-- ========================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE employes ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_actuels ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_telekom ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Temporary policy: allow all for authenticated users
-- (Will be replaced with role-based policies)
CREATE POLICY "Authenticated users have full access to clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to contacts"
  ON contacts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to employes"
  ON employes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to services_actuels"
  ON services_actuels FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to services_telekom"
  ON services_telekom FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to factures"
  ON factures FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to documents"
  ON documents FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to communications"
  ON communications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anon key access during development
CREATE POLICY "Anon access for development" ON clients FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access for development" ON contacts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access for development" ON employes FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access for development" ON services_actuels FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access for development" ON services_telekom FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access for development" ON factures FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access for development" ON documents FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access for development" ON communications FOR ALL TO anon USING (true) WITH CHECK (true);
