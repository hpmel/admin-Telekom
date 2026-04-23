// ========================================
// Écono Télékom CRM — Supabase Data Access Layer
// Replaces mock-data with real Supabase queries
// ========================================

import { createClient } from '@/lib/supabase/client';
import type {
  Client,
  Contact,
  ServiceActuel,
  Facture,
  DashboardKPIs,
  PipelineCounts,
  PipelineStatus,
} from '@/types';

const supabase = createClient();

// ---- CLIENTS ----

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClientRecord(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClientRecord(id: string, updates: Partial<Client>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClientRecord(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ---- CONTACTS ----

export async function getContactsByClient(clientId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('client_id', clientId)
    .order('est_principal', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ---- SERVICES ACTUELS ----

export async function getServicesByClient(clientId: string): Promise<ServiceActuel[]> {
  const { data, error } = await supabase
    .from('services_actuels')
    .select('*')
    .eq('client_id', clientId);

  if (error) throw error;
  return data ?? [];
}

export async function getAllServices(): Promise<ServiceActuel[]> {
  const { data, error } = await supabase
    .from('services_actuels')
    .select('*')
    .order('client_id');

  if (error) throw error;
  return data ?? [];
}

// ---- FACTURES ----

export async function getFactures(): Promise<Facture[]> {
  const { data, error } = await supabase
    .from('factures')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getFacturesByClient(clientId: string): Promise<Facture[]> {
  const { data, error } = await supabase
    .from('factures')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ---- DASHBOARD KPIs ----

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const { data: clients } = await supabase.from('clients').select('statut');
  const { data: factures } = await supabase.from('factures').select('montant_ttc, statut');

  const allClients = clients ?? [];
  const allFactures = factures ?? [];

  const clientsActifs = allClients.filter((c) => c.statut === 'client').length;
  const facturesPayees = allFactures.filter((f) => f.statut === 'payee');
  const facturesEnAttente = allFactures.filter((f) => f.statut === 'envoyee' || f.statut === 'en_retard');

  const revenus_total = facturesPayees.reduce((sum, f) => sum + Number(f.montant_ttc), 0);

  return {
    total_clients: allClients.length,
    clients_actifs: clientsActifs,
    economies_generees: revenus_total * 3.7, // approximate based on 27% commission
    revenus_mois: facturesPayees.length > 0
      ? revenus_total / Math.max(facturesPayees.length, 1)
      : 0,
    revenus_total,
    taux_conversion: allClients.length > 0
      ? Math.round((clientsActifs / allClients.length) * 100)
      : 0,
    factures_en_attente: facturesEnAttente.length,
    contrats_a_renouveler: 0, // TODO: query services_actuels where date_fin_engagement is near
    soumissions_expirantes: 0, // TODO: query documents where date_expiration is near
  };
}

export async function getPipelineCounts(): Promise<PipelineCounts> {
  const { data } = await supabase.from('clients').select('statut');
  const clients = data ?? [];

  return {
    analyse: clients.filter((c) => c.statut === 'analyse').length,
    negociation: clients.filter((c) => c.statut === 'negociation').length,
    courtage: clients.filter((c) => c.statut === 'courtage').length,
    client: clients.filter((c) => c.statut === 'client').length,
  };
}
