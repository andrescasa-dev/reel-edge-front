# MSW Implementation Guide for Next.js 15 App Router

## Overview

Implement MSW (Mock Service Worker) using Next.js 15 Server Components for optimal performance and zero race conditions.

## Architecture Decision

Use **Async Server Component** pattern in `app/layout.tsx` to initialize MSW before any client-side rendering occurs. This ensures all HTTP requests are intercepted from the first render.

## Implementation Steps

### 1. Install MSW

```bash
npm install msw --save-dev
npx msw init public/ --save
```

This generates `public/mockServiceWorker.js` (required file, do not move or rename).

### 2. Environment Configuration

**File: `.env.local`**

```env
NEXT_PUBLIC_ENABLE_MOCKS=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

**Important:** The `NEXT_PUBLIC_` prefix is required for browser-accessible environment variables in Next.js.

### 3. Core Mock Configuration

**File: `src/core/mocks/config.ts`**

```typescript
export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";
}

export const mockConfig = {
  enabled: isMockMode(),
  delayMin: 300,
  delayMax: 800,
} as const;
```

**Purpose:** Centralized configuration for mock enablement and simulated network delays.

### 4. MSW Worker Setup

**File: `src/core/mocks/msw.ts`**

```typescript
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

**Purpose:** Creates the MSW worker instance with all registered handlers.

### 5. Browser Initialization

**File: `src/core/mocks/browser.ts`**

```typescript
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

  // Start the service worker
  await worker.start({
    onUnhandledRequest: "bypass", // Allow non-mocked requests to pass through
    serviceWorker: {
      url: "/mockServiceWorker.js", // Path to the service worker file in public/
    },
  });

  console.log("🚀 [MSW] Mocking enabled");
}
```

**Key Points:**

- `typeof window === 'undefined'` check prevents execution during server-side rendering
- Dynamic import (`await import()`) ensures MSW code is tree-shaken in production
- `onUnhandledRequest: 'bypass'` allows real API calls for endpoints without handlers
- Returns a Promise that resolves when MSW is ready

### 6. Handler Registry

**File: `src/core/mocks/handlers.ts`**

```typescript
import { roleHandlers } from "@/modules/role/mocks/handlers";
// Import other module handlers as needed

export const handlers = [
  ...roleHandlers,
  // ...userHandlers,
  // ...productHandlers,
];
```

**Purpose:** Central registry that combines all request handlers from different modules.

### 7. Root Layout Integration (Critical)

**File: `app/layout.tsx`**

```typescript
import { ReactNode } from "react";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Initialize MSW before first render (development only)
  if (process.env.NODE_ENV === "development") {
    const { enableMocking } = await import("@/core/mocks/browser");
    await enableMocking();
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Why This Works:**

- Server Component can be async
- `await enableMocking()` blocks rendering until MSW is ready
- Prevents race conditions where components make requests before MSW intercepts
- Dynamic import ensures zero production bundle impact
- No need for Client Components or useState

**Critical:** Do NOT use `useEffect` for MSW initialization. This causes race conditions because:

1. `useEffect` runs AFTER component mount
2. Child components may fetch data during render
3. Fetches occur before MSW is active
4. Requests fail or hit real backend

### 8. Module-Specific Handlers

**File: `src/modules/role/mocks/handlers.ts`**

```typescript
import { http, HttpResponse } from "msw";
import { mockRoles } from "./data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const roleHandlers = [
  // GET /api/v1/roles
  http.get("/api/v1/roles", async () => {
    await delay(500); // Simulate network latency

    return HttpResponse.json({
      IsSuccess: true,
      Data: mockRoles,
      ErrorMessage: null,
    });
  }),

  // GET /api/v1/roles/actives
  http.get("/api/v1/roles/actives", async () => {
    await delay(400);

    const activeRoles = mockRoles.filter((role) => role.IsActive);

    return HttpResponse.json({
      IsSuccess: true,
      Data: activeRoles,
      ErrorMessage: null,
    });
  }),

  // POST /api/v1/roles
  http.post("/api/v1/roles", async ({ request }) => {
    await delay(600);

    const body = await request.json();

    // Simulate validation
    if (!body.Name) {
      return HttpResponse.json(
        {
          IsSuccess: false,
          Data: null,
          ErrorMessage: "Name is required",
        },
        { status: 400 }
      );
    }

    const newRole = {
      Id: Date.now(),
      Name: body.Name,
      UserAmount: 0,
      IsActive: true,
    };

    return HttpResponse.json({
      IsSuccess: true,
      Data: newRole,
      ErrorMessage: null,
    });
  }),
];
```

**File: `src/modules/role/mocks/data.ts`**

```typescript
import type { BackendRole } from "@/modules/role/types";

