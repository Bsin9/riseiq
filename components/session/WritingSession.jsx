"use client";
import { useState, useEffect } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function bandColor(band) {
  if (band >= 7.5) return "#10b981";
  if (band >= 6.5) return "var(--color-brand-teal)";
  if (band >= 5.5) return "#f59e0b";
  return "#ef4444";
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function TimerBadge({ seconds }) {
  const low = seconds < 120;
  return (
    <span style={{
      fontVariantNumeric: "tabular-nums",
      fontWeight: 700,
      fontSize: "0.875rem",
      color: low ? "#ef4444" : "var(--color-brand-gray)",
    }}>
      ⏱ {formatTime(seconds)}
    </span>
  );
}

function AIFeedback({ result, onTryAgain, onNewPrompt, generating }) {
  return (
    <div style={{ marginTop: "1.5rem" }}>

      {/* Overall band */}
      <div className="card" style={{
        padding: "1.5rem",
        textAlign: "center",
        marginBottom: "1rem",
        borderTop: `4px solid ${bandColor(result.overallBand)}`,
      }}>
        <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", marginBottom: "0.375rem" }}>
          Synapse Brain · Overall Band
        </p>
        <p style={{
          fontSize: "3.5rem", fontWeight: 900,
          color: bandColor(result.overallBand), margin: "0 0 0.375rem",
          lineHeight: 1,
        }}>
          {result.overallBand}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", margin: 0 }}>
          {result.wordCountNote}
        </p>
      </div>

      {/* 4 criteria */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
        {result.criteria.map((c) => (
          <div key={c.name} className="card" style={{ padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-brand-navy)" }}>
                {c.name}
              </span>
              <span style={{ fontSize: "1rem", fontWeight: 800, color: bandColor(c.band) }}>
                {c.band}
              </span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)", margin: 0, lineHeight: 1.5 }}>
              {c.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Strengths + Improvements */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div className="card" style={{ padding: "1rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", marginBottom: "0.625rem" }}>
            ✅ Strengths
          </p>
          {result.strengths.map((s, i) => (
            <p key={i} style={{ fontSize: "0.8rem", color: "#334155", margin: "0 0 0.375rem", lineHeight: 1.5 }}>
              • {s}
            </p>
          ))}
        </div>
        <div className="card" style={{ padding: "1rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.625rem" }}>
            📈 To Improve
          </p>
          {result.improvements.map((s, i) => (
            <p key={i} style={{ fontSize: "0.8rem", color: "#334155", margin: "0 0 0.375rem", lineHeight: 1.5 }}>
              • {s}
            </p>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button onClick={onTryAgain} className="btn-secondary">
          ← Try Again
        </button>
        <button onClick={onNewPrompt} disabled={generating} className="btn-primary">
          {generating ? "Generating…" : "New Prompt ✨"}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function WritingSession({ initialPrompt }) {
  const [prompt,     setPrompt]     = useState(initialPrompt);
  const [text,       setText]       = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState(null);
  const [generating, setGenerating] = useState(false);

  const totalSecs = prompt.type === "task1" ? 20 * 60 : 40 * 60;
  const [timeLeft,      setTimeLeft]      = useState(totalSecs);
  const [timerRunning,  setTimerRunning]  = useState(false);

  const wordCount  = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minWords   = prompt.minWords ?? 250;
  const wordsMet   = wordCount >= minWords;

  // Countdown timer
  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerRunning, timeLeft]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (!timerRunning && !submitted) setTimerRunning(true);
  };

  const handleSubmit = async () => {
    if (!wordsMet || evaluating) return;
    setTimerRunning(false);
    setEvaluating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluate", text, taskType: prompt.type, prompt: prompt.prompt }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setSubmitted(true);
    } catch (e) {
      setError(e.message || "Synapse Brain couldn't evaluate this right now. Try again in a moment.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setResult(null);
    setText("");
    setTimeLeft(totalSecs);
    setTimerRunning(false);
    setError(null);
  };

  const handleNewPrompt = async () => {
    setGenerating(true);
    setError(null);
    try {
      const skill = prompt.type === "task1" ? "writing_task1" : "writing_task2";
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", skill }),
      });
      if (!res.ok) throw new Error();
      const newPrompt = await res.json();
      setPrompt(newPrompt);
      setSubmitted(false);
      setResult(null);
      setText("");
      setTimeLeft(newPrompt.type === "task1" ? 20 * 60 : 40 * 60);
      setTimerRunning(false);
    } catch {
      setError("Couldn't generate a new prompt. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}>
        <a href="/ielts/writing" style={{ fontSize: "0.875rem", color: "var(--color-brand-gray)", textDecoration: "none" }}>
          ← Back to Writing
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <TimerBadge seconds={timeLeft} />
          {!submitted && (
            <button
              onClick={handleNewPrompt}
              disabled={generating}
              style={{
                fontSize: "0.75rem", padding: "0.25rem 0.875rem",
                borderRadius: "9999px", border: "1px solid #e2e8f0",
                background: "white", cursor: generating ? "not-allowed" : "pointer",
                color: "var(--color-brand-navy)",
              }}
            >
              {generating ? "Generating…" : "✨ New Prompt"}
            </button>
          )}
        </div>
      </div>

      {/* Prompt card */}
      <div className="card" style={{
        padding: "1.25rem",
        marginBottom: "1.25rem",
        borderLeft: `3px solid ${prompt.type === "task1" ? "var(--color-brand-teal)" : "var(--color-brand-navy)"}`,
      }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <span style={{
            padding: "0.2rem 0.625rem", borderRadius: "9999px",
            fontSize: "0.7rem", fontWeight: 700,
            background: prompt.type === "task1" ? "#e6faf8" : "#e8edf5",
            color: prompt.type === "task1" ? "#0d9488" : "var(--color-brand-navy)",
          }}>
            {prompt.type === "task1" ? "Task 1 — Letter" : "Task 2 — Essay"}
          </span>
          <span style={{
            padding: "0.2rem 0.625rem", borderRadius: "9999px",
            fontSize: "0.7rem", fontWeight: 600,
            background: "#f1f5f9", color: "#64748b",
          }}>
            Min {minWords} words
          </span>
          <span style={{
            padding: "0.2rem 0.625rem", borderRadius: "9999px",
            fontSize: "0.7rem", fontWeight: 600,
            background: "#f1f5f9", color: "#64748b",
          }}>
            {prompt.type === "task1" ? "20 min" : "40 min"}
          </span>
        </div>

        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.75rem" }}>
          {prompt.title}
        </h2>
        <div style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
          {prompt.prompt}
        </div>
      </div>

      {/* Writing area */}
      {!submitted && (
        <>
          <div style={{ position: "relative" }}>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Start writing here. The timer starts when you type."
              aria-label="Your writing response"
              style={{
                width: "100%",
                minHeight: "300px",
                padding: "1rem",
                borderRadius: "0.75rem",
                border: "2px solid #e2e8f0",
                fontSize: "0.9375rem",
                lineHeight: 1.8,
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e)  => { e.target.style.borderColor = "var(--color-brand-teal)"; }}
              onBlur={(e)   => { e.target.style.borderColor = "#e2e8f0"; }}
            />
            <div style={{
              position: "absolute",
              bottom: "0.75rem",
              right: "0.75rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: wordsMet ? "var(--color-brand-teal)" : "#94a3b8",
              pointerEvents: "none",
            }}>
              {wordCount} / {minWords} words
            </div>
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.8rem", margin: "0.5rem 0 0" }} role="alert">
              {error}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={handleSubmit}
              disabled={!wordsMet || evaluating}
              className="btn-primary"
              style={{ opacity: (!wordsMet || evaluating) ? 0.55 : 1, cursor: (!wordsMet || evaluating) ? "not-allowed" : "pointer" }}
            >
              {evaluating ? "Synapse Brain is reviewing…" : "Submit for Feedback →"}
            </button>
            {!wordsMet && wordCount > 0 && (
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                {minWords - wordCount} more word{minWords - wordCount !== 1 ? "s" : ""} needed
              </span>
            )}
          </div>
        </>
      )}

      {/* AI Feedback */}
      {submitted && result && (
        <AIFeedback
          result={result}
          onTryAgain={handleTryAgain}
          onNewPrompt={handleNewPrompt}
          generating={generating}
        />
      )}
    </div>
  );
}
