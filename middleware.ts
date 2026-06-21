import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { handleMarkdownNegotiation } from "@/lib/markdown-negotiation/middleware";

const intlMiddleware = createIntlMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/dashboard(.*)",
  "/dashboard(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const markdownResponse = handleMarkdownNegotiation(req);
  if (markdownResponse) return markdownResponse;

  if (isProtectedRoute(req)) auth().protect();

  const { pathname } = req.nextUrl;
  // API, metadata, and Clerk routes must not get locale redirects.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/__clerk") ||
    pathname.startsWith("/trpc") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return;
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
