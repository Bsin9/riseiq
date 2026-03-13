import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

/** Permanently moved to /ielts/writing */
export default function WritingRedirect() {
  redirect(ROUTES.IELTS.WRITING);
}
