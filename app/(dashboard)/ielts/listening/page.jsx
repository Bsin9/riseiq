import { META } from "@/config/metadata.js";
import Link from "next/link";
import { ROUTES } from "@/config/routes.js";
import { Badge } from "@/components/ui/Badge.jsx";

export const metadata = META.pages.listening;

const SESSIONS = [
  { id: "ls_001",          title: "Section 1 — Booking a Hotel Room", section: 1, duration: "10 min", questions: 6 },
  { id: "listening-timed", title: "Timed Practice — Mixed Questions",  section: 1, duration: "10 min", questions: 6 },
];

export default function ListeningPracticePage() {
  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
        🎧 Listening Practice
      </h1>
      <p style={{ color: "var(--color-brand-gray)", marginBottom: "2rem" }}>
        Audio-based gap fill and MCQ across 4 exam sections
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {SESSIONS.map((s) => (
          <div key={s.id} className="card card-hover" style={{ padding: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
                {s.title}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Badge variant="gold">Section {s.section}</Badge>
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