export const mockRoles: BackendRole[] = [
  { Id: 1, Name: "Administrator", UserAmount: 5, IsActive: true },
  { Id: 2, Name: "Developer", UserAmount: 12, IsActive: true },
  { Id: 3, Name: "Designer", UserAmount: 8, IsActive: true },
  { Id: 4, Name: "Manager", UserAmount: 3, IsActive: true },
  { Id: 5, Name: "Guest", UserAmount: 50, IsActive: false },
];
```

**File: `src/modules/role/mocks/index.ts`**

```typescript
export * from "./handlers";
export * from "./data";
```

## File Structure

```
project/
├── public/
│   └── mockServiceWorker.js          (generated by MSW, required)
├── src/
│   ├── app/
│   │   └── layout.tsx                (MSW initialization here)
│   ├── core/
│   │   └── mocks/
│   │       ├── config.ts             (environment checks)
│   │       ├── browser.ts            (MSW startup logic)
│   │       ├── msw.ts                (worker setup)
│   │       └── handlers.ts           (handler registry)
│   └── modules/
│       └── role/
│           └── mocks/
│               ├── data.ts           (mock data)
│               ├── handlers.ts       (request handlers)
│               └── index.ts          (exports)
└── .env.local                        (NEXT_PUBLIC_ENABLE_MOCKS=true)
```

## Verification

After implementation, verify MSW is working:

1. **Start development server:**

```bash
   npm run dev
```

2. **Open browser console** - you should see:

```
   🚀 [MSW] Mocking enabled
```

3. **Check Network tab** - requests to `/api/v1/roles` should:

   - Not hit a real server
   - Return mock data
   - Show simulated delays

4. **Service Worker registration** - DevTools → Application → Service Workers should show:
   - Active service worker at `/mockServiceWorker.js`

## How It Works

1. **Build time:** Next.js reads `NEXT_PUBLIC_ENABLE_MOCKS` from `.env.local`
2. **Server render:** `layout.tsx` executes `await enableMocking()` before rendering children
3. **Browser:** Service worker registers and intercepts fetch requests
4. **Request flow:**
   - Component calls `fetch('/api/v1/roles')`
   - MSW service worker intercepts the request
   - Matching handler returns mock response
   - Component receives mock data (unaware it's fake)

## Production Safety

MSW is automatically excluded from production builds:

- `if (process.env.NODE_ENV === 'development')` prevents execution in production
- Dynamic imports (`await import()`) are tree-shaken in production builds
- `public/mockServiceWorker.js` is never deployed (add to `.gitignore` if needed)

## Common Mistakes to Avoid

❌ **Don't use Client Component with useEffect**

```typescript
// WRONG - causes race conditions
"use client";
export function MockProvider({ children }) {
  useEffect(() => {
    initializeMocks(); // Runs AFTER render
  }, []);
  return <>{children}</>;
}
```

❌ **Don't forget NEXT*PUBLIC* prefix**

```typescript
// WRONG - not accessible in browser
ENABLE_MOCKS = true;

// CORRECT
NEXT_PUBLIC_ENABLE_MOCKS = true;
```

❌ **Don't move mockServiceWorker.js from public/**

```typescript
// WRONG
src / mocks / mockServiceWorker.js;

// CORRECT
public / mockServiceWorker.js;
```

❌ **Don't use synchronous initialization**

```typescript
// WRONG - not awaiting
if (process.env.NODE_ENV === "development") {
  enableMocking(); // Missing await
}

// CORRECT
if (process.env.NODE_ENV === "development") {
  await enableMocking();
}
```

## Advanced Features

### Request Parameters

```typescript
http.get("/api/v1/roles/search", async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const page = Number(url.searchParams.get("page")) || 1;

  const filtered = mockRoles.filter((role) =>
    role.Name.toLowerCase().includes(query.toLowerCase())
  );

  return HttpResponse.json({
    IsSuccess: true,
    Data: filtered,
    ErrorMessage: null,
  });
});
```

### Path Parameters

```typescript
http.get("/api/v1/roles/:id", async ({ params }) => {
  const { id } = params;
  const role = mockRoles.find((r) => r.Id === Number(id));

  if (!role) {
    return HttpResponse.json(
      {
        IsSuccess: false,
        Data: null,
        ErrorMessage: "Role not found",
      },
      { status: 404 }
    );
  }

  return HttpResponse.json({
    IsSuccess: true,
    Data: role,
    ErrorMessage: null,
  });
});
```

### Request Headers

```typescript
http.get("/api/v1/roles", async ({ request }) => {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return HttpResponse.json(
      {
        IsSuccess: false,
        Data: null,
        ErrorMessage: "Unauthorized",
      },
      { status: 401 }
    );
  }

  return HttpResponse.json({
    IsSuccess: true,
    Data: mockRoles,
    ErrorMessage: null,
  });
});
```

### Random Errors for Testing

```typescript
http.post("/api/v1/roles", async ({ request }) => {
  await delay(600);

  // 20% chance of server error
  if (Math.random() < 0.2) {
    return HttpResponse.json(
      {
        IsSuccess: false,
        Data: null,
        ErrorMessage: "Internal server error",
      },
      { status: 500 }
    );
  }

  const body = await request.json();
  return HttpResponse.json({
    IsSuccess: true,
    Data: { Id: Date.now(), ...body },
    ErrorMessage: null,
  });
});
```

### Pagination Utility

```typescript
// src/core/mocks/utils/pagination.ts
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
    hasMore: end < items.length,
  };
}

