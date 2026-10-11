import type { PropsWithChildren } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOutAdmin } from "../../lib/firebase";

const ENTITIES: Array<{ to: string; label: string }> = [
  { to: "/admin/tournaments", label: "Turneringer" },
  { to: "/admin/players", label: "Spillere" },
  { to: "/admin/results", label: "Resultater" },
  { to: "/admin/side-prizes", label: "Sidepriser" },
  { to: "/admin/photos", label: "Bilder" },
  { to: "/admin/highlights", label: "Historier" },
  { to: "/admin/courses", label: "Baner" },
];

export function AdminLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOutAdmin();
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-near-black">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-4">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Augusta Admin
        </p>
        <nav className="space-y-1">
          {ENTITIES.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${isActive ? "bg-green-deep text-cream" : "hover:bg-gray-100"}`
              }
            >
              {e.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleSignOut}
          className="mt-6 w-full rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
        >
          Logg ut
        </button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
