"use client";
import { useState } from "react";

function GapFillQuestion({ q, answer, onChange, submitted }) {
  const userAns   = answer?.trim().toLowerCase() ?? "";
  const correct   = q.answer.trim().toLowerCase();
  const isCorrect = submitted && userAns === correct;
  const isWrong   = submitted && userAns !== correct && userAns !== "";

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-brand-navy)", marginBottom: "0.5rem", lineHeight: 1.5 }}>
        {q.id}. {q.question.replace("___", "")}
      </p>
      <input
        type="text"
        value={answer || ""}
        onChange={(e) => !submitted && onChange(q.id, e.target.value)}
        disabled={submitted}
        placeholder="Your answer"
        aria-label={`Answer for question ${q.id}`}
        style={{
          padding: "0.375rem 0.625rem",
          borderRadius: "0.5rem",
          border: `1px solid ${isCorrect ? "#10b981" : isWrong ? "#ef4444" : "#e2e8f0"}`,
          background: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : "white",
          fontSize: "0.875rem",
          minWidth: "180px",
          outline: "none",
        }}
      />
      {submitted && !isCorrect && (
        <p style={{ fontSize: "0.7rem", color: "#10b981", marginTop: "0.25rem" }}>
          Correct: <strong>{q.answer}</strong>
        </p>
      )}
    </div>
  );
}

function MCQQuestion({ q, answer, onChange, submitted }) {
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
          <label key={opt} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.5rem 0.75rem", marginBottom: "0.375rem",
            borderRadius: "0.5rem", border: `1px solid ${border}`,
            background: bg, cursor: submitted ? "default" : "pointer",
          }}>
            <input
              type="radio"
              name={`q-${q.id}`}
              value={opt}
              checked={isSelected}
              onChange={() => !submitted && onChange(q.id, opt)}
              disabled={submitted}
              style={{ accentColor: "var(--color-brand-teal)" }}
            />
            <span style={{ fontSize: "0.875rem" }}>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

export function ListeningSession({ initialSession }) {
  const [session,    setSession]    = useState(initialSession);
  const [answers,    setAnswers]    = useState({});
  const [submitted,  setSubmitted]  = useState(false);
  const [score,      setScore]      = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error,      setError]      = useState(null);
  const [showScript, setShowScript] = useState(true);

  const handleAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }));

  const handleSubmit = () => {
    let correct = 0;
    session.questions.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) return;
      if (q.type === "mcq") {
        if (ans.charAt(0) === q.answer || ans === q.answer) correct++;
      } else if (q.type === "gap_fill") {
        if (ans.trim().toLowerCase() === q.answer.trim().toLowerCase()) correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
    setShowScript(true); // reveal script after submission
  };

  const handleNewSession = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", skill: "listening" }),
      });
      if (!res.ok) throw new Error();
      const newSession = await res.json();
      setSession(newSession);
      setAnswers({});
      setSubmitted(false);
      setScore(null);
      setShowScript(true);
    } catch {
      setError("Couldn't generate a new session. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const total    = session.questions.length;
  const answered = Object.keys(answers).length;

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem",
      }}>
        <a href="/ielts/listening" style={{ fontSize: "0.875rem", color: "var(--color-brand-gray)", textDecoration: "none" }}>
          ← Back to Listening
        </a>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)" }}>⏱ {session.duration}</span>
          <button onClick={handleNewSession} disabled={generating} style={{
            fontSize: "0.75rem", padding: "0.25rem 0.875rem", borderRadius: "9999px",
            border: "1px solid #e2e8f0", background: "white", cursor: generating ? "not-allowed" : "pointer",
            color: "var(--color-brand-navy)",
          }}>
            {generating ? "Generating…" : "✨ Generate New"}
          </button>
        </div>
      </div>

      {/* Audio coming soon note */}
      <div style={{
        padding: "0.625rem 1rem", borderRadius: "0.5rem",
        background: "#fef3c7", border: "1px solid #fcd34d",
        fontSize: "0.8rem", color: "#92400e",
        marginBottom: "1.25rem",
      }}>
        🎧 Audio playback is coming soon. For now, read the transcript below and answer the questions.
      </div>

      {/* Score card */}
      {submitted && score !== null && (
        <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", textAlign: "center", borderTop: "4px solid var(--color-brand-gold)" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--color-brand-gray)" }}>Your Score</p>
          <p style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--color-brand-teal)", margin: "0.25rem 0 0.125rem", lineHeight: 1 }}>
            {score}/{total}
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-brand-gray)", marginBottom: "1rem" }}>
            Band approx. {(5 + (score / total) * 4).toFixed(1)}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button onClick={() => { setAnswers({}); setSubmitted(false); setScore(null); }} className="btn-secondary">
              Try Again
            </button>
            <button onClick={handleNewSession} disabled={generating} className="btn-primary">
              {generating ? "Generating…" : "New Session ✨"}
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: "1rem" }} role="alert">{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* Transcript */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--color-brand-navy)", margin: 0 }}>
              🎧 {session.title}
            </h2>
            <button
              onClick={() => setShowScript((s) => !s)}
              style={{
                fontSize: "0.75rem", padding: "0.25rem 0.75rem", borderRadius: "9999px",
                border: "1px solid #e2e8f0", background: "white", cursor: "pointer",
                color: "var(--color-brand-gray)",
              }}
            >
              {showScript ? "Hide" : "Show"} Transcript
            </button>
          </div>
          {showScript && (
            <div style={{ fontSize: "0.875rem", lineHeight: 1.85, color: "#334155", whiteSpace: "pre-wrap" }}>
              {session.transcript}
            </div>
          )}
          {!showScript && (
            <p style={{ fontSize: "0.875rem", color: "var(--color-brand-gray)", fontStyle: "italic" }}>
              Transcript hidden. Answer from memory or click Show to reveal.
            </p>
          )}
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

          {session.questions.map((q) =>
            q.type === "gap_fill" ? (
              <GapFillQuestion key={q.id} q={q} answer={answers[q.id]} onChange={handleAnswer} submitted={submitted} />
            ) : (
              <MCQQuestion key={q.id} q={q} answer={answers[q.id]} onChange={handleAnswer} submitted={submitted} />
            )
          )}

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
