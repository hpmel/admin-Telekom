"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Columns3,
  Wifi,
  FileText,
  Receipt,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/pipeline", icon: Columns3, label: "Pipeline" },
  { href: "/dashboard/inventaire", icon: Wifi, label: "Inventaire Télécom" },
  { href: "/dashboard/documents", icon: FileText, label: "Documents" },
  { href: "/dashboard/facturation", icon: Receipt, label: "Facturation" },
  { href: "/dashboard/communications", icon: Mail, label: "Communications" },
];

const bottomItems = [
  { href: "/dashboard/parametres", icon: Settings, label: "Paramètres" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-sidebar-foreground truncate">
                Écono Télékom
              </h2>
              <p className="text-[0.65rem] text-muted-foreground truncate">
                Tour de contrôle CRM
              </p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Tooltip key={item.href} delayDuration={collapsed ? 0 : 9999}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "text-sidebar-primary" : ""
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary animate-pulse-green" />
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-2 space-y-1">
          <Separator className="mb-2" />
          {bottomItems.map((item) => (
            <Tooltip key={item.href} delayDuration={collapsed ? 0 : 9999}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          ))}

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Déconnexion</span>}
          </Link>

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center mt-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
