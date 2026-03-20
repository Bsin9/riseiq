import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Evaluate a writing submission ───────────────────────────────────────────
function buildEvaluationPrompt(taskType, taskPrompt, studentText) {
  const taskLabel = taskType === "task1" ? "Task 1 Letter" : "Task 2 Essay";
  const minWords  = taskType === "task1" ? 150 : 250;
  return `You are a certified IELTS examiner with 10 years of experience. Evaluate the following IELTS Writing ${taskLabel}.

TASK PROMPT:
${taskPrompt}

STUDENT RESPONSE:
${studentText}

Count the words in the student response accurately.

Evaluate using the four official IELTS Writing criteria. Return ONLY a valid JSON object — no markdown, no extra text, just the JSON:
{
  "overallBand": 6.5,
  "wordCount": 280,
  "criteria": [
    { "name": "Task Achievement", "band": 6.5, "comment": "Specific comment about this response (2-3 sentences)" },
    { "name": "Coherence & Cohesion", "band": 7.0, "comment": "Specific comment about this response" },
    { "name": "Lexical Resource", "band": 6.5, "comment": "Specific comment about this response" },
    { "name": "Grammatical Range & Accuracy", "band": 7.0, "comment": "Specific comment about this response" }
  ],
  "strengths": [
    "Specific strength with example from the text",
    "Another specific strength"
  ],
  "improvements": [
    "Specific actionable improvement (e.g. use 'consequently' instead of repeating 'so')",
    "Another specific improvement",
    "Third improvement"
  ],
  "wordCountNote": "Your response is 280 words. The minimum is ${minWords} words."
}

Rules:
- Band scores must be: 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, or 9.0
- overallBand is the average of the 4 criteria rounded to the nearest 0.5
- Every comment must be specific to THIS student's response, not generic advice
- Strengths must cite specific examples (quote phrases if possible)
- Improvements must be actionable and specific (not "improve your vocabulary")
- Return ONLY the JSON object`;
}