// Usage in handler
http.get("/api/v1/roles", async ({ request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const pageSize = Number(url.searchParams.get("pageSize")) || 10;

  const result = paginate(mockRoles, page, pageSize);

  return HttpResponse.json({
    IsSuccess: true,
    Data: result,
    ErrorMessage: null,
  });
});
```

### Response Builder Utility

```typescript
// src/core/mocks/utils/response.ts
import type { BackendApiResponse } from "@/core/types/api.types";

export function successResponse<T>(data: T): BackendApiResponse<T> {
  return {
    IsSuccess: true,
    Data: data,
    ErrorMessage: null,
  };
}

export function errorResponse(
  message: string,
  statusCode: number = 400
): { response: BackendApiResponse<null>; status: number } {
  return {
    response: {
      IsSuccess: false,
      Data: null,
      ErrorMessage: message,
    },
    status: statusCode,
  };
}

// Usage
http.get("/api/v1/roles", async () => {
  await delay(500);
  return HttpResponse.json(successResponse(mockRoles));
});

http.get("/api/v1/roles/:id", async ({ params }) => {
  const role = mockRoles.find((r) => r.Id === Number(params.id));

  if (!role) {
    const { response, status } = errorResponse("Role not found", 404);
    return HttpResponse.json(response, { status });
  }

  return HttpResponse.json(successResponse(role));
});
```

### Delay Utility with Variance

```typescript
// src/core/mocks/utils/delay.ts
import { mockConfig } from "../config";

export const delay = (ms?: number) => {
  const delayTime =
    ms ??
    Math.random() * (mockConfig.delayMax - mockConfig.delayMin) +
      mockConfig.delayMin;

  return new Promise((resolve) => setTimeout(resolve, delayTime));
};

// Usage
http.get("/api/v1/roles", async () => {
  await delay(); // Random delay between 300-800ms
  return HttpResponse.json(successResponse(mockRoles));
});
```

## Debugging

### Enable Request Logging

```typescript
// src/core/mocks/browser.ts
await worker.start({
  onUnhandledRequest: "warn", // Logs unhandled requests
  serviceWorker: {
    url: "/mockServiceWorker.js",
  },
});
```

Console output:

```
[MSW] Warning: captured a request without a matching request handler:
  • GET http://localhost:3000/api/v1/users
```

### List Active Handlers

Open browser console and run:

```javascript
worker.listHandlers();
```

### Temporarily Disable MSW

```bash
# .env.local
NEXT_PUBLIC_ENABLE_MOCKS=false
```

Restart dev server.

## Testing Integration

MSW handlers can be reused in tests:

```typescript
// tests/setup.ts
import { setupServer } from "msw/node";
import { handlers } from "@/core/mocks/handlers";

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Migration Path

When backend endpoints become available:

### Option 1: Disable All Mocks

```bash
# .env.local
NEXT_PUBLIC_ENABLE_MOCKS=false
```

### Option 2: Selective Bypass

```typescript
// src/core/mocks/handlers.ts
import { roleHandlers } from "@/modules/role/mocks/handlers";
import { userHandlers } from "@/modules/user/mocks/handlers";

export const handlers = [
  // ...roleHandlers, // Comment out when backend ready
  ...userHandlers, // Keep mocking until backend ready
];
```

### Option 3: Environment-Based Handlers

```typescript
// src/core/mocks/handlers.ts
const mockRoles = process.env.NEXT_PUBLIC_MOCK_ROLES === "true";
const mockUsers = process.env.NEXT_PUBLIC_MOCK_USERS === "true";

export const handlers = [
  ...(mockRoles ? roleHandlers : []),
  ...(mockUsers ? userHandlers : []),
];
```

## Performance Considerations

- **Bundle size:** MSW is ~50KB in development, 0KB in production (tree-shaken)
- **Service worker overhead:** Negligible (~1-5ms per request)
- **Memory:** Mock data stored in JavaScript heap (efficient for <1000 records)

## Security

- MSW never runs in production (multiple guards prevent this)
- Service worker only intercepts same-origin requests
- No sensitive data should be in mock files (use .gitignore if needed)
- Environment variables with `NEXT_PUBLIC_` are visible in browser source

## Summary

This implementation provides:
✅ Zero race conditions (MSW ready before first render)
✅ Zero client-side state management
✅ Zero production bundle impact
✅ Type-safe mock responses
✅ Realistic network simulation
✅ Easy debugging and testing
✅ Scalable for multiple modules

The key insight: Use Next.js 15's async Server Components to initialize MSW before rendering, eliminating timing issues entirely.

```

```
