import { notFound }            from "next/navigation";
import { WritingSession }      from "@/components/session/WritingSession.jsx";
import { ReadingSession }      from "@/components/session/ReadingSession.jsx";
import { ListeningSession }    from "@/components/session/ListeningSession.jsx";
import { SpeakingSession }     from "@/components/session/SpeakingSession.jsx";
import writingData             from "@/data/writingPrompts.json";
import readingData             from "@/data/mock/reading-sessions.json";
import listeningData           from "@/data/mock/listening-sessions.json";
import speakingData            from "@/data/mock/speaking-cues.json";

/** Detect which IELTS skill a session ID belongs to based on its prefix */
function detectSkill(id) {
  if (/^(r_|reading|gen_r_)/.test(id))   return "reading";
  if (/^(w_|gen_w_)/.test(id))            return "writing";
  if (/^(ls_|listening|gen_l_)/.test(id)) return "listening";
  if (/^(sp_|gen_sp_)/.test(id))          return "speaking";
  return null;
}

const allWritingPrompts = [...writingData.task1, ...writingData.task2];

export async function generateMetadata({ params }) {
  const { sessionId } = await params;
  const skill = detectSkill(sessionId);
  const titles = {
    writing:   "Writing Session — RiseIQ",
    reading:   "Reading Session — RiseIQ",
    listening: "Listening Session — RiseIQ",
    speaking:  "Speaking Session — RiseIQ",
  };
  return { title: titles[skill] ?? "Practice Session — RiseIQ" };
}

export default async function SessionPage({ params }) {
  const { sessionId } = await params;
  const skill = detectSkill(sessionId);

  if (!skill) notFound();

  // ── Writing ──────────────────────────────────────────────────────────────
  if (skill === "writing") {
    const prompt = allWritingPrompts.find((p) => p.id === sessionId)
      ?? allWritingPrompts[0]; // fallback to first prompt if ID not found
    return <WritingSession initialPrompt={prompt} />;
  }

  // ── Reading ──────────────────────────────────────────────────────────────
  if (skill === "reading") {
    const session = readingData.sessions.find((s) => s.id === sessionId);
    if (!session) notFound();
    return <ReadingSession initialSession={session} />;
  }

  // ── Listening ────────────────────────────────────────────────────────────
  if (skill === "listening") {
    const session = listeningData.sessions.find((s) => s.id === sessionId);
    if (!session) notFound();
    return <ListeningSession initialSession={session} />;
  }

  // ── Speaking ─────────────────────────────────────────────────────────────
  if (skill === "speaking") {
    const card = speakingData.cueCards.find((c) => c.id === sessionId);
    if (!card) notFound();
    return <SpeakingSession initialCard={card} />;
  }

  notFound();
}
