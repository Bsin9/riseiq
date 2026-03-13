import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

/** Permanently moved to /ielts/speaking */
export default function SpeakingRedirect() {
  redirect(ROUTES.IELTS.SPEAKING);
}
