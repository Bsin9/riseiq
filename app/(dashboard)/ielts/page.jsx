import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

/** /ielts root — redirects to Reading as the default IELTS entry point */
export default function IELTSRootPage() {
  redirect(ROUTES.IELTS.READING);
}
