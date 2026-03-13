"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Star, Shield, ScrollText, Settings, LogOut, Zap } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin",             label: "Overview",         Icon: LayoutDashboard },
  { href: "/admin/students",    label: "All Students",     Icon: Users           },
  { href: "/admin/advanced",    label: "Advanced Cohort",  Icon: Star            },
  { href: "/admin/permissions", label: "Permissions",      Icon: Shield          },
  { href: "/admin/audit",       label: "Audit Log",        Icon: ScrollText      },
  { href: "/admin/settings",    label: "Settings",         Icon: Settings        },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "15rem", background: "#0f172a", minHeight: "100vh",
      display: "flex", flexDirection: "column", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.625rem",
        padding: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          width: "2rem", height: "2rem", borderRadius: "0.5rem",
          background: "#6366f1", display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0,
        }}>
          <Zap size={16} color="#fff" />
        </div>
        <div>
          <span style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#fff", lineHeight: 1 }}>
            Rise<span style={{ color: "#818cf8" }}>IQ</span>
          </span>
          <p style={{ fontSize: "0.625rem", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.3 }}>
            Admin Portal
          </p>
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: "0.75rem 1rem" }}>
        <span style={{
          display: "inline-block", padding: "0.25rem 0.625rem",
          background: "#6366f120", color: "#a5b4fc",
          borderRadius: "9999px", fontSize: "0.6875rem", fontWeight: 600,
        }}>
          🔐 Administrator
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.25rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                fontSize: "0.875rem", fontWeight: isActive ? 600 : 400,
                textDecoration: "none", transition: "background 0.15s",
                background: isActive ? "#6366f120" : "transparent",
                color: isActive ? "#a5b4fc" : "rgba(255,255,255,0.55)",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Student view link */}
      <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/dashboard" style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
          fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)",
          textDecoration: "none", marginBottom: "0.25rem",
        }}>
          ↗ View as Student
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            display: "flex", alignItems: "center", gap: "0.625rem", width: "100%",
            padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "none",
            background: "transparent", cursor: "pointer", fontSize: "0.875rem",
            color: "#f87171", fontWeight: 500, fontFamily: "inherit",
          }}
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
}
