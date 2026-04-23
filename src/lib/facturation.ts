// ========================================
// Écono Télékom — Billing Calculation Engine
// Business rules:
//   - 27% of savings generated (calculated over 24 months for no-contract products)
//   - Fixed rate of $77/hour for administrative work
// Tax rates (Québec):
//   - TPS (GST): 5%
//   - TVQ (QST): 9.975%
// ========================================

const TAUX_COMMISSION = 0.27; // 27%
const DUREE_SANS_CONTRAT_MOIS = 24;
const TAUX_HORAIRE = 77; // $/h
const TAUX_TPS = 0.05;
const TAUX_TVQ = 0.09975;

export interface CalculEconomies {
  ancien_prix_mensuel: number;
  nouveau_prix_mensuel: number;
  duree_contrat_mois: number | null; // null = sans contrat → 24 mois
}

export interface ResultatFacturation {
  economies_mensuelles: number;
  economies_totales: number;
  duree_mois: number;
  honoraires_ht: number;
  tps: number;
  tvq: number;
  total_ttc: number;
}

/**
 * Calculate commission based on savings generated
 */
export function calculerCommissionEconomies(
  data: CalculEconomies
): ResultatFacturation {
  const duree = data.duree_contrat_mois ?? DUREE_SANS_CONTRAT_MOIS;
  const economies_mensuelles = data.ancien_prix_mensuel - data.nouveau_prix_mensuel;
  const economies_totales = economies_mensuelles * duree;
  const honoraires_ht = economies_totales * TAUX_COMMISSION;
  const tps = honoraires_ht * TAUX_TPS;
  const tvq = honoraires_ht * TAUX_TVQ;
  const total_ttc = honoraires_ht + tps + tvq;

  return {
    economies_mensuelles: round2(economies_mensuelles),
    economies_totales: round2(economies_totales),
    duree_mois: duree,
    honoraires_ht: round2(honoraires_ht),
    tps: round2(tps),
    tvq: round2(tvq),
    total_ttc: round2(total_ttc),
  };
}

/**
 * Calculate hourly billing for administrative work
 */
export function calculerFacturationHoraire(heures: number): ResultatFacturation {
  const honoraires_ht = heures * TAUX_HORAIRE;
  const tps = honoraires_ht * TAUX_TPS;
  const tvq = honoraires_ht * TAUX_TVQ;
  const total_ttc = honoraires_ht + tps + tvq;

  return {
    economies_mensuelles: 0,
    economies_totales: 0,
    duree_mois: 0,
    honoraires_ht: round2(honoraires_ht),
    tps: round2(tps),
    tvq: round2(tvq),
    total_ttc: round2(total_ttc),
  };
}

/**
 * Format a number as CAD currency
 */
export function formatCAD(amount: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(amount);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
