import { META } from "@/config/metadata.js";
import Link from "next/link";
import { ROUTES } from "@/config/routes.js";
import { Badge } from "@/components/ui/Badge.jsx";
import cuesData from "@/data/mock/speaking-cues.json";

export const metadata = META.pages.speaking;

export default function SpeakingPracticePage() {
  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
        🎤 Speaking Practice
      </h1>
      <p style={{ color: "var(--color-brand-gray)", marginBottom: "2rem" }}>
        Part 2 cue cards with 1-minute prep, 2-minute talk, and follow-up questions
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {cuesData.cueCards.map((card) => (
          <div key={card.id} className="card card-hover" style={{ padding: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 700, color: "var(--color-brand-navy)", marginBottom: "0.375rem" }}>
                {card.topic}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <Badge variant="gray">Part 2</Badge>
                <Badge variant="gray">15 min</Badge>
                <Badge variant="gray">{card.followUpQuestions?.length ?? 0} follow-ups</Badge>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--color-brand-gray)" }}>
                You should say: {card.bullets?.slice(0, 2).join(" · ")}…
              </p>
            </div>
            <Link href={ROUTES.SESSION(card.id)} className="btn-primary" style={{ flexShrink: 0 }}>
              Start →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
