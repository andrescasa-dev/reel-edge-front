# Project Structure

## Overview

This document defines the architectural structure for the Next.js application. The project follows a **modular architecture** that emphasizes **separation of concerns**, **scalability**, and **maintainability**. The structure is designed to support long-term growth while maintaining clear boundaries between features and shared infrastructure.

## Core Principles

1. **Modular Architecture**: Features are organized into self-contained modules
2. **Clear Boundaries**: Strict separation between routing (Next.js App Router) and business logic
3. **Server-First**: Pages are server-side by default, with client components only when necessary
4. **CSS Modules**: All styles are scoped using CSS modules
5. **Barrel Exports**: Use barrel files (`index.ts`) to simplify imports and bubble up exports

## Directory Structure

```
src/
├── app/                    # Next.js App Router - Routing only
│   ├── layout.tsx         # Root layout (server component)
│   ├── page.tsx           # Home page (server component)
│   ├── globals.css        # Global styles
│   ├── (routes)/          # Route groups
│   │   ├── users/
│   │   │   ├── page.tsx   # Users page - composes module components
│   │   │   └── layout.tsx # Users layout (if needed)
│   │   └── ...
│   └── ...
├── core/                   # Global/shared infrastructure
│   ├── components/        # Shared UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts   # Barrel export
│   │   ├── Input/
│   │   └── ...
│   │   └── index.ts       # Barrel export (bubbles up)
│   ├── services/          # Global services (API clients, etc.)
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── adapters/          # Data adapters/transformers
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── hooks/             # Shared React hooks
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   ├── types/             # Global TypeScript types
│   │   ├── api.ts
│   │   └── index.ts
│   ├── constants/         # Global constants
│   │   └── index.ts
│   └── index.ts           # Main barrel export
├── modules/               # Feature modules (domain slices)
│   ├── users/             # Users module
│   │   ├── components/    # Module-specific components
│   │   │   ├── UserCard/
│   │   │   │   ├── UserCard.tsx
│   │   │   │   ├── UserCard.module.css
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── services/      # Module-specific services
│   │   │   ├── userService.ts
│   │   │   └── index.ts
│   │   ├── hooks/         # Module-specific hooks
│   │   │   ├── useUser.ts
│   │   │   └── index.ts
│   │   ├── types/         # Module-specific types
│   │   │   ├── user.types.ts
│   │   │   └── index.ts
│   │   ├── utils/         # Module-specific utilities
│   │   │   └── index.ts
│   │   └── index.ts       # Module barrel export
│   ├── auth/              # Authentication module
│   ├── dashboard/          # Dashboard module
│   └── ...
└── stories/               # Storybook stories (optional)
```

## Detailed Structure Rules

### 1. App Router (`src/app/`)

**Purpose**: Routing and page composition only

**Rules**:
- **NO business logic** - Pages should only compose components from modules
- **NO component implementations** - All components live in `core/` or `modules/`
- **Server components by default** - Use `'use client'` directive only when necessary
- **Minimal code** - Pages should be thin wrappers that compose module components

**Example**:

```typescript
// ✅ GOOD: app/users/page.tsx
import { UsersList } from '@/modules/users';

export default function UsersPage() {
  return <UsersList />;
}

// ❌ BAD: Business logic in page
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  // ... fetch logic, state management, etc.
}
```

**Client Components in App Router**:
- Use `'use client'` directive at the top of the file when:
  - Using React hooks (`useState`, `useEffect`, etc.)
  - Using browser-only APIs
  - Handling user interactions (onClick, onChange, etc.)
  - Using context providers

```typescript
// app/users/page.tsx
'use client';

import { UsersList } from '@/modules/users';

export default function UsersPage() {
  // Client-side logic here
}
```

### 2. Core (`src/core/`)

**Purpose**: Global, shared infrastructure used across multiple modules

