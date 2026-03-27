"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/config/routes.js";

/* ─── Google SVG logo ──────────────────────────────────────────────────── */
function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  );
}

/* ─── Brand logo mark ──────────────────────────────────────────────────── */
function BrandMark({ size = 40 }) {
  const scale = size / 40;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      {/* Gradient line */}
      <defs>
        <linearGradient id="lm-line" x1="4" y1="36" x2="36" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F1F3D"/>
          <stop offset="100%" stopColor="#1DB8A4"/>
        </linearGradient>
      </defs>
      <line x1="4" y1="36" x2="36" y2="4" stroke="url(#lm-line)" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Node 1 — navy */}
      <circle cx="4" cy="36" r="3" fill="#0F1F3D"/>
      {/* Node 2 — teal with ring */}
      <circle cx="20" cy="20" r="5.5" fill="white"/>
      <circle cx="20" cy="20" r="4" fill="#1DB8A4"/>
      {/* Node 3 — gold with ring */}
      <circle cx="36" cy="4" r="7" fill="white"/>
      <circle cx="36" cy="4" r="5.5" fill="#F5A623"/>
    </svg>
  );
}

/* ─── Login form (needs Suspense for useSearchParams) ──────────────────── */
function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") || ROUTES.DASHBOARD;

  const [showEmail, setShowEmail] = useState(false);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [showPw,   setShowPw]   = useState(false);

  async function handleGoogle() {
    setError("");
    setGLoading(true);
    await signIn("google", { callbackUrl });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* ── Error alert ── */}
      {error && (
        <div role="alert" style={{
          background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "0.625rem",
          padding: "0.75rem 1rem", marginBottom: "1.25rem",
          fontSize: "0.875rem", color: "#DC2626", display: "flex", gap: "0.5rem",
        }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          {error}
        </div>
      )}

      {/* ── Primary: Google Sign-In ── */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={gLoading || loading}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
          width: "100%", padding: "0.8125rem 1rem", borderRadius: "0.625rem",
          border: "1.5px solid #e2e8f0",
          background: gLoading ? "#f8fafc" : "#fff",
          cursor: gLoading || loading ? "not-allowed" : "pointer",
          fontSize: "0.9375rem", fontWeight: 600, color: "#0f172a",
          fontFamily: "inherit",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
          transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
          opacity: gLoading || loading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => { if (!gLoading && !loading) { e.currentTarget.style.borderColor = "#1DB8A4"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(29,184,164,0.15)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"; }}
      >
        {gLoading ? (
          <>
            <span style={{
              width: "18px", height: "18px", border: "2px solid #e2e8f0",
              borderTopColor: "#1DB8A4", borderRadius: "50%",
              display: "inline-block", animation: "spin 0.7s linear infinite",
              flexShrink: 0,
            }} />
            Redirecting to Google…
          </>
        ) : (
          <>
            <GoogleLogo />
            Continue with Google
          </>
        )}
      </button>

      {/* ── Recommended badge ── */}
      <p style={{
        textAlign: "center", marginTop: "0.5rem", marginBottom: "1.5rem",
        fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500,
      }}>
        ✓ Recommended — fastest way to sign in
      </p>

      {/* ── Divider ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
        <span style={{ fontSize: "0.75rem", color: "#cbd5e1", fontWeight: 500, whiteSpace: "nowrap" }}>
          or use email
        </span>
        <div style={{ flex: 1, height: "1px", background: "#f1f5f9" }} />
      </div>

      {/* ── Email/password toggle ── */}
      {!showEmail ? (
        <button
          type="button"
          onClick={() => setShowEmail(true)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            width: "100%", padding: "0.6875rem 1rem", borderRadius: "0.625rem",
            border: "1.5px solid #e2e8f0", background: "transparent",
            cursor: "pointer", fontSize: "0.875rem", fontWeight: 500,
            color: "var(--color-brand-gray)", fontFamily: "inherit",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#94a3b8"; e.currentTarget.style.color = "var(--color-brand-navy)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "var(--color-brand-gray)"; }}
        >
          ✉️ Sign in with email and password
        </button>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="email" style={{
              display: "block", fontWeight: 600, fontSize: "0.8125rem",
              color: "var(--color-brand-navy)", marginBottom: "0.375rem",
            }}>
              Email address
            </label>
            <input
              id="email" name="email" type="email"
              className="input-field"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="email"
              autoFocus required
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
              <label htmlFor="password" style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-brand-navy)" }}>
                Password
              </label>
              <Link href={ROUTES.FORGOT_PASSWORD} style={{ fontSize: "0.75rem", color: "var(--color-brand-teal)", textDecoration: "none", fontWeight: 500 }}>
                Forgot?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id="password" name="password"
                type={showPw ? "text" : "password"}
                className="input-field"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete="current-password" required
                style={{ paddingRight: "2.75rem", width: "100%", boxSizing: "border-box" }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: "0.75rem", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", cursor: "pointer", fontSize: "0.875rem",
                  color: "var(--color-brand-gray)", padding: 0, lineHeight: 1,
                }}
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || gLoading}
            style={{
              width: "100%", justifyContent: "center",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          <button
            type="button"
            onClick={() => { setShowEmail(false); setError(""); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "0.8125rem", color: "var(--color-brand-gray)",
              textAlign: "center", padding: 0, fontFamily: "inherit",
            }}
          >
            ← Back to sign-in options
          </button>
        </form>
      )}

      {/* ── Dev test accounts (collapsible) ── */}
      <details style={{ marginTop: "1.5rem" }}>
        <summary style={{
          fontSize: "0.7rem", color: "#94a3b8", cursor: "pointer",
          userSelect: "none", textAlign: "center", listStyle: "none",
          outline: "none",
        }}>
          Dev credentials ↓
        </summary>
        <div style={{
          marginTop: "0.5rem", padding: "0.625rem 0.875rem",
          background: "#f8fafc", borderRadius: "0.5rem",
          border: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#64748b",
          lineHeight: 1.8,
        }}>
          🎓 <code>student@riseiq.ca</code> / <code>student2026</code><br/>
          🔐 <code>admin@riseiq.ca</code> / <code>admin2026</code>
        </div>
      </details>
    </div>
  );
}

/* ─── Page shell ───────────────────────────────────────────────────────── */
export default function LoginPage() {
  return (
    <>
      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#fff",
      }}>

        {/* ── Left panel — brand ── */}
        <div style={{
          background: "linear-gradient(160deg, var(--color-brand-navy) 0%, #1a3260 60%, #0d2a4a 100%)",
          display: "flex", flexDirection: "column",
          padding: "3rem",
          position: "relative", overflow: "hidden",
        }}
        className="hide-mobile"
        >
          {/* Decorative glow */}
          <div style={{
            position: "absolute", top: "-4rem", right: "-4rem",
            width: "20rem", height: "20rem", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(29,184,164,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-6rem", left: "-4rem",
            width: "24rem", height: "24rem", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "auto" }}>
            <BrandMark size={36} />
            <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "#fff", letterSpacing: "-0.01em" }}>
              Rise<span style={{ color: "var(--color-brand-teal)" }}>IQ</span>
            </span>
          </div>

          {/* Hero copy */}
          <div style={{ margin: "auto 0" }}>
            <h2 style={{
              fontSize: "2.25rem", fontWeight: 900, color: "#fff",
              lineHeight: 1.15, margin: "0 0 1.25rem",
              letterSpacing: "-0.02em",
            }}>
              Your IELTS<br/>
              target band<br/>
              <span style={{ color: "var(--color-brand-teal)" }}>is within reach.</span>
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 2rem" }}>
              Structured practice, instant feedback from Synapse Brain, and a clear path to Band 7+.
            </p>

            {/* Feature bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["📖", "Reading, Writing, Listening & Speaking"],
                ["🧠", "Synapse Brain — personalised AI feedback"],
                ["🏆", "Track your band score, day by day"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{
                    width: "2rem", height: "2rem", borderRadius: "0.5rem",
                    background: "rgba(29,184,164,0.15)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", flexShrink: 0,
                  }}>
                    {icon}
                  </span>
                  <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: "3rem" }}>
            Learn. Grow. Rise.
          </p>
        </div>

        {/* ── Right panel — auth form ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "2rem 1.5rem",
          background: "#fafbfc",
          minHeight: "100vh",
        }}>
          {/* Mobile-only logo */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.625rem",
            marginBottom: "2rem",
          }}
          className="show-mobile"
          >
            <BrandMark size={32} />
            <span style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--color-brand-navy)" }}>
              Rise<span style={{ color: "var(--color-brand-teal)" }}>IQ</span>
            </span>
          </div>

          <div style={{ width: "100%", maxWidth: "400px" }}>
            {/* Card */}
            <div style={{
              background: "#fff", borderRadius: "1rem",
              border: "1px solid rgba(0,0,0,0.07)",
              padding: "2rem 2rem 1.75rem",
              boxShadow: "0 4px 24px rgba(15,31,61,0.06)",
            }}>
              {/* Header */}
              <div style={{ marginBottom: "1.75rem" }}>
                <h1 style={{
                  fontSize: "1.375rem", fontWeight: 800,
                  color: "var(--color-brand-navy)", margin: "0 0 0.375rem",
                  letterSpacing: "-0.01em",
                }}>
                  Welcome back
                </h1>
                <p style={{ color: "var(--color-brand-gray)", fontSize: "0.875rem", margin: 0 }}>
                  Sign in to continue your progress
                </p>
              </div>

              <Suspense fallback={
                <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--color-brand-gray)", fontSize: "0.875rem" }}>
                  Loading…
                </div>
              }>
                <LoginForm />
              </Suspense>
            </div>

            {/* Sign-up link */}
            <p style={{
              textAlign: "center", marginTop: "1.5rem",
              fontSize: "0.875rem", color: "var(--color-brand-gray)",
            }}>
              New to RiseIQ?{" "}
              <Link href={ROUTES.SIGNUP} style={{ color: "var(--color-brand-teal)", fontWeight: 600, textDecoration: "none" }}>
                Create a free account →
              </Link>
            </p>

            {/* Terms */}
            <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.7rem", color: "#94a3b8" }}>
              By signing in you agree to our{" "}
              <a href="/terms" style={{ color: "#94a3b8", textDecoration: "underline" }}>Terms</a> and{" "}
              <a href="/privacy" style={{ color: "#94a3b8", textDecoration: "underline" }}>Privacy Policy</a>.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
