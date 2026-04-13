import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@repo/database";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "authorized" | "unauthorized">("loading");

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setState("unauthorized");
        return;
      }
      const admin = await isAdmin(supabase, user.id);
      setState(admin ? "authorized" : "unauthorized");
    }
    check();
  }, []);

  if (state === "loading") return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (state === "unauthorized") return <Navigate to="/login" replace />;
  return <>{children}</>;
}
