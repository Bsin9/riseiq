"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Brain, BarChart2, User, Library } from "lucide-react";
import { ROUTES } from "@/config/routes.js";

const ITEMS = [
  { href: ROUTES.DASHBOARD, label: "Home",     Icon: LayoutDashboard },
  { href: ROUTES.SYNAPSE,   label: "Synapse",  Icon: Brain           },
  { href: ROUTES.LEARNING,  label: "Courses",  Icon: Library         },
  { href: ROUTES.PROGRESS,  label: "Progress", Icon: BarChart2       },
  { href: ROUTES.PROFILE,   label: "Profile",  Icon: User            },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="show-mobile"
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
        background: "#fff", borderTop: "1px solid rgba(0,0,0,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0)",
      }}>
      <div style={{ display: "flex", justifyContent: "space-around", padding: "0.5rem 0.5rem 0.25rem" }}>
        {ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== ROUTES.DASHBOARD && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "0.125rem", padding: "0.375rem 0.75rem", borderRadius: "0.5rem",
                textDecoration: "none", transition: "color 0.15s",
                color: isActive ? "var(--color-brand-teal)" : "var(--color-brand-gray)",
              }}>
              <Icon size={20} aria-hidden="true" />
              <span style={{ fontSize: "0.625rem", fontWeight: 500 }}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
