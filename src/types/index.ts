// ========================================
// Écono Télékom CRM — Type Definitions
// ========================================

// Pipeline statuses
export type PipelineStatus = 'analyse' | 'negociation' | 'courtage' | 'client';

// Service types
export type TypeService =
  | 'internet'
  | 'telephonie_ip'
  | 'telephonie_conv'
  | 'mobilite'
  | 'tv'
  | 'paiement';

// Telecom providers
export type Fournisseur =
  | 'Bell'
  | 'Vidéotron'
  | 'Rogers'
  | 'Telus'
  | 'Fizz'
  | 'Koodo'
  | 'Fido'
  | 'Virgin Plus'
  | 'Freedom'
  | 'Autre';

// Invoice statuses
export type StatutFacture = 'brouillon' | 'envoyee' | 'payee' | 'en_retard';

// Document types
export type TypeDocument = 'entente' | 'mandat' | 'soumission' | 'facture_pdf' | 'autre';

// Signature statuses
export type StatutSignature = 'en_attente' | 'signe' | 'expire';

// Communication statuses
export type StatutCommunication = 'brouillon' | 'envoye' | 'lu' | 'erreur';

// Payment methods
export type MethodePaiement = 'stripe' | 'interac' | 'virement' | 'cheque' | 'autre';

// ---- Entities ----

export interface Client {
  id: string;
  neq: string | null;
  raison_sociale: string;
  adresse: string;
  ville: string;
  province: string;
  code_postal: string;
  statut: PipelineStatus;
  proprietaire_nom: string;
  proprietaire_courriel: string | null;
  proprietaire_telephone: string | null;
  code_scian: string | null;
  nb_employes: number | null;
  chiffre_affaires: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  client_id: string;
  prenom: string;
  nom: string;
  fonction: string | null;
  courriel: string;
  telephone: string | null;
  est_principal: boolean;
  est_mandataire: boolean;
}

export interface Employe {
  id: string;
  client_id: string;
  prenom: string;
  nom: string;
  fonction: string | null;
  courriel: string | null;
  telephone: string | null;
  carte_sim: string | null;
}

export interface ServiceActuel {
  id: string;
  client_id: string;
  type_service: TypeService;
  fournisseur: string;
  forfait: string | null;
  nb_lignes: number;
  no_contrat: string | null;
  date_facturation: string | null;
  date_fin_engagement: string | null;
  prix_mensuel: number;
}

export interface ServiceTelekom {
  id: string;
  client_id: string;
  type_service: TypeService;
  fournisseur: string;
  description: string | null;
  prix: number;
  date_activation: string | null;
  no_contrat: string | null;
}

export interface Facture {
  id: string;
  client_id: string;
  numero: string;
  montant_ht: number;
  tps: number;
  tvq: number;
  montant_ttc: number;
  statut: StatutFacture;
  date_echeance: string;
  date_paiement: string | null;
  methode_paiement: MethodePaiement | null;
  description: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  type: TypeDocument;
  nom: string;
  url_stockage: string | null;
  statut_signature: StatutSignature;
  date_expiration: string | null;
  created_at: string;
}

export interface Communication {
  id: string;
  client_id: string;
  sujet: string;
  contenu: string;
  template_id: string | null;
  date_envoi: string | null;
  statut: StatutCommunication;
}

// ---- Dashboard KPIs ----

export interface DashboardKPIs {
  total_clients: number;
  clients_actifs: number;
  economies_generees: number;
  revenus_mois: number;
  revenus_total: number;
  taux_conversion: number;
  factures_en_attente: number;
  contrats_a_renouveler: number;
  soumissions_expirantes: number;
}

// ---- Pipeline counts ----

export interface PipelineCounts {
  analyse: number;
  negociation: number;
  courtage: number;
  client: number;
}

// ---- Form types ----

export type ClientFormData = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type ContactFormData = Omit<Contact, 'id'>;
