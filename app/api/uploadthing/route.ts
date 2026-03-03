import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";

const uploadthingToken = process.env.UPLOADTHING_TOKEN
  ?.trim()
  .replace(/^['"]|['"]$/g, "");
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: uploadthingToken,
  },
});
