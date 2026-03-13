/**
 * Synapse — AI Study Assistant
 *
 * Design spec implemented here:
 * - Per-user context awareness (enrollment, progress, billing, certificates)
 * - Conversation history panel (180-day retention, search/filter)
 * - Privacy affordances: what Synapse remembers, how to clear, what isn't stored
 * - History retention: items older than 180 days are not shown (auto-expired by design)
 *
 * Phase 1: UI skeleton + privacy spec implemented.
 * Phase 2: wire up real LLM (OpenAI / Azure OpenAI) via /api/synapse/chat.
 */

export const metadata = {
  title: "Synapse — RiseIQ AI Study Assistant",
  description: "Your AI-powered, course-aware study assistant with 180-day conversation history.",
};

// Mock history — in production this comes from /api/synapse/history?days=180
const HISTORY = [
  { id:"h1", date:"2026-03-12", preview:"How do I improve my IELTS Writing Task 2 score?", tag:"Writing" },
  { id:"h2", date:"2026-03-10", preview:"What's the difference between Band 6.5 and 7?",   tag:"IELTS"   },
  { id:"h3", date:"2026-03-08", preview:"Give me a study plan for the next 60 days",        tag:"Planning" },
];

const PRIVACY_ITEMS = [
  { icon:"✅", label:"Remembers",    text:"Your enrolled courses, progress milestones, and recent session activity" },
  { icon:"✅", label:"Remembers",    text:"Conversation history for up to 180 days — then automatically deleted" },
  { icon:"❌", label:"Does NOT store", text:"Your passwords, payment details, or personal documents" },
  { icon:"❌", label:"Does NOT store", text:"Conversations after 180 days — they are permanently expired, not archived" },
];

export default function SynapsePage() {
  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 800, color: "var(--color-brand-navy)", margin: 0 }}>
          🧠 Synapse
        </h1>
        <p style={{ color: "var(--color-brand-gray)", marginTop: "0.25rem", fontSize: "0.9375rem" }}>
          Your AI study assistant — course-aware, context-rich, privacy-first.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── Main chat area ─────────────────────────────────────────── */}
        <div>
          {/* Coming-soon banner */}
          <div className="card" style={{
            padding: "2.5rem 2rem", textAlign: "center", marginBottom: "1.5rem",
            background: "linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)",
            border: "1px solid #a5b4fc",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧠</div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-brand-navy)", marginBottom: "0.5rem" }}>
              Synapse is coming in Phase 2
            </h2>
            <p style={{ color: "var(--color-brand-gray)", maxWidth: "480px", margin: "0 auto 1.5rem", lineHeight: 1.6, fontSize: "0.9375rem" }}>
              Synapse will answer questions about your IELTS prep, SQL progress, billing, and certificates —
              all with context from your profile. History is retained for 180 days, then auto-deleted.
            </p>

            {/* Suggested prompts */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
              {[
                "How many days until my exam?",
                "What's my weakest IELTS skill?",
                "Give me a 7-day study plan",
                "Explain IELTS Writing Task 2",
              ].map((p) => (
                <button key={p} disabled style={{
                  padding: "0.4375rem 0.875rem", borderRadius: "9999px",
                  border: "1.5px solid #c7d2fe", background: "#fff",
                  fontSize: "0.8125rem", color: "#4338ca", fontWeight: 500,
                  cursor: "not-allowed", opacity: 0.6, fontFamily: "inherit",
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chat input (disabled) */}
          <div style={{
            display: "flex", gap: "0.75rem", alignItems: "center",
            padding: "0.875rem 1rem", background: "#fff", borderRadius: "0.75rem",
            border: "1.5px solid #e2e8f0", opacity: 0.5,
          }}>
            <input
              disabled
              placeholder="Ask Synapse anything about your courses, progress, or plan…"
              style={{
                flex: 1, border: "none", outline: "none", fontSize: "0.9375rem",
                color: "var(--color-brand-navy)", background: "transparent", fontFamily: "inherit",
              }}
            />
            <button disabled style={{
              padding: "0.5rem 1rem", borderRadius: "0.5rem",
              background: "var(--color-brand-teal)", color: "#fff",
              border: "none", fontWeight: 600, fontSize: "0.875rem",
              cursor: "not-allowed", fontFamily: "inherit",
            }}>
              Send
            </button>
          </div>
        </div>

        {/* ── Right panel: History + Privacy ────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Conversation history */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-brand-navy)", margin: 0 }}>
                History
              </h3>
              <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 500 }}>
                Last 180 days
              </span>
            </div>

            {/* Search */}
            <input
              disabled
              placeholder="Search history…"
              style={{
                width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
                border: "1px solid #e2e8f0", fontSize: "0.8125rem",
                color: "var(--color-brand-navy)", fontFamily: "inherit",
                boxSizing: "border-box", marginBottom: "0.75rem", opacity: 0.6,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {HISTORY.map((h) => (
                <div key={h.id} style={{
                  padding: "0.625rem 0.75rem", borderRadius: "0.5rem",
                  background: "#f8fafc", cursor: "pointer",
                  border: "1px solid transparent",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{h.date}</span>
                    <span style={{
                      fontSize: "0.6rem", padding: "0.1rem 0.375rem", borderRadius: "9999px",
                      background: "#e0e7ff", color: "#4338ca", fontWeight: 600,
                    }}>
                      {h.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-brand-navy)", margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {h.preview}
                  </p>
                </div>
              ))}
            </div>

            <button style={{
              width: "100%", marginTop: "0.875rem", padding: "0.5rem",
              borderRadius: "0.5rem", border: "1px solid #fee2e2",
              background: "transparent", color: "#ef4444",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              🗑 Clear all history
            </button>
          </div>

          {/* Privacy card */}
          <div className="card" style={{ padding: "1.25rem", background: "#f8fafc" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-brand-navy)", margin: "0 0 0.875rem" }}>
              🔐 What Synapse knows
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {PRIVACY_ITEMS.map(({ icon, label, text }) => (
                <div key={text} style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", flexShrink: 0 }}>{icon}</span>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: "var(--color-brand-navy)" }}>{label}:</strong> {text}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.875rem", lineHeight: 1.5, margin: "0.875rem 0 0" }}>
              Conversation history older than 180 days is automatically and permanently deleted — not archived.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
