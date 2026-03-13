import { META } from "@/config/metadata.js";
import Link from "next/link";
import { ROUTES } from "@/config/routes.js";
import { Badge } from "@/components/ui/Badge.jsx";

export const metadata = META.pages.reading;

const SESSIONS = [
  { id: "s_001",       title: "The Rise of Urban Vertical Farming", difficulty: "intermediate", duration: "20 min", questions: 6 },
  { id: "reading-timed", title: "Timed Practice — Mixed Question Types", difficulty: "intermediate", duration: "20 min", questions: 6 },
];
const DIFFICULTY_VARIANT = { foundation: "teal", intermediate: "gold", advanced: "navy" };

export default function ReadingPracticePage() {
  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
        📖 Reading Practice
      </h1>
      <p style={{ color: "var(--color-brand-gray)", marginBottom: "2rem" }}>
        True/False/Not Given, MCQ, gap fill, and matching headings
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {SESSIONS.map((s) => (
          <div key={s.id} className="card card-hover" style={{ padding: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
                {s.title}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <Badge variant={DIFFICULTY_VARIANT[s.difficulty]}>{s.difficulty}</Badge>
                <Badge variant="gray">{s.duration}</Badge>
                <Badge variant="gray">{s.questions} questions</Badge>
              </div>
            </div>
            <Link href={ROUTES.SESSION(s.id)} className="btn-primary">Start →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
