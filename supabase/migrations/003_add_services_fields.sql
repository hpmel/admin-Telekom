-- Add new fields to services_actuels for the enhanced Inventaire page

ALTER TABLE services_actuels
ADD COLUMN IF NOT EXISTS futur_fournisseur TEXT,
ADD COLUMN IF NOT EXISTS date_activation DATE,
ADD COLUMN IF NOT EXISTS economie DECIMAL(10,2);
