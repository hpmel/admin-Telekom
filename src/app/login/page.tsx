"use client";

import { redirect } from "next/navigation";

export default function LoginPage() {
  // During development, redirect to dashboard directly
  // TODO: Implement Supabase Auth login form
  redirect("/dashboard");
}
