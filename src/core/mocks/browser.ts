import { isMockMode } from "./config";

export async function enableMocking() {
  // Guard: Only run in browser environment
  if (typeof window === "undefined") {
    return;
  }

  // Guard: Only run if mocks are enabled
  if (!isMockMode()) {
    return;
  }

  // Dynamic import to exclude MSW from production bundle
  const { worker } = await import("./msw");

  // Start the service worker with proper configuration for cross-origin requests
  await worker.start({
    onUnhandledRequest: (request, print) => {
      // Only log unhandled requests that match our API base URL
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      if (request.url.startsWith(apiBaseUrl)) {
        console.warn(
          "[MSW] ⚠️ Unhandled request:",
          request.method,
          request.url
        );
        print.warning();
      }
    },
    serviceWorker: {
      url: "/mockServiceWorker.js", // Path to the service worker file in public/
      options: {
        // Ensure service worker can intercept cross-origin requests
        scope: "/",
      },
    },
    quiet: false, // Enable MSW's own logging for debugging
    waitUntilReady: true, // Wait for service worker to be ready
  });

  console.log("🚀 [MSW] Mocking enabled");
  console.log(
    "[MSW] API Base URL:",
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
  );
  console.log("[MSW] Active handlers count:", worker.listHandlers().length);

  // Log all registered handlers for debugging
  const handlers = worker.listHandlers();
  handlers.forEach((handler, index) => {
    console.log(`[MSW] Handler ${index + 1} registered`);
  });
}
