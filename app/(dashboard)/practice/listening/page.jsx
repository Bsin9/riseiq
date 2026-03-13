import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

/** Permanently moved to /ielts/listening */
export default function ListeningRedirect() {
  redirect(ROUTES.IELTS.LISTENING);
}
