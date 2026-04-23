"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Mail,
  MapPin,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Client, PipelineStatus } from "@/types";

const statusConfig: Record<PipelineStatus, { label: string; class: string }> = {
  analyse: { label: "Analyse", class: "bg-blue-500/15 text-blue-700 border-blue-200" },
  negociation: { label: "Négociation", class: "bg-amber-500/15 text-amber-700 border-amber-200" },
  courtage: { label: "Courtage", class: "bg-purple-500/15 text-purple-700 border-purple-200" },
  client: { label: "Client", class: "bg-emerald-500/15 text-emerald-700 border-emerald-200" },
};

export function ClientsTable({ initialClients }: { initialClients: Client[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = initialClients.filter((c) => {
    const matchSearch =
      c.raison_sociale.toLowerCase().includes(search.toLowerCase()) ||
      c.proprietaire_nom.toLowerCase().includes(search.toLowerCase()) ||
      (c.neq && c.neq.includes(search));
    const matchStatus = filterStatus === "all" || c.statut === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Clients
          </h1>
          <p className="text-muted-foreground mt-1">
            {initialClients.length} entreprises dans votre portefeuille
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau client
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, NEQ ou propriétaire..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="analyse">Analyse</SelectItem>
                <SelectItem value="negociation">Négociation</SelectItem>
                <SelectItem value="courtage">Courtage</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Entreprise</TableHead>
                <TableHead className="font-semibold">Propriétaire</TableHead>
                <TableHead className="font-semibold">Ville</TableHead>
                <TableHead className="font-semibold">NEQ</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold text-right">Employés</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow
                  key={client.id}
                  className="group hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <TableCell>
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                        {client.raison_sociale.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          {client.raison_sociale}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {client.adresse}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{client.proprietaire_nom}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.proprietaire_courriel}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{client.ville}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {client.neq || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[client.statut].class}>
                      {statusConfig[client.statut].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {client.nb_employes ?? "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/clients/${client.id}`}>
                            <Eye className="w-4 h-4 mr-2" /> Voir la fiche
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="w-4 h-4 mr-2" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
