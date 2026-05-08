// ========================================
// Écono Télékom CRM — Server-Side Supabase Queries
// For use in Server Components (SSR / RSC)
// ========================================

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type {
  Client,
  Contact,
  Employe,
  ServiceActuel,
  Facture,
  DashboardKPIs,
  PipelineCounts,
  OptionTypeService,
  OptionFournisseur,
  OptionForfait,
} from '@/types';

// ---- CLIENTS ----

export async function getClients(): Promise<Client[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getClients error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getClientById error:', error.message);
    return null;
  }
  return data;
}

// ---- CONTACTS ----

export async function getContactsByClient(clientId: string): Promise<Contact[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('client_id', clientId)
    .order('est_principal', { ascending: false });

  if (error) {
    console.error('getContactsByClient error:', error.message);
    return [];
  }
  return data ?? [];
}

// ---- EMPLOYÉS ----

export async function getEmployesByClient(clientId: string): Promise<Employe[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('employes')
    .select('*')
    .eq('client_id', clientId)
    .order('nom');

  if (error) {
    console.error('getEmployesByClient error:', error.message);
    return [];
  }
  return data ?? [];
}

// ---- SERVICES ACTUELS ----

export async function getAllServices(): Promise<ServiceActuel[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('services_actuels')
    .select('*')
    .order('client_id');

  if (error) {
    console.error('getAllServices error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getServicesByClient(clientId: string): Promise<ServiceActuel[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('services_actuels')
    .select('*')
    .eq('client_id', clientId);

  if (error) {
    console.error('getServicesByClient error:', error.message);
    return [];
  }
  return data ?? [];
}

// ---- FACTURES ----

export async function getFactures(): Promise<Facture[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('factures')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getFactures error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getFacturesByClient(clientId: string): Promise<Facture[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('factures')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getFacturesByClient error:', error.message);
    return [];
  }
  return data ?? [];
}

// ---- DOCUMENTS ----

export async function getDocuments(): Promise<(Document & { clients: { raison_sociale: string } })[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*, clients(raison_sociale)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getDocuments error:', error.message);
    return [];
  }
  return (data as any) ?? [];
}

export async function getDocumentsByClient(clientId: string): Promise<Document[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getDocumentsByClient error:', error.message);
    return [];
  }
  return data ?? [];
}

// ---- DASHBOARD KPIs ----

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const supabase = await createServerSupabaseClient();

  const [clientsRes, facturesRes, servicesRes] = await Promise.all([
    supabase.from('clients').select('statut'),
    supabase.from('factures').select('montant_ttc, statut'),
    supabase.from('services_actuels').select('date_fin_engagement'),
  ]);

  const allClients = clientsRes.data ?? [];
  const allFactures = facturesRes.data ?? [];
  const allServices = servicesRes.data ?? [];

  const clientsActifs = allClients.filter((c) => c.statut === 'client').length;
  const facturesPayees = allFactures.filter((f) => f.statut === 'payee');
  const facturesEnAttente = allFactures.filter(
    (f) => f.statut === 'envoyee' || f.statut === 'en_retard'
  );

  const revenus_total = facturesPayees.reduce((sum, f) => sum + Number(f.montant_ttc), 0);

  // Contrats qui finissent dans les 60 prochains jours
  const now = new Date();
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const contratsARenouveler = allServices.filter((s) => {
    if (!s.date_fin_engagement) return false;
    const fin = new Date(s.date_fin_engagement);
    return fin >= now && fin <= in60Days;
  }).length;

  return {
    total_clients: allClients.length,
    clients_actifs: clientsActifs,
    economies_generees: revenus_total * 3.7, // approximation based on 27% commission
    revenus_mois: revenus_total,
    revenus_total,
    taux_conversion:
      allClients.length > 0
        ? Math.round((clientsActifs / allClients.length) * 100)
        : 0,
    factures_en_attente: facturesEnAttente.length,
    contrats_a_renouveler: contratsARenouveler,
    soumissions_expirantes: 0, // TODO: query documents
  };
}

export async function getPipelineCounts(): Promise<PipelineCounts> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('clients').select('statut');
  const clients = data ?? [];

  return {
    analyse: clients.filter((c) => c.statut === 'analyse').length,
    negociation: clients.filter((c) => c.statut === 'negociation').length,
    courtage: clients.filter((c) => c.statut === 'courtage').length,
    client: clients.filter((c) => c.statut === 'client').length,
  };
}

// ---- OPTIONS DYNAMIQUES (Paramètres) ----

export async function getTypesServices(): Promise<OptionTypeService[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('options_types_services')
    .select('*')
    .order('ordre');
  if (error) {
    console.error('getTypesServices error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getFournisseurs(): Promise<OptionFournisseur[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('options_fournisseurs')
    .select('*')
    .order('ordre');
  if (error) {
    console.error('getFournisseurs error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getForfaits(): Promise<OptionForfait[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('options_forfaits')
    .select('*')
    .order('ordre');
  if (error) {
    console.error('getForfaits error:', error.message);
    return [];
  }
  return data ?? [];
}

