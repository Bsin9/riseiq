import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

/** Permanently moved to /ielts/reading */
export default function ReadingRedirect() {
  redirect(ROUTES.IELTS.READING);
}
