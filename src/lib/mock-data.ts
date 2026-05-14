import type { Client, DashboardKPIs, PipelineCounts, Facture, ServiceActuel, Contact } from '@/types';

export const mockClients: Client[] = [
  {
    id: '1', neq: '1143826491', raison_sociale: 'Groupe Immobilier Laval Inc.',
    adresse: '1500 Boul. Le Corbusier', ville: 'Laval', province: 'QC', code_postal: 'H7S 1Y9',
    statut: 'client', proprietaire_nom: 'Jean-Pierre Tremblay',
    proprietaire_courriel: 'jp.tremblay@groupelaval.ca', proprietaire_telephone: '450-681-1234',
    code_scian: '531210', nb_employes: 45, chiffre_affaires: 2500000,
    notes: 'Client fidèle depuis 2023. 12 lignes mobiles.',
    created_at: '2024-06-15T10:00:00Z', updated_at: '2025-03-20T14:30:00Z',
  },
  {
    id: '2', neq: '1178534920', raison_sociale: 'Café Montréalais SENC',
    adresse: '3456 Rue Saint-Denis', ville: 'Montréal', province: 'QC', code_postal: 'H2X 3L3',
    statut: 'negociation', proprietaire_nom: 'Sophie Bouchard',
    proprietaire_courriel: 'sophie@cafemtl.com', proprietaire_telephone: '514-555-8899',
    code_scian: '722511', nb_employes: 12, chiffre_affaires: 480000,
    notes: 'Intéressée par Vidéotron pour internet.',
    created_at: '2025-01-10T09:00:00Z', updated_at: '2025-04-01T11:00:00Z',
  },
  {
    id: '3', neq: '1190234567', raison_sociale: 'Transport Québec Express Ltée',
    adresse: '8900 Aut. Transcanadienne', ville: 'Dorval', province: 'QC', code_postal: 'H9P 2N4',
    statut: 'analyse', proprietaire_nom: 'Marc-André Gagnon',
    proprietaire_courriel: 'magagnon@tqe.ca', proprietaire_telephone: '514-422-7700',
    code_scian: '484110', nb_employes: 85, chiffre_affaires: 5200000,
    notes: 'Flotte de 40 véhicules, besoin forfaits mobilité.',
    created_at: '2025-03-01T08:00:00Z', updated_at: '2025-04-15T16:00:00Z',
  },
  {
    id: '4', neq: '1156789012', raison_sociale: 'Clinique Dentaire Rive-Sud',
    adresse: '2100 Boul. Taschereau', ville: 'Longueuil', province: 'QC', code_postal: 'J4K 2X3',
    statut: 'courtage', proprietaire_nom: 'Dr. Isabelle Côté',
    proprietaire_courriel: 'dr.cote@cliniquerivesud.ca', proprietaire_telephone: '450-332-4455',
    code_scian: '621210', nb_employes: 18, chiffre_affaires: 1200000,
    notes: 'Contrat en finalisation. 5 lignes IP.',
    created_at: '2025-02-15T10:30:00Z', updated_at: '2025-04-10T09:00:00Z',
  },
  {
    id: '5', neq: null, raison_sociale: 'Constructions Métal Pro',
    adresse: '6789 Rue Industrielle', ville: 'Terrebonne', province: 'QC', code_postal: 'J6W 5S8',
    statut: 'analyse', proprietaire_nom: 'Robert Lévesque',
    proprietaire_courriel: 'rlev@metalpro.ca', proprietaire_telephone: '450-964-1100',
    code_scian: '238190', nb_employes: 32, chiffre_affaires: 3100000,
    notes: 'Prospect via recommandation. Factures élevées.',
    created_at: '2025-04-05T14:00:00Z', updated_at: '2025-04-20T10:00:00Z',
  },
];

export const mockContacts: Contact[] = [
  { id: 'c1', client_id: '1', prenom: 'Jean-Pierre', nom: 'Tremblay', fonction: 'Président', courriel: 'jp.tremblay@groupelaval.ca', telephone: '450-681-1234', est_principal: true, est_mandataire: true },
  { id: 'c2', client_id: '1', prenom: 'Marie', nom: 'Tremblay', fonction: 'Dir. admin', courriel: 'marie@groupelaval.ca', telephone: '450-681-1235', est_principal: false, est_mandataire: false },
  { id: 'c3', client_id: '2', prenom: 'Sophie', nom: 'Bouchard', fonction: 'Propriétaire', courriel: 'sophie@cafemtl.com', telephone: '514-555-8899', est_principal: true, est_mandataire: true },
];

