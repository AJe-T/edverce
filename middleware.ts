import { authMiddleware } from "@clerk/nextjs";

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
