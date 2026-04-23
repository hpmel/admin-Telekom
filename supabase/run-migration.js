// ========================================
// Run Supabase migration — execute schema SQL
// Usage: node supabase/run-migration.js
// ========================================

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl = "https://vuvwgypfepxfufaivihb.supabase.co";
const supabaseKey = "sb_publishable_xNnUIWU6Wf4aTqL2_ay4pA_t8ePFw3K";

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  // Read the SQL file
  const schemaPath = path.join(__dirname, "migrations", "001_initial_schema.sql");
  const seedPath = path.join(__dirname, "migrations", "002_seed_data.sql");

  console.log("🔄 Running schema migration...");

  const schemaSQL = fs.readFileSync(schemaPath, "utf8");

  // Execute via RPC (requires a helper function in Supabase, or use direct REST)
  // Since we can't run raw SQL via the JS client alone,
  // we'll use the Supabase Management API or provide instructions
  
  console.log("");
  console.log("⚠️  Le client JS Supabase ne peut pas exécuter du DDL SQL directement.");
  console.log("");
  console.log("📋 INSTRUCTIONS pour exécuter la migration:");
  console.log("   1. Allez sur: https://supabase.com/dashboard/project/vuvwgypfepxfufaivihb/sql/new");
  console.log("   2. Copiez le contenu du fichier: supabase/migrations/001_initial_schema.sql");
  console.log("   3. Collez-le dans le SQL Editor et cliquez 'Run'");
  console.log("   4. Puis copiez: supabase/migrations/002_seed_data.sql");
  console.log("   5. Collez-le et cliquez 'Run' pour insérer les données de démonstration");
  console.log("");
  console.log("🔗 Ou copiez tout le SQL d'un coup (il est affiché ci-dessous):");
  console.log("=".repeat(60));
  console.log(schemaSQL);
  console.log("=".repeat(60));
  
  // Test connection
  console.log("");
  console.log("🔗 Test de connexion Supabase...");
  try {
    const { error } = await supabase.from("clients").select("id").limit(1);
    if (error && error.code === "PGRST205") {
      console.log("✅ Connexion OK — les tables n'existent pas encore (attendu avant migration)");
    } else if (error) {
      console.log("❌ Erreur:", error.message);
    } else {
      console.log("✅ Connexion OK — les tables existent déjà!");
    }
  } catch (e) {
    console.log("❌ Erreur de connexion:", e.message);
  }
}

runMigration();
