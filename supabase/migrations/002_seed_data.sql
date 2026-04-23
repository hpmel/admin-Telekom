-- ========================================
-- Écono Télékom CRM — Seed Data
-- Données de démonstration réalistes (Québec)
-- ========================================

-- Clients
INSERT INTO clients (id, neq, raison_sociale, adresse, ville, province, code_postal, statut, proprietaire_nom, proprietaire_courriel, proprietaire_telephone, code_scian, nb_employes, chiffre_affaires, notes) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', '1143826491', 'Groupe Immobilier Laval Inc.', '1500 Boul. Le Corbusier', 'Laval', 'QC', 'H7S 1Y9', 'client', 'Jean-Pierre Tremblay', 'jp.tremblay@groupelaval.ca', '450-681-1234', '531210', 45, 2500000, 'Client fidèle depuis 2023. 12 lignes mobiles.'),
  ('a1b2c3d4-0002-4000-8000-000000000002', '1178534920', 'Café Montréalais SENC', '3456 Rue Saint-Denis', 'Montréal', 'QC', 'H2X 3L3', 'negociation', 'Sophie Bouchard', 'sophie@cafemtl.com', '514-555-8899', '722511', 12, 480000, 'Intéressée par Vidéotron pour internet.'),
  ('a1b2c3d4-0003-4000-8000-000000000003', '1190234567', 'Transport Québec Express Ltée', '8900 Aut. Transcanadienne', 'Dorval', 'QC', 'H9P 2N4', 'analyse', 'Marc-André Gagnon', 'magagnon@tqe.ca', '514-422-7700', '484110', 85, 5200000, 'Flotte de 40 véhicules, besoin forfaits mobilité.'),
  ('a1b2c3d4-0004-4000-8000-000000000004', '1156789012', 'Clinique Dentaire Rive-Sud', '2100 Boul. Taschereau', 'Longueuil', 'QC', 'J4K 2X3', 'courtage', 'Dr. Isabelle Côté', 'dr.cote@cliniquerivesud.ca', '450-332-4455', '621210', 18, 1200000, 'Contrat en finalisation. 5 lignes IP.'),
  ('a1b2c3d4-0005-4000-8000-000000000005', NULL, 'Constructions Métal Pro', '6789 Rue Industrielle', 'Terrebonne', 'QC', 'J6W 5S8', 'analyse', 'Robert Lévesque', 'rlev@metalpro.ca', '450-964-1100', '238190', 32, 3100000, 'Prospect via recommandation. Factures élevées.');

-- Contacts
INSERT INTO contacts (client_id, prenom, nom, fonction, courriel, telephone, est_principal, est_mandataire) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Jean-Pierre', 'Tremblay', 'Président', 'jp.tremblay@groupelaval.ca', '450-681-1234', true, true),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Marie', 'Tremblay', 'Dir. admin', 'marie@groupelaval.ca', '450-681-1235', false, false),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Sophie', 'Bouchard', 'Propriétaire', 'sophie@cafemtl.com', '514-555-8899', true, true);

-- Services actuels
INSERT INTO services_actuels (client_id, type_service, fournisseur, forfait, nb_lignes, no_contrat, date_facturation, date_fin_engagement, prix_mensuel) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'mobilite', 'Bell', 'Affaires 25 Go', 12, 'BEL-2023-44521', '2025-05-01', '2025-12-15', 840),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'internet', 'Vidéotron', 'Affaires 500 Mbps', 1, 'VID-2024-87612', '2025-05-15', '2026-03-01', 125),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'internet', 'Bell', 'Fibe 100', 1, NULL, '2025-05-05', NULL, 89.95);

-- Factures
INSERT INTO factures (client_id, numero, montant_ht, tps, tvq, montant_ttc, statut, date_echeance, date_paiement, methode_paiement, description) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'ET-2025-001', 1360.80, 68.04, 135.74, 1564.58, 'payee', '2025-02-28', '2025-02-25', 'interac', 'Commission économies — lignes mobiles'),
  ('a1b2c3d4-0001-4000-8000-000000000001', 'ET-2025-002', 231.00, 11.55, 23.04, 265.59, 'envoyee', '2025-05-15', NULL, NULL, 'Services admin — 3h'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'ET-2025-003', 486.00, 24.30, 48.48, 558.78, 'en_retard', '2025-04-01', NULL, NULL, 'Commission économies — téléphonie IP');
