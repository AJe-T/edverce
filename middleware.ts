import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/features",
    "/contact",
    "/terms",
    "/policy",
    "/refund",
    "/api/uploadthing",
    "/api/contact",
    "/api/courses(.*)",
    "/api/courses/(.*)/purchase",
    "/api/courses/:courseId/purchase",
    /^\/api\/courses\/[^/]+\/purchase$/,
  ],
  ignoredRoutes: ["/api/courses(.*)/purchase"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