// ─── Generate a new question/session ─────────────────────────────────────────
function buildGeneratePrompt(skill) {
  const ts = Date.now();

  if (skill === "writing_task1") {
    return `Generate a new IELTS Writing Task 1 letter prompt. Return ONLY valid JSON, no other text:
{
  "id": "gen_w_t1_${ts}",
  "title": "Short descriptive title (3-5 words)",
  "type": "task1",
  "format": "Formal Letter | Semi-formal Letter | Informal Letter",
  "minWords": 150,
  "prompt": "Situation description (2-3 sentences).\\n\\nWrite a letter to [recipient]. In your letter:\\n- first bullet point\\n- second bullet point\\n- third bullet point\\n\\nWrite at least 150 words."
}`;
  }

  if (skill === "writing_task2") {
    return `Generate a new IELTS Writing Task 2 essay question on a fresh, real-world topic. Return ONLY valid JSON:
{
  "id": "gen_w_t2_${ts}",
  "title": "Topic in 3-5 words",
  "type": "task2",
  "format": "Essay",
  "minWords": 250,
  "prompt": "2-3 sentence setup describing the debate.\\n\\nDiscuss both views and give your own opinion.\\n\\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\\n\\nWrite at least 250 words."
}`;
  }

  if (skill === "reading") {
    return `Generate a new IELTS Reading Section 1 passage with questions. Use a real-world general topic (science, environment, society, history). Return ONLY valid JSON:
{
  "id": "gen_r_${ts}",
  "title": "Article title",
  "section": 1,
  "duration": "20 min",
  "passage": "A 400-600 word factual article written in formal English. Must contain specific facts, numbers and details that can be tested. Use clear paragraphs.",
  "questions": [
    { "id": 1, "type": "tfng", "statement": "Statement derived from passage content", "answer": "True" },
    { "id": 2, "type": "tfng", "statement": "Statement derived from passage content", "answer": "False" },
    { "id": 3, "type": "tfng", "statement": "Statement about something NOT mentioned in passage", "answer": "Not Given" },
    { "id": 4, "type": "gap_fill", "before": "Sentence leading to a gap from the passage", "blank": "___", "after": "rest of sentence.", "answer": "exact_word_from_passage" },
    { "id": 5, "type": "gap_fill", "before": "Another sentence leading to a gap", "blank": "___", "after": "end of sentence.", "answer": "exact_word_from_passage" },
    { "id": 6, "type": "mcq", "question": "Question about a specific detail in the passage?", "options": ["A. option one", "B. option two", "C. option three", "D. option four"], "answer": "B" }
  ]
}`;
  }

  if (skill === "listening") {
    return `Generate a new IELTS Listening Section 1 transcript with questions. Section 1 is always a conversation between two people (e.g. booking, enquiry, registration). Return ONLY valid JSON:
{
  "id": "gen_l_${ts}",
  "title": "Section 1 — [Topic of conversation]",
  "section": 1,
  "duration": "10 min",
  "transcript": "[SPEAKER 1 — Role]: Opening line.\\n\\n[SPEAKER 2 — Role]: Response.\\n\\n[SPEAKER 1]: Continue conversation with specific testable details (numbers, names, dates, times, costs).\\n\\n[SPEAKER 2]: Response...\\n\\n(Continue for 300-400 words total. Include at least 6 specific facts that can be tested.)",
  "questions": [
    { "id": 1, "type": "gap_fill", "question": "Sentence with a gap testing a specific fact from the transcript.", "answer": "exact word or number from transcript" },
    { "id": 2, "type": "gap_fill", "question": "Another gap-fill testing a different fact.", "answer": "exact word or number" },
    { "id": 3, "type": "gap_fill", "question": "Third gap-fill.", "answer": "exact word or number" },
    { "id": 4, "type": "mcq", "question": "Question testing understanding of the conversation?", "options": ["A. option", "B. option", "C. option", "D. option"], "answer": "A" },
    { "id": 5, "type": "gap_fill", "question": "Fourth gap-fill.", "answer": "exact word or number" },
    { "id": 6, "type": "mcq", "question": "Second MCQ question?", "options": ["A. option", "B. option", "C. option", "D. option"], "answer": "C" }
  ]
}`;
  }

  if (skill === "speaking") {
    return `Generate a new IELTS Speaking Part 2 cue card on a fresh topic. Return ONLY valid JSON:
{
  "id": "gen_sp_${ts}",
  "topic": "Describe a [person/place/thing/event/experience] that [specific qualifier]",
  "part": 2,
  "bullets": [
    "What/who it is or was",
    "When and where you encountered it",
    "What made it special or significant",
    "How it has affected you or what you learned"
  ],
  "followUpQuestions": [
    "Abstract Part 3 question related to the topic (society level)",
    "Comparison or change-over-time Part 3 question",
    "Opinion-based Part 3 question"
  ]
}`;
  }

  throw new Error(`Unknown skill: ${skill}`);
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    // ── Writing evaluation ──────────────────────────────────────────────────
    if (action === "evaluate") {
      const { text, taskType, prompt } = body;

      if (!text || text.trim().split(/\s+/).length < 30) {
        return Response.json(
          { error: "Your response is too short to evaluate. Write at least 30 words." },
          { status: 400 }
        );
      }

      const message = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 1200,
        messages: [{ role: "user", content: buildEvaluationPrompt(taskType, prompt, text) }],
      });

      const raw = message.content[0].text.trim();
      const jsonStart = raw.indexOf("{");
      const jsonEnd   = raw.lastIndexOf("}") + 1;
      const result    = JSON.parse(raw.slice(jsonStart, jsonEnd));

      return Response.json(result);
    }

    // ── Content generation ──────────────────────────────────────────────────
    if (action === "generate") {
      const { skill } = body;
      if (!skill) {
        return Response.json({ error: "Missing skill parameter." }, { status: 400 });
      }

      const message = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 2048,
        messages: [{ role: "user", content: buildGeneratePrompt(skill) }],
      });

      const raw = message.content[0].text.trim();
      const jsonStart = raw.indexOf("{");
      const jsonEnd   = raw.lastIndexOf("}") + 1;
      const result    = JSON.parse(raw.slice(jsonStart, jsonEnd));

      return Response.json(result);
    }

    return Response.json(
      { error: "Unknown action. Use 'evaluate' or 'generate'." },
      { status: 400 }
    );
  } catch (err) {
    console.error("[/api/ai] Error:", err);
    return Response.json(
      { error: "Synapse Brain is unavailable right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
