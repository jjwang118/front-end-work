import { NavLink, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@repo/ui";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/posts", label: "Posts" },
  { to: "/comments", label: "Comments" },
  { to: "/media", label: "Media" },
];

export function AdminLayout() {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4">
        <h1 className="mb-8 text-xl font-bold">Blog Admin</h1>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <Button variant="ghost" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
