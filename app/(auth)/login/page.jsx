"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/config/routes.js";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") || ROUTES.DASHBOARD;

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [showPw,   setShowPw]   = useState(false);

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

  async function handleGoogle() {
    setGLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <>
      {error && (
        <div role="alert" style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"0.5rem",
          padding:"0.75rem 1rem", marginBottom:"1rem", fontSize:"0.875rem", color:"#DC2626" }}>
          {error}
        </div>
      )}

      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={gLoading || loading}
        style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:"0.625rem",
          width:"100%", padding:"0.6875rem 1rem", borderRadius:"0.5rem",
          border:"1.5px solid #e2e8f0", background:"#fff", cursor:"pointer",
          fontSize:"0.9375rem", fontWeight:600, color:"#1e293b",
          fontFamily:"inherit", marginBottom:"1.25rem",
          opacity: gLoading ? 0.7 : 1,
          transition:"border-color 0.15s, box-shadow 0.15s",
        }}
      >
        {/* Google G logo */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        {gLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      {/* Divider */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"1.25rem" }}>
        <div style={{ flex:1, height:"1px", background:"#e2e8f0" }} />
        <span style={{ fontSize:"0.75rem", color:"#94a3b8", fontWeight:500 }}>or sign in with email</span>
        <div style={{ flex:1, height:"1px", background:"#e2e8f0" }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <div>
          <label htmlFor="email" style={{ display:"block", fontWeight:600, fontSize:"0.875rem",
            color:"var(--color-brand-navy)", marginBottom:"0.375rem" }}>Email</label>
          <input id="email" name="email" type="email" className="input-field"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" autoComplete="email" required />
        </div>

        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.375rem" }}>
            <label htmlFor="password" style={{ fontWeight:600, fontSize:"0.875rem", color:"var(--color-brand-navy)" }}>
              Password
            </label>
            <Link href={ROUTES.FORGOT_PASSWORD}
              style={{ fontSize:"0.75rem", color:"var(--color-brand-teal)", textDecoration:"none" }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ position:"relative" }}>
            <input id="password" name="password" type={showPw ? "text" : "password"} className="input-field"
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password" required
              style={{ paddingRight:"2.5rem", width:"100%", boxSizing:"border-box" }} />
            <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"}
              style={{ position:"absolute", right:"0.75rem", top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", fontSize:"0.9rem",
                color:"var(--color-brand-gray)", padding:0 }}>
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || gLoading}
          style={{ width:"100%", justifyContent:"center", marginTop:"0.5rem",
            opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>
      </form>

      {/* Test accounts hint */}
      <div style={{ marginTop:"1.25rem", padding:"0.75rem", background:"#f8fafc", borderRadius:"0.5rem",
        border:"1px solid #e2e8f0", fontSize:"0.75rem", color:"#64748b" }}>
        <strong style={{ color:"#334155" }}>Test accounts:</strong><br />
        🎓 Student: <code>student@riseiq.ca</code> / <code>student2026</code><br />
        🔐 Admin: <code>admin@riseiq.ca</code> / <code>admin2026</code>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(180deg, var(--color-brand-teal-pale) 0%, #fff 100%)", padding:"1.5rem" }}>
      <div className="card" style={{ width:"100%", maxWidth:"420px", padding:"2.5rem" }}>
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <p style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>⚡</p>
          <h1 style={{ fontSize:"1.5rem", fontWeight:800, color:"var(--color-brand-navy)" }}>
            Welcome back
          </h1>
          <p style={{ color:"var(--color-brand-gray)", fontSize:"0.875rem", marginTop:"0.25rem" }}>
            Sign in to your RiseIQ account
          </p>
        </div>

        <Suspense fallback={<div style={{ textAlign:"center", color:"var(--color-brand-gray)" }}>Loading…</div>}>
          <LoginForm />
        </Suspense>

        <p style={{ textAlign:"center", marginTop:"1.5rem", fontSize:"0.875rem", color:"var(--color-brand-gray)" }}>
          New here?{" "}
          <Link href={ROUTES.SIGNUP} style={{ color:"var(--color-brand-teal)", fontWeight:600, textDecoration:"none" }}>
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  );
}
