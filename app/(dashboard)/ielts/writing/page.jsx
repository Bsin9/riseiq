import { META } from "@/config/metadata.js";
import Link from "next/link";
import { ROUTES } from "@/config/routes.js";
import { Badge } from "@/components/ui/Badge.jsx";
import writingData from "@/data/writingPrompts.json";

export const metadata = META.pages.writing;

export default function WritingPracticePage() {
  const allPrompts = [...writingData.task1, ...writingData.task2];

  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
        ✍️ Writing Practice
      </h1>
      <p style={{ color: "var(--color-brand-gray)", marginBottom: "2rem" }}>
        Task 1 letters (150+ words) and Task 2 essays (250+ words)
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {allPrompts.map((p) => (
          <div key={p.id} className="card card-hover" style={{ padding: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
                {p.title}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.625rem" }}>
                <Badge variant={p.type === "task1" ? "teal" : "navy"}>
                  {p.type === "task1" ? "Task 1 — Letter" : "Task 2 — Essay"}
                </Badge>
                <Badge variant="gray">Min {p.minWords} words</Badge>
                <Badge variant="gray">{p.format}</Badge>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--color-brand-gray)",
                overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" }}>
                {p.prompt.split("\n")[0]}
              </p>
            </div>
            <Link href={ROUTES.SESSION(p.id)} className="btn-primary" style={{ flexShrink: 0 }}>
              Start →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
