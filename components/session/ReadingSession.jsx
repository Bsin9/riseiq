"use client";
import { useState } from "react";

// ─── Question block ───────────────────────────────────────────────────────────
function QuestionBlock({ q, answer, onChange, submitted }) {
  if (q.type === "tfng") {
    const OPTIONS = ["True", "False", "Not Given"];
    return (
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-brand-navy)", marginBottom: "0.5rem", lineHeight: 1.5 }}>
          {q.id}. {q.statement}
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {OPTIONS.map((opt) => {
            const isSelected = answer === opt;
            const isCorrect  = q.answer === opt;
            const bg = submitted
              ? isCorrect ? "#dcfce7" : isSelected ? "#fee2e2" : "white"
              : isSelected ? "#e6faf8" : "white";
            const border = submitted
              ? isCorrect ? "#10b981" : isSelected ? "#ef4444" : "#e2e8f0"
              : isSelected ? "var(--color-brand-teal)" : "#e2e8f0";
            return (
              <button
                key={opt}
                onClick={() => !submitted && onChange(q.id, opt)}
                disabled={submitted}
                style={{
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  border: `1px solid ${border}`,
                  background: bg,
                  color: "var(--color-brand-navy)",
                  cursor: submitted ? "default" : "pointer",
                  transition: "all 0.15s",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {submitted && (
          <p style={{ fontSize: "0.7rem", color: "#10b981", marginTop: "0.375rem" }}>
            Answer: <strong>{q.answer}</strong>
          </p>
        )}
      </div>
    );
  }

  if (q.type === "mcq") {
    return (
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-brand-navy)", marginBottom: "0.5rem", lineHeight: 1.5 }}>
          {q.id}. {q.question}
        </p>
        {q.options.map((opt) => {
          const letter     = opt.charAt(0);
          const isSelected = answer === opt || answer === letter;
          const isCorrect  = q.answer === letter || q.answer === opt;
          const bg = submitted
            ? isCorrect ? "#dcfce7" : isSelected ? "#fee2e2" : "white"
            : isSelected ? "#e6faf8" : "white";
          const border = submitted
            ? isCorrect ? "#10b981" : isSelected ? "#ef4444" : "#e2e8f0"
            : isSelected ? "var(--color-brand-teal)" : "#e2e8f0";
          return (
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                marginBottom: "0.375rem",
                borderRadius: "0.5rem",
                border: `1px solid ${border}`,
                background: bg,
                cursor: submitted ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              <input
                type="radio"
                name={`q-${q.id}`}
                value={opt}
                checked={isSelected}
                onChange={() => !submitted && onChange(q.id, opt)}
                disabled={submitted}
                style={{ accentColor: "var(--color-brand-teal)" }}
              />
              <span style={{ fontSize: "0.875rem", color: "#334155" }}>{opt}</span>
            </label>
          );
        })}
      </div>
    );
  }

  if (q.type === "gap_fill") {
    const userAns   = answer?.trim().toLowerCase() ?? "";
    const correct   = q.answer.trim().toLowerCase();
    const isCorrect = submitted && userAns === correct;
    const isWrong   = submitted && userAns !== correct && userAns !== "";
    return (
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-brand-navy)", marginBottom: "0.5rem" }}>
          {q.id}. Complete the sentence:
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap", fontSize: "0.875rem", color: "#334155" }}>
          {q.before && <span>{q.before}</span>}
          <input
            type="text"
            value={answer || ""}
            onChange={(e) => !submitted && onChange(q.id, e.target.value)}
            disabled={submitted}
            placeholder="answer"
            aria-label={`Gap fill answer for question ${q.id}`}
            style={{
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
              border: `1px solid ${isCorrect ? "#10b981" : isWrong ? "#ef4444" : "#e2e8f0"}`,
              background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : "white",
              fontSize: "0.875rem",
              minWidth: "120px",
              outline: "none",
            }}
          />
          {q.after && <span>{q.after}</span>}
        </div>
        {submitted && !isCorrect && (
          <p style={{ fontSize: "0.7rem", color: "#10b981", marginTop: "0.375rem" }}>
            Correct: <strong>{q.answer}</strong>
          </p>
        )}
      </div>
    );
  }

  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ReadingSession({ initialSession }) {
  const [session,    setSession]    = useState(initialSession);
  const [answers,    setAnswers]    = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [score,      setScore]      = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error,      setError]      = useState(null);

  const handleAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }));

  const handleSubmit = () => {
    let correct = 0;
    session.questions.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) return;
      if (q.type === "mcq") {
        if (ans.charAt(0) === q.answer || ans === q.answer) correct++;
      } else if (q.type === "tfng") {
        if (ans === q.answer) correct++;
      } else if (q.type === "gap_fill") {
        if (ans.trim().toLowerCase() === q.answer.trim().toLowerCase()) correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleNewSession = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", skill: "reading" }),
      });
      if (!res.ok) throw new Error();
      const newSession = await res.json();
      setSession(newSession);
      setAnswers({});
      setSubmitted(false);
      setScore(null);
    } catch {
      setError("Couldn't generate a new passage. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleTryAgain = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setError(null);
  };

  const total      = session.questions.length;
  const answered   = Object.keys(answers).length;
  const bandApprox = score !== null ? (5 + (score / total) * 4).toFixed(1) : null;

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}>
        <a href="/ielts/reading" style={{ fontSize: "0.875rem", color: "var(--color-brand-gray)", textDecoration: "none" }}>
          ← Back to Reading
        </a>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)" }}>⏱ {session.duration}</span>
          <button
            onClick={handleNewSession}
            disabled={generating}
            style={{
              fontSize: "0.75rem", padding: "0.25rem 0.875rem",
              borderRadius: "9999px", border: "1px solid #e2e8f0",
              background: "white", cursor: generating ? "not-allowed" : "pointer",
              color: "var(--color-brand-navy)",
            }}
          >
            {generating ? "Generating…" : "✨ Generate New"}
          </button>
        </div>
      </div>

      {/* Score card */}
      {submitted && score !== null && (
        <div className="card" style={{
          padding: "1.25rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          borderTop: "4px solid var(--color-brand-teal)",
        }}>
          <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)" }}>Your Score</p>
          <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--color-brand-teal)", margin: "0.25rem 0 0.125rem", lineHeight: 1 }}>
            {score}/{total}
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-brand-gray)", marginBottom: "1rem" }}>
            Approx. Band {bandApprox}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button onClick={handleTryAgain} className="btn-secondary">Try Again</button>
            <button onClick={handleNewSession} disabled={generating} className="btn-primary">
              {generating ? "Generating…" : "New Passage ✨"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: "1rem" }} role="alert">{error}</p>
      )}

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* Passage */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--color-brand-navy)", marginBottom: "1rem" }}>
            📖 {session.title}
          </h2>
          <div style={{ fontSize: "0.875rem", lineHeight: 1.85, color: "#334155", whiteSpace: "pre-wrap" }}>
            {session.passage}
          </div>
        </div>

        {/* Questions */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-brand-navy)", margin: 0 }}>
              Questions ({total})
            </h3>
            {!submitted && (
              <span style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)" }}>
                {answered}/{total} answered
              </span>
            )}
          </div>

          {session.questions.map((q) => (
            <QuestionBlock
              key={q.id}
              q={q}
              answer={answers[q.id]}
              onChange={handleAnswer}
              submitted={submitted}
            />
          ))}

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={answered === 0}
              className="btn-primary"
              style={{ marginTop: "0.5rem", opacity: answered === 0 ? 0.5 : 1, cursor: answered === 0 ? "not-allowed" : "pointer" }}
            >
              Submit Answers →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
