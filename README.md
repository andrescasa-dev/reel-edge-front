[![Captura-de-pantalla-2025-11-11-041118.png](https://i.postimg.cc/25mRbv62/Captura-de-pantalla-2025-11-11-041118.png)](https://postimg.cc/nXdwNXqD)

# Casino Research Assistant Frontend

A Next.js application for managing and visualizing casino research data across multiple US states (NJ, MI, PA, WV). The application provides interfaces for tracking missing casinos, comparing promotional offers, and monitoring research status.

## Quick Start

**Note**: It's recommended to start the backend first on port 3000, then run the frontend on port 3001.

```bash
npm install
npm run dev -- -p 3001
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_ENABLE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000
```

`NEXT_PUBLIC_ENABLE_MOCKS` enables MSW (Mock Service Worker) to intercept API requests and return mock data, useful for frontend development without a backend. Set to `false` when connecting to a real API.

Open [http://localhost:3001](http://localhost:3001) in your browser. The home route is `/dashboard`.

## Setup

### Prerequisites

- Node.js 20 or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_ENABLE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000
```

- `NEXT_PUBLIC_ENABLE_MOCKS`: Enable MSW mocking (set to `false` for production)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (accessible in browser)
- `API_BASE_URL`: Backend API base URL (server-side only)

### Development

**Note**: It's recommended to start the backend first on port 3000, then run the frontend on port 3001.

```bash
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001) in your browser. The home route is `/dashboard`.

### Production Build

```bash
npm run build
npm start
```

### Storybook

```bash
npm run storybook
```

## Architecture

### Modular Structure

The project follows a modular architecture with clear separation of concerns:

- **`src/app/`**: Next.js App Router - routing and page composition only
- **`src/core/`**: Shared infrastructure (components, services, utilities, types)
- **`src/modules/`**: Feature modules organized by domain (dashboard, missing-casinos, promotions)

### Communication Layer

The frontend-backend communication is structured in four layers:

1. **HTTP Client** (`core/services/http-client.ts`): Low-level HTTP wrapper with automatic response transformation
2. **Services** (`modules/{domain}/services/`): Domain-specific API calls
3. **Adapters** (`modules/{domain}/adapters/`): Data transformation between backend (PascalCase) and frontend (camelCase) formats
4. **Hooks** (`modules/{domain}/hooks/`): React Query integration for data fetching and caching

### Key Technical Decisions

**Server Components First**: Pages default to server components, using client components only when necessary (interactivity, hooks, browser APIs).

**CSS Modules**: All component styles use CSS modules for scoped styling and preventing conflicts.

**Barrel Exports**: Consistent use of `index.ts` files to create clean public APIs and simplify imports.

**MSW for Development**: Mock Service Worker initializes in the root layout before rendering to prevent race conditions, enabling frontend development without a backend.

**TanStack Query**: Handles data fetching, caching, background updates, and optimistic updates with minimal boilerplate.

**Functional Programming**: Adapters use pure functions for immutable data transformations, ensuring predictable behavior.

## AI Tools and Models

This frontend application does not use AI tools or models directly. The application is a data visualization and management interface that communicates with a backend API. Any AI processing would occur on the backend service, not in this frontend codebase.

# Screenshots

[![Captura-de-pantalla-2025-11-11-041855.png](https://i.postimg.cc/xCvPkJXG/Captura-de-pantalla-2025-11-11-041855.png)](https://postimg.cc/MMGBNGbX)
[![Captura-de-pantalla-2025-11-11-041253.png](https://i.postimg.cc/j5HD6yQW/Captura-de-pantalla-2025-11-11-041253.png)](https://postimg.cc/7GLPwGRD)
[![Captura-de-pantalla-2025-11-11-041133.png](https://i.postimg.cc/5yjM9V0V/Captura-de-pantalla-2025-11-11-041133.png)](https://postimg.cc/Fkt6Gw3W)