**Contents**:
- **components/**: Reusable UI components (Button, Input, Modal, etc.)
- **services/**: Global services (API clients, authentication, etc.)
- **adapters/**: Data transformation/adaptation logic
- **utils/**: Utility functions used across modules
- **hooks/**: Shared React hooks
- **types/**: Global TypeScript types and interfaces
- **constants/**: Application-wide constants

**Rules**:
- Should be **framework-agnostic** when possible (pure functions, utilities)
- Components should be **composable** and **reusable**
- No module-specific logic should live here
- Each folder should have an `index.ts` barrel export

**Example Structure**:

```
core/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Button.test.tsx
│   │   └── index.ts          # export { Button } from './Button';
│   └── index.ts               # export * from './Button';
```

### 3. Modules (`src/modules/`)

**Purpose**: Feature-specific slices of the application

**Structure**: Each module is self-contained with its own:
- `components/` - Module-specific UI components
- `services/` - Module-specific business logic and API calls
- `hooks/` - Module-specific React hooks
- `types/` - Module-specific TypeScript types
- `utils/` - Module-specific utilities
- `index.ts` - Module barrel export

**Rules**:
- Modules should be **loosely coupled** - minimal dependencies on other modules
- Modules can depend on `core/` but should avoid depending on other modules
- Each module should export its public API through `index.ts`
- Module components can be composed in App Router pages

**Example Module**:

```
modules/users/
├── components/
│   ├── UserCard/
│   │   ├── UserCard.tsx
│   │   ├── UserCard.module.css
│   │   └── index.ts
│   ├── UsersList/
│   │   ├── UsersList.tsx
│   │   ├── UsersList.module.css
│   │   └── index.ts
│   └── index.ts
├── services/
│   ├── userService.ts
│   └── index.ts
├── hooks/
│   ├── useUser.ts
│   ├── useUsers.ts
│   └── index.ts
├── types/
│   ├── user.types.ts
│   └── index.ts
└── index.ts                 # Public API: export * from './components';
```

### 4. Styling with CSS Modules

**Rules**:
- **All styles** must use CSS modules (`.module.css`)
- One CSS module per component file
- CSS modules should be co-located with their components
- Global styles only in `app/globals.css` for reset, variables, etc.

**Example**:

```typescript
// components/Button/Button.tsx
import styles from './Button.module.css';

export function Button({ children }: ButtonProps) {
  return <button className={styles.button}>{children}</button>;
}
```

```css
/* components/Button/Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
```

### 5. Barrel Exports

**Purpose**: Simplify imports and create clear public APIs

**Rules**:
- Every folder with multiple files should have an `index.ts` barrel export
- Barrel files should **bubble up** exports from subdirectories
- Use `export *` for re-exports, or `export { Component }` for named exports
- Prefer named exports over default exports for better tree-shaking

**Example Barrel Pattern**:

```typescript
// core/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

// core/components/index.ts (bubbles up)
export * from './Button';
export * from './Input';
export * from './Modal';

// core/index.ts (main barrel)
export * from './components';
export * from './services';
export * from './utils';
```

**Usage**:

```typescript
// ✅ GOOD: Clean imports via barrels
import { Button, Input } from '@/core/components';
import { UsersList } from '@/modules/users';

// ❌ BAD: Deep imports
import { Button } from '@/core/components/Button/Button';
```

## Import Paths

Use TypeScript path aliases configured in `tsconfig.json`:

```typescript
// ✅ GOOD
import { Button } from '@/core/components';
import { UsersList } from '@/modules/users';
import { formatDate } from '@/core/utils';

// ❌ BAD: Relative paths
import { Button } from '../../../core/components/Button';
```

## Component Organization

### Component Structure

Each component should follow this structure:

```
ComponentName/
├── ComponentName.tsx       # Component implementation
├── ComponentName.module.css # Component styles
├── ComponentName.test.tsx  # Component tests (optional)
├── ComponentName.stories.tsx # Storybook stories (optional)
└── index.ts                # Barrel export
```

### Component Naming

- **PascalCase** for component files and folders
- **Descriptive names** that indicate purpose
- **Consistent naming** across the codebase

## Server vs Client Components

### Server Components (Default)

- **No** `'use client'` directive
- Can directly access backend resources (databases, APIs)
- Can use async/await for data fetching
- Cannot use React hooks or browser APIs
- Better performance and SEO

### Client Components

- **Must** have `'use client'` directive at the top
- Can use React hooks (`useState`, `useEffect`, etc.)
- Can handle user interactions
- Can use browser APIs
- Use sparingly - prefer server components when possible

**Guideline**: Start with server components, add `'use client'` only when needed.

## Module Boundaries

### What Belongs in a Module?

A module should represent a **domain slice** or **feature**:
- **users** - User management, profiles, authentication
- **dashboard** - Dashboard views and widgets
- **products** - Product catalog, details, search
- **orders** - Order management, checkout flow

### Module Dependencies

- ✅ Modules can import from `core/`
- ✅ Modules can import from other modules (but minimize this)
- ❌ `core/` should NOT import from modules
- ❌ App Router should NOT import directly from module internals (use barrel exports)

## Testing Structure

Tests should be co-located with their source files:

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx  # Unit tests
└── ComponentName.module.css
```

Or in a `__tests__` folder for complex modules:

```
modules/users/
├── __tests__/
│   ├── userService.test.ts
│   └── useUser.test.ts
```

## Best Practices

1. **Keep App Router thin** - Pages should only compose components
2. **Favor server components** - Use client components only when necessary
3. **Use barrel exports** - Simplify imports and create clear APIs
4. **CSS modules everywhere** - Scoped styles prevent conflicts
5. **Clear module boundaries** - Each module is a self-contained feature slice
6. **Type safety** - Use TypeScript types from `core/types` and module `types/`
7. **Co-location** - Keep related files together (component + styles + tests)

## Migration Strategy

When refactoring existing code:

1. Identify feature boundaries
2. Move business logic from `app/` to appropriate modules
3. Extract shared code to `core/`
4. Create barrel exports for clean imports
5. Convert styles to CSS modules
6. Add `'use client'` directives where needed

## Summary

This structure promotes:
- **Maintainability**: Clear boundaries and organization
- **Scalability**: Easy to add new modules and features
- **Developer Experience**: Clean imports, clear patterns
- **Performance**: Server components by default, optimal bundle sizes
- **Type Safety**: TypeScript throughout with clear type boundaries

