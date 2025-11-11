/**
 * Initialize MSW on the server
 * This file should be imported at the top of any server-side code that makes API calls
 */

import { enableServerMocking } from "./server";

// Initialize MSW on server startup
if (typeof window === "undefined") {
  enableServerMocking().catch((error) => {
    console.error("[MSW Server] Failed to initialize:", error);
  });
}

