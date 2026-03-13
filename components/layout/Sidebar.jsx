"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Brain, FileText, BarChart2, User,
  Zap, LogOut, Library, Award,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/config/routes.js";
import { COURSE_REGISTRY_LIST, isEnrolledIn } from "@/config/courseRegistry.js";

/**
 * Universal primary nav — course-agnostic.
 * Reading/Writing/Listening/Speaking are removed from the primary nav.
 * They are accessible via the IELTS Dashboard section and Learning Hub.
 */
const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD,      label: "Dashboard",      Icon: LayoutDashboard },
  { href: ROUTES.SYNAPSE,        label: "Synapse",        Icon: Brain            },
  { href: ROUTES.MOCK_TEST,      label: "Mock Test",      Icon: FileText         },
  { href: ROUTES.PROGRESS,       label: "Progress",       Icon: BarChart2        },
  { href: ROUTES.CERTIFICATIONS, label: "Certifications", Icon: Award            },
  { href: ROUTES.PROFILE,        label: "Profile",        Icon: User             },
];

export function Sidebar({ enrolledCourses = [] }) {
  const pathname = usePathname();
  const isInLearning = pathname.startsWith("/learning");

  // Courses the user is actively enrolled in (for sub-links)
  const enrolledMeta = COURSE_REGISTRY_LIST.filter((c) =>
    isEnrolledIn(enrolledCourses, c.key)
  );

  return (
    <aside
      aria-label="App navigation"
      style={{
        display: "flex", flexDirection: "column", width: "15rem",
        background: "#fff", borderRight: "1px solid rgba(0,0,0,0.07)",
        minHeight: "100vh", position: "sticky", top: 0,
      }}
      className="hide-mobile">

      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center", gap: "0.625rem",
        padding: "1.25rem", borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div style={{
          width: "2rem", height: "2rem", borderRadius: "0.5rem",
          background: "var(--color-brand-teal)", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Zap size={16} color="#fff" aria-hidden="true" />
        </div>
        <div>
          <span style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--color-brand-navy)", lineHeight: 1 }}>
            Rise<span style={{ color: "var(--color-brand-teal)" }}>IQ</span>
          </span>
          <p style={{ fontSize: "0.6rem", color: "var(--color-brand-gray)", margin: 0, lineHeight: 1.3 }}>
            Learn. Grow. Rise.
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav aria-label="Main navigation" style={{
        flex: 1, padding: "0.75rem 0.5rem",
        display: "flex", flexDirection: "column", gap: "0.125rem",
        overflowY: "auto",
      }}>
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== ROUTES.DASHBOARD && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                fontSize: "0.875rem", fontWeight: isActive ? 600 : 500,
                textDecoration: "none", transition: "background 0.15s, color 0.15s",
                background: isActive ? "var(--color-brand-teal-pale, #e8f8f5)" : "transparent",
                color: isActive ? "var(--color-brand-teal)" : "var(--color-brand-gray)",
              }}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </Link>
          );
        })}

        {/* ── Learning Hub section ─────────────────────────────── */}
        <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          {/* Top-level Learning Hub link */}
          <Link
            href={ROUTES.LEARNING}
            aria-current={pathname === ROUTES.LEARNING ? "page" : undefined}
            style={{
              display: "flex", alignItems: "center", gap: "0.625rem",
              padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
              fontSize: "0.875rem", fontWeight: isInLearning ? 600 : 500,
              textDecoration: "none", transition: "background 0.15s, color 0.15s",
              background: isInLearning ? "var(--color-brand-teal-pale, #e8f8f5)" : "transparent",
              color: isInLearning ? "var(--color-brand-teal)" : "var(--color-brand-gray)",
            }}>
            <Library size={16} aria-hidden="true" />
            Learning Hub
          </Link>

          {/* Enrolled course sub-links — visible when inside /learning */}
          {isInLearning && enrolledMeta.length > 0 && (
            <div style={{ paddingLeft: "0.75rem", marginTop: "0.125rem", display: "flex", flexDirection: "column", gap: "0.125rem" }}>
              {enrolledMeta.map(({ key, label, icon }) => {
                const href = ROUTES.LEARNING_COURSE(key);
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.375rem 0.625rem", borderRadius: "0.5rem",
                      fontSize: "0.8125rem", fontWeight: isActive ? 600 : 400,
                      textDecoration: "none", transition: "background 0.15s, color 0.15s",
                      background: isActive ? "var(--color-brand-teal-pale, #e8f8f5)" : "transparent",
                      color: isActive ? "var(--color-brand-teal)" : "var(--color-brand-gray)",
                    }}>
                    <span style={{ fontSize: "0.75rem" }}>{icon}</span>
                    {label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer info */}
      <div style={{ padding: "0.75rem 0.5rem", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        {/* Synapse Brain badge */}
        <div style={{
          padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
          background: "var(--color-brand-navy)", marginBottom: "0.375rem",
          display: "flex", alignItems: "center", gap: "0.375rem",
        }}>
          <span style={{ fontSize: "0.8rem" }}>🧠</span>
          <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>
            Powered by{" "}
            <span style={{ color: "var(--color-brand-teal)", fontWeight: 600 }}>Synapse Brain</span>
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            display: "flex", alignItems: "center", gap: "0.625rem", width: "100%",
            padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "none",
            background: "transparent", cursor: "pointer", fontSize: "0.875rem",
            color: "#ef4444", fontWeight: 500, fontFamily: "inherit",
          }}>
          <LogOut size={16} aria-hidden="true" /> Log Out
        </button>
      </div>
    </aside>
  );
}
