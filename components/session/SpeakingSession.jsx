"use client";
import { useState, useEffect } from "react";

const STAGE = { READY: "ready", PREP: "prep", SPEAKING: "speaking", DONE: "done" };

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function SpeakingSession({ initialCard }) {
  const [card,       setCard]       = useState(initialCard);
  const [stage,      setStage]      = useState(STAGE.READY);
  const [timeLeft,   setTimeLeft]   = useState(60);
  const [generating, setGenerating] = useState(false);
  const [error,      setError]      = useState(null);

  // Countdown
  useEffect(() => {
    if (stage !== STAGE.PREP && stage !== STAGE.SPEAKING) return;
    if (timeLeft <= 0) {
      if (stage === STAGE.PREP) {
        setStage(STAGE.SPEAKING);
        setTimeLeft(120);
      } else {
        setStage(STAGE.DONE);
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, timeLeft]);

  const startPrep     = () => { setStage(STAGE.PREP);     setTimeLeft(60);  };
  const startSpeaking = () => { setStage(STAGE.SPEAKING); setTimeLeft(120); };
  const reset         = () => { setStage(STAGE.READY);    setTimeLeft(60);  setError(null); };

  const handleNewCard = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", skill: "speaking" }),
      });
      if (!res.ok) throw new Error();
      setCard(await res.json());
      reset();
    } catch {
      setError("Couldn't generate a new cue card. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const isLowTime   = timeLeft < 15;
  const timerColor  = isLowTime ? "#ef4444" : "var(--color-brand-navy)";
  const stageLabel  = stage === STAGE.PREP ? "⏸ Preparation Time" : "🎤 Speaking Time";

  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <a href="/ielts/speaking" style={{ fontSize: "0.875rem", color: "var(--color-brand-gray)", textDecoration: "none" }}>
          ← Back to Speaking
        </a>
        <button onClick={handleNewCard} disabled={generating} style={{
          fontSize: "0.75rem", padding: "0.25rem 0.875rem", borderRadius: "9999px",
          border: "1px solid #e2e8f0", background: "white", cursor: generating ? "not-allowed" : "pointer",
          color: "var(--color-brand-navy)",
        }}>
          {generating ? "Generating…" : "✨ New Cue Card"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: "1rem" }} role="alert">{error}</p>
      )}

      {/* Cue card */}
      <div className="card" style={{
        padding: "1.5rem",
        marginBottom: "1.5rem",
        borderTop: "4px solid var(--color-brand-gold)",
        background: stage === STAGE.SPEAKING ? "#fffbeb" : "white",
        transition: "background 0.3s",
      }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
          <span style={{
            padding: "0.2rem 0.625rem", borderRadius: "9999px",
            fontSize: "0.7rem", fontWeight: 700, background: "#fef3c7", color: "#b45309",
          }}>
            Part 2
          </span>
          <span style={{
            padding: "0.2rem 0.625rem", borderRadius: "9999px",
            fontSize: "0.7rem", fontWeight: 600, background: "#f1f5f9", color: "#64748b",
          }}>
            1 min prep · 2 min talk
          </span>
        </div>

        <h2 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--color-brand-navy)", marginBottom: "1rem" }}>
          {card.topic}
        </h2>

        <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-brand-gray)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
          You should say:
        </p>
        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
          {card.bullets.map((b, i) => (
            <li key={i} style={{ fontSize: "0.9rem", color: "#334155", marginBottom: "0.375rem", lineHeight: 1.6 }}>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Timer block */}
      {(stage === STAGE.PREP || stage === STAGE.SPEAKING) && (
        <div className="card" style={{ padding: "1.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", marginBottom: "0.5rem" }}>
            {stageLabel}
          </p>
          <p style={{
            fontSize: "4rem", fontWeight: 900, margin: "0 0 0.75rem",
            color: timerColor, fontVariantNumeric: "tabular-nums", lineHeight: 1,
            transition: "color 0.3s",
          }}>
            {formatTime(timeLeft)}
          </p>
          {stage === STAGE.PREP && (
            <button onClick={startSpeaking} className="btn-primary">
              Start Speaking Now →
            </button>
          )}
        </div>
      )}

      {/* Action: Ready state */}
      {stage === STAGE.READY && (
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={startPrep} className="btn-primary">
            Start 1-Min Prep ⏱
          </button>
        </div>
      )}

      {/* Done state — follow-up questions */}
      {stage === STAGE.DONE && (
        <div>
          <div className="card" style={{
            padding: "1.25rem", marginBottom: "1.25rem",
            borderLeft: "3px solid var(--color-brand-teal)",
          }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.875rem" }}>
              💬 Follow-up Questions (Part 3)
            </p>
            {card.followUpQuestions.map((q, i) => (
              <p key={i} style={{ fontSize: "0.9rem", color: "#334155", marginBottom: "0.625rem", lineHeight: 1.6 }}>
                {i + 1}. {q}
              </p>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={reset} className="btn-secondary">Try Again</button>
            <button onClick={handleNewCard} disabled={generating} className="btn-primary">
              {generating ? "Generating…" : "New Card ✨"}
            </button>
          </div>

          <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "1rem" }}>
            Audio recording and automated feedback is coming in Phase 3.
          </p>
        </div>
      )}

    </div>
  );
}
