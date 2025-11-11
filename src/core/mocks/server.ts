/**
 * MSW Server Setup
 * For mocking server-side requests in Next.js
 */

import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { isMockMode } from "./config";

export const server = setupServer(...handlers);

let serverInitialized = false;

/**
 * Enable mocking on the server
 */
export async function enableServerMocking() {
  // Guard: Only run if mocks are enabled
  if (!isMockMode()) {
    return;
  }

  // Guard: Only run in Node.js environment
  if (typeof window !== "undefined") {
    return;
  }

  // Guard: Only initialize once
  if (serverInitialized) {
    return;
  }

  try {
    server.listen({
      onUnhandledRequest: (request, print) => {
        // Only log unhandled requests that match our API base URL
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        if (request.url.startsWith(apiBaseUrl)) {
          console.warn(
            "[MSW Server] ⚠️ Unhandled request:",
            request.method,
            request.url
          );
          print.warning();
        }
      },
    });

    serverInitialized = true;

    console.log("🚀 [MSW Server] Mocking enabled");
    console.log(
      "[MSW Server] API Base URL:",
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    );
    console.log(
      "[MSW Server] Active handlers count:",
      server.listHandlers().length
    );
  } catch (error) {
    console.error("[MSW Server] ❌ Failed to initialize:", error);
  }
}

