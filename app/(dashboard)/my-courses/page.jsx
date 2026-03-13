import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes.js";

/**
 * /my-courses is superseded by the Learning Hub.
 * Redirect permanently so any bookmarks still work.
 */
export default function MyCoursesPage() {
  redirect(ROUTES.LEARNING);
}
