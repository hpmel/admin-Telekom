-- ========================================
-- 004: Options dynamiques pour les services
-- Types de services, Fournisseurs, Forfaits
-- ========================================

-- 1. Table des types de services
CREATE TABLE IF NOT EXISTS options_types_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(100) NOT NULL UNIQUE,
  emoji VARCHAR(10) DEFAULT '📦',
  actif BOOLEAN NOT NULL DEFAULT true,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table des fournisseurs
CREATE TABLE IF NOT EXISTS options_fournisseurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(100) NOT NULL UNIQUE,
  actif BOOLEAN NOT NULL DEFAULT true,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table des forfaits
CREATE TABLE IF NOT EXISTS options_forfaits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL UNIQUE,
  fournisseur_id UUID REFERENCES options_fournisseurs(id) ON DELETE SET NULL,
  actif BOOLEAN NOT NULL DEFAULT true,
  ordre INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_options_types_ordre ON options_types_services(ordre);
CREATE INDEX IF NOT EXISTS idx_options_fournisseurs_ordre ON options_fournisseurs(ordre);
CREATE INDEX IF NOT EXISTS idx_options_forfaits_ordre ON options_forfaits(ordre);
CREATE INDEX IF NOT EXISTS idx_options_forfaits_fournisseur ON options_forfaits(fournisseur_id);

-- RLS
ALTER TABLE options_types_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE options_fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE options_forfaits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated full access options_types_services" ON options_types_services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access options_fournisseurs" ON options_fournisseurs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated full access options_forfaits" ON options_forfaits FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anon access options_types_services" ON options_types_services FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access options_fournisseurs" ON options_fournisseurs FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon access options_forfaits" ON options_forfaits FOR ALL TO anon USING (true) WITH CHECK (true);

-- Changer type_service de ENUM vers TEXT dans services_actuels
ALTER TABLE services_actuels ALTER COLUMN type_service TYPE TEXT;
ALTER TABLE services_telekom ALTER COLUMN type_service TYPE TEXT;

-- Seed: Types de services par défaut
INSERT INTO options_types_services (label, emoji, ordre) VALUES
  ('Internet', '🌐', 1),
  ('Téléphonie IP', '📞', 2),
  ('Téléphonie conventionnelle', '☎️', 3),
  ('Mobilité', '📱', 4),
  ('Télévision', '📺', 5),
  ('Paiement', '💳', 6)
ON CONFLICT (label) DO NOTHING;

-- Seed: Fournisseurs par défaut
INSERT INTO options_fournisseurs (nom, ordre) VALUES
  ('Bell', 1),
  ('Vidéotron', 2),
  ('Rogers', 3),
  ('Telus', 4),
  ('Fizz', 5),
  ('Koodo', 6),
  ('Fido', 7),
  ('Virgin Plus', 8),
  ('Freedom', 9),
  ('Cogeco', 10),
  ('Shaw', 11)
ON CONFLICT (nom) DO NOTHING;

-- Seed: Quelques forfaits populaires
INSERT INTO options_forfaits (nom, ordre) VALUES
  ('Fibe 50', 1),
  ('Fibe 150', 2),
  ('Fibe 500', 3),
  ('Fibe Gigabit', 4),
  ('Helix 120', 5),
  ('Helix 400', 6),
  ('Helix Gigabit', 7),
  ('Ignite 150u', 8),
  ('Ignite 500u', 9),
  ('Forfait Essentiel', 10),
  ('Forfait Affaires', 11),
  ('Forfait PME', 12)
ON CONFLICT (nom) DO NOTHING;
