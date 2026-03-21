import { META } from "@/config/metadata.js";
import Link from "next/link";
import { ROUTES } from "@/config/routes.js";
import { Badge } from "@/components/ui/Badge.jsx";
import readingData from "@/data/mock/reading-sessions.json";

export const metadata = META.pages.reading;

const SECTION_VARIANT = { 1: "teal", 2: "gold", 3: "navy" };

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
        {readingData.sessions.map((s) => (
          <div key={s.id} className="card card-hover" style={{ padding: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
                {s.title}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <Badge variant={SECTION_VARIANT[s.section] ?? "gray"}>Section {s.section}</Badge>
                <Badge variant="gray">{s.duration}</Badge>
                <Badge variant="gray">{s.questions.length} questions</Badge>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--color-brand-gray)",
                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" }}>
                {s.passage.slice(0, 120)}…
              </p>
            </div>
            <Link href={ROUTES.SESSION(s.id)} className="btn-primary" style={{ flexShrink: 0 }}>Start →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