export const mockServicesActuels: ServiceActuel[] = [
  { id: 's1', client_id: '1', type_service: 'mobilite', fournisseur: 'Bell', forfait: 'Affaires 25 Go', nb_lignes: 12, no_contrat: 'BEL-2023-44521', date_facturation: '2025-05-01', date_fin_engagement: '2025-12-15', prix_mensuel: 840, futur_fournisseur: null, date_activation: null, economie: null },
  { id: 's2', client_id: '1', type_service: 'internet', fournisseur: 'Vidéotron', forfait: 'Affaires 500 Mbps', nb_lignes: 1, no_contrat: 'VID-2024-87612', date_facturation: '2025-05-15', date_fin_engagement: '2026-03-01', prix_mensuel: 125, futur_fournisseur: null, date_activation: null, economie: null },
  { id: 's3', client_id: '2', type_service: 'internet', fournisseur: 'Bell', forfait: 'Fibe 100', nb_lignes: 1, no_contrat: null, date_facturation: '2025-05-05', date_fin_engagement: null, prix_mensuel: 89.95, futur_fournisseur: null, date_activation: null, economie: null },
];

export const mockFactures: Facture[] = [
  { id: 'f1', client_id: '1', numero: 'ET-2025-001', montant_ht: 1360.80, tps: 68.04, tvq: 135.74, montant_ttc: 1564.58, statut: 'payee', date_echeance: '2025-02-28', date_paiement: '2025-02-25', methode_paiement: 'interac', description: 'Commission économies — lignes mobiles', created_at: '2025-02-01T10:00:00Z' },
  { id: 'f2', client_id: '1', numero: 'ET-2025-002', montant_ht: 231, tps: 11.55, tvq: 23.04, montant_ttc: 265.59, statut: 'envoyee', date_echeance: '2025-05-15', date_paiement: null, methode_paiement: null, description: 'Services admin — 3h', created_at: '2025-04-15T10:00:00Z' },
  { id: 'f3', client_id: '4', numero: 'ET-2025-003', montant_ht: 486.00, tps: 24.30, tvq: 48.48, montant_ttc: 558.78, statut: 'en_retard', date_echeance: '2025-04-01', date_paiement: null, methode_paiement: null, description: 'Commission économies — téléphonie IP', created_at: '2025-03-01T10:00:00Z' },
];

export const mockKPIs: DashboardKPIs = {
  total_clients: 5, clients_actifs: 2, economies_generees: 48750,
  revenus_mois: 2389.95, revenus_total: 18450, taux_conversion: 40,
  factures_en_attente: 2, contrats_a_renouveler: 1, soumissions_expirantes: 0,
};

export const mockPipelineCounts: PipelineCounts = { analyse: 2, negociation: 1, courtage: 1, client: 1 };

export interface ActivityItem {
  id: string;
  type: 'client_added' | 'status_changed' | 'invoice_sent' | 'document_signed' | 'payment_received';
  description: string;
  timestamp: string;
  client_name: string;
}

export const mockActivity: ActivityItem[] = [
  { id: 'a1', type: 'client_added', description: 'Nouveau prospect ajouté', timestamp: '2025-04-20T10:00:00Z', client_name: 'Constructions Métal Pro' },
  { id: 'a2', type: 'status_changed', description: 'Statut : Analyse → Négociation', timestamp: '2025-04-18T14:30:00Z', client_name: 'Café Montréalais SENC' },
  { id: 'a3', type: 'invoice_sent', description: 'Facture ET-2025-002 envoyée', timestamp: '2025-04-15T10:00:00Z', client_name: 'Groupe Immobilier Laval Inc.' },
  { id: 'a4', type: 'payment_received', description: 'Paiement reçu — 1 564,58 $', timestamp: '2025-02-25T16:45:00Z', client_name: 'Groupe Immobilier Laval Inc.' },
  { id: 'a5', type: 'document_signed', description: 'Entente de services signée', timestamp: '2025-02-15T11:00:00Z', client_name: 'Clinique Dentaire Rive-Sud' },
];
