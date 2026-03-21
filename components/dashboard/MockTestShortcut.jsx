import Link from "next/link";
import readingData   from "@/data/mock/reading-sessions.json";
import listeningData from "@/data/mock/listening-sessions.json";
import speakingData  from "@/data/mock/speaking-cues.json";
import writingData   from "@/data/writingPrompts.json";
import { ROUTES }    from "@/config/routes.js";

/**
 * MockTestShortcut
 * Shows a "Start Full Mock Test" CTA with current content stats,
 * and quick-start buttons for individual skills using the first
 * available session from each data file.
 */
export function MockTestShortcut() {
  // Pick the first session of each skill as the quick-start target
  const firstReading   = readingData.sessions[0]?.id;
  const firstListening = listeningData.sessions[0]?.id;
  const firstSpeaking  = speakingData.cueCards[0]?.id;
  const firstWriting   = writingData.task2[0]?.id;

  const stats = [
    { label: "Reading passages",   count: readingData.sessions.length },
    { label: "Listening sections", count: listeningData.sessions.length },
    { label: "Speaking cue cards", count: speakingData.cueCards.length },
    { label: "Writing prompts",    count: writingData.task1.length + writingData.task2.length },
  ];

  const quickStart = [
    { label: "📖 Reading",   href: ROUTES.SESSION(firstReading),   color: "#0d9488" },
    { label: "✍️ Writing",   href: ROUTES.SESSION(firstWriting),   color: "#1e40af" },
    { label: "🎧 Listening", href: ROUTES.SESSION(firstListening), color: "#b45309" },
    { label: "🎤 Speaking",  href: ROUTES.SESSION(firstSpeaking),  color: "#7c3aed" },
  ];

  return (
    <div className="card" style={{
      padding: "1.25rem",
      marginTop: "1.25rem",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      border: "none",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
            Practice Library
          </p>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "white", margin: 0 }}>
            Ready to practise
          </h3>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.125rem", fontWeight: 900, color: "var(--color-brand-teal)", margin: 0, lineHeight: 1 }}>
                {s.count}
              </p>
              <p style={{ fontSize: "0.6rem", color: "#94a3b8", margin: 0, whiteSpace: "nowrap" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick start buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        {quickStart.map((q) => (
          <Link
            key={q.label}
            href={q.href}
            style={{
              display: "block",
              padding: "0.625rem 0.875rem",
              borderRadius: "0.5rem",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              textDecoration: "none",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "white",
              textAlign: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
          >
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
