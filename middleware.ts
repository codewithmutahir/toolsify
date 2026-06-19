import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { handleMarkdownNegotiation } from "@/lib/markdown-negotiation/middleware";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware((auth, req) => {
  const markdownResponse = handleMarkdownNegotiation(req);
  if (markdownResponse) return markdownResponse;

  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
