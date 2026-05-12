import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Contact, FilePenLine, LayoutDashboard, LogOut, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const sidebarItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Contacts", to: "/contacts", icon: Contact },
  { label: "Templates", to: "/templates", icon: FilePenLine },
];

export function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100/70">
      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-1 lg:grid-cols-[250px_1fr]">
        <aside className="border-r bg-white">
          <div className="flex h-16 items-center gap-2 border-b px-4">
            <div className="rounded-lg bg-slate-900 p-1.5 text-white">
              <Mail className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Email Campaign Platform</p>
              <p className="text-xs text-muted-foreground">{user?.email || "Authenticated session"}</p>
            </div>
          </div>

          <nav className="space-y-1 p-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive ? "bg-slate-900 text-white" : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="size-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </aside>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
