import { getClients } from "@/lib/supabase/queries";
import { ClientsTable } from "./clients-table";

export default async function ClientsPage() {
  const clients = await getClients();

  return <ClientsTable initialClients={clients} />;
}
