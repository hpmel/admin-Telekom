"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Shield, TrendingDown, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Courriel ou mot de passe incorrect."
          : authError.message
      );
      setIsLoading(false);
      return;
    }

    // Login successful — redirect to dashboard
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-dark via-brand to-brand-light relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/5 blur-xl" />
        <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-2 tracking-tight">Écono</h1>
            <h1 className="text-5xl font-bold tracking-tight">Télékom</h1>
            <div className="w-16 h-1 bg-white/60 rounded-full mt-6 mb-8" />
            <p className="text-xl text-white/80 leading-relaxed max-w-md">
              Vos télécoms à juste prix!
            </p>
          </div>

          <div className="space-y-6">
            <FeatureItem
              icon={<TrendingDown className="w-5 h-5" />}
              title="Économies garanties"
              desc="27% des économies générées pour vos clients"
            />
            <FeatureItem
              icon={<Phone className="w-5 h-5" />}
              title="Tour de contrôle"
              desc="Centralisez tous vos forfaits et contrats"
            />
            <FeatureItem
              icon={<Shield className="w-5 h-5" />}
              title="Sécurisé"
              desc="Données chiffrées, conforme Loi 25"
            />
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">Écono Télékom</h1>
            <p className="text-muted-foreground mt-1">Vos télécoms à juste prix!</p>
          </div>

          <Card className="border-0 shadow-xl shadow-brand/5">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
              <CardDescription>
                Accédez à votre tableau de bord CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Courriel</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="econotelekom@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    required
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-primary hover:bg-brand-dark transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground text-center mt-6">
                Propulsé par KMD Web • Données protégées (Loi 25)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-white/60 text-sm">{desc}</p>
      </div>
    </div>
  );
}
