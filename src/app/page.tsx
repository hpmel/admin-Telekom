"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Shield, TrendingDown, AlertCircle, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

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

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/30">
      {/* Left panel — Branding & Animations */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-zinc-950">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-emerald-500/20 blur-[100px]" 
          />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-20 text-white w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
              <Zap className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs font-medium tracking-wide uppercase">CRM Nouvelle Génération</span>
            </div>
            <h1 className="text-6xl font-bold mb-2 tracking-tighter">Écono</h1>
            <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Télékom</h1>
            <p className="text-2xl text-zinc-400 font-light mt-6 max-w-md leading-snug">
              Vos télécoms à juste prix. <br/>Gérées intelligemment.
            </p>
          </motion.div>

          <div className="space-y-6">
            <FeatureItem
              icon={<TrendingDown className="w-5 h-5 text-primary" />}
              title="Économies garanties"
              desc="27% d'économies moyennes générées pour vos clients"
              delay={0.2}
            />
            <FeatureItem
              icon={<Phone className="w-5 h-5 text-primary" />}
              title="Tour de contrôle unifiée"
              desc="Centralisez tous les forfaits, contrats et factures"
              delay={0.4}
            />
            <FeatureItem
              icon={<Shield className="w-5 h-5 text-primary" />}
              title="Sécurité & Conformité"
              desc="Données chiffrées de bout en bout, conforme Loi 25 (QC)"
              delay={0.6}
            />
          </div>
        </div>
      </div>

      {/* Right panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        {/* Mobile background glows */}
        <div className="absolute top-0 right-0 w-full h-full lg:hidden overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-[80px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Écono Télékom</h1>
            <p className="text-muted-foreground mt-2">Accès au portail sécurisé</p>
          </div>

          <div className="bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/5 rounded-3xl p-8">
            <div className="text-center pb-8 hidden lg:block">
              <h2 className="text-2xl font-bold tracking-tight">Bon retour 👋</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Connectez-vous pour accéder à votre tableau de bord
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-foreground/80 font-medium">Courriel professionnel</Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="econotelekom@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground/80 font-medium">Mot de passe</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-background/50 border-border/50 transition-all duration-300 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                  minLength={6}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 mt-4 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all duration-300 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authentification...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Se connecter
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-8 font-medium">
            Propulsé par KMD Web • Sécurisé & Conforme Loi 25
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="flex items-start gap-5 group"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
        {icon}
      </div>
      <div className="pt-1">
        <h3 className="font-semibold text-base text-zinc-100">{title}</h3>
        <p className="text-zinc-400 text-sm mt-1 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
