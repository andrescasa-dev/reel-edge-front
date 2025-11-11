# Backend Communication Architecture

This project implements a clean architecture approach for frontend-backend communication following functional programming principles.

## API Overview

The application communicates with the **Casino Research Assistant API** (v1.0.0), which provides endpoints for:

- **Dashboard**: State-level statistics and research status management
- **Missing Casinos**: Discovery of casinos found in regulatory sources but missing from database
- **Promotions**: Comparison and management of promotional offers across NJ, MI, PA, and WV jurisdictions

**Base URL**: Configured via `NEXT_PUBLIC_API_BASE_URL` environment variable
**Authentication**: NextAuth.js session cookie (automatically included in requests)

## Architecture Overview

The communication layer is structured in three distinct layers:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │      Hooks       │    │    Services     │
│                 │───▶│                 │───▶│                 │
│  (UI Layer)     │    │ (Data Fetching) │    │ (API Calls)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Adapters     │◀───│   HTTP Client   │◀───│   Backend API   │
│                 │    │                 │    │                 │
│ (Data Transform)│    │ (Low-level HTTP)│    │ (External API)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Layer Responsibilities

### 1. HTTP Client Layer (`core/services/http-client.ts`)

**Purpose**: Low-level HTTP communication wrapper

**Features**:

- Functional approach with pure functions
- Automatic backend response transformation (`IsSuccess` → `success`, `Data` → `data`)
- Timeout handling and error management
- Type-safe generic methods: `get<T>()`, `post<T>()`, `put<T>()`, `patch<T>()`, `delete<T>()`
- Query parameter building with Date object support
- **Note**: PATCH method should be added to httpClient if not already present

**Example**:

```typescript
// Dashboard endpoint
const response = await httpClient.get<{
  data: BackendStateStats[];
  timestamp: string;
}>("/dashboard/state-stats");

// Paginated endpoint
const response = await httpClient.get<{
  data: BackendMissingCasino[];
  pagination: BackendPagination;
}>("/missing-casinos", { state: "NJ", limit: 50, offset: 0 });
```

### 2. Service Layer (`modules/{domain}/services/`)

**Purpose**: Domain-specific API calls and business logic

**Features**:

- Encapsulates API endpoints for specific domains
- Provides clean interface for hooks
- Handles domain-specific query parameters
- Ready for future CRUD operations

**Example**:

```typescript
// Dashboard Service
export const dashboardService = {
  getStateStats: () =>
    httpClient.get<{ data: BackendStateStats[]; timestamp: string }>(
      "/dashboard/state-stats"
    ),

  updateResearchStatus: (action: "start" | "stop") =>
    httpClient.post<{
      success: boolean;
      message: string;
      status: "researching" | "idle";
    }>("/dashboard/research-status", { action }),
};

// Missing Casinos Service
export const missingCasinosService = {
  getMissingCasinos: (params?: MissingCasinosQueryParams) =>
    httpClient.get<{
      data: BackendMissingCasino[];
      pagination: BackendPagination;
    }>("/missing-casinos", params),
};

// Promotions Service
export const promotionsService = {
  getComparisons: (params?: PromotionComparisonsQueryParams) =>
    httpClient.get<{
      data: BackendPromotionComparison[];
      pagination: BackendPagination;
    }>("/promotions/comparisons", params),

  updateComparison: (
    comparisonId: string,
    action: "update" | "add" | "ignore",
    notes?: string
  ) =>
    httpClient.patch<{
      success: boolean;
      message: string;
      comparison: BackendPromotionComparison;
    }>(`/promotions/comparisons/${comparisonId}`, { action, notes }),
};
```

### 3. Adapter Layer (`modules/{domain}/adapters/`)

**Purpose**: Data transformation between backend and frontend formats

**Features**:

- Pure functions with no side effects
- Field name conversion (PascalCase → camelCase)
- Date transformation (ISO strings → Date objects)
- Immutable data transformations

**Example**:

```typescript
// State Adapter
export function stateAdapter(backendState: BackendState): State {
  return {
    abbreviation: backendState.Abbreviation,
    name: backendState.Name,
  };
}

// Missing Casino Adapter
export function missingCasinoAdapter(
  backendCasino: BackendMissingCasino
): MissingCasino {
  return {
    id: backendCasino.id,
    name: backendCasino.name,
    state: stateAdapter(backendCasino.state),
    source: backendCasino.source,
    promotionsFound: backendCasino.promotionsFound,
    discoveredAt: new Date(backendCasino.discoveredAt), // Transform ISO string to Date
    website: backendCasino.website,
    regulatoryId: backendCasino.regulatoryId,
  };
}

// Pagination Adapter
export function paginationAdapter(
  backendPagination: BackendPagination
): Pagination {
  return {
    total: backendPagination.total,
    limit: backendPagination.limit,
    page: backendPagination.page,
    totalPages: backendPagination.totalPages,
    hasNext: backendPagination.hasNext,
    hasPrevious: backendPagination.hasPrevious,
  };
}

// Missing Casinos Paginated Response Adapter
export function missingCasinosPaginatedAdapter(backendResponse: {
  data: BackendMissingCasino[];
  pagination: BackendPagination;
}): PaginatedResponse<MissingCasino> {
  return {
    data: backendResponse.data.map(missingCasinoAdapter),
    pagination: paginationAdapter(backendResponse.pagination),
  };
}

// Promotion Comparison Adapter
export function promotionComparisonAdapter(
  backendComparison: BackendPromotionComparison
): PromotionComparison {
  return {
    id: backendComparison.id,
    casino: casinoAdapter(backendComparison.casino),
    currentPromotion: backendComparison.currentPromotion
      ? promotionAdapter(backendComparison.currentPromotion)
      : null,
    discoveredPromotion: promotionAdapter(
      backendComparison.discoveredPromotion
    ),
    comparisonType: backendComparison.comparisonType,
    status: backendComparison.status,
    createdAt: new Date(backendComparison.createdAt),
    updatedAt: new Date(backendComparison.updatedAt),
  };
}
```

### 4. Hook Layer (`modules/{domain}/hooks/`)

**Purpose**: React Query integration and state management

**Features**:

- Automatic caching and background updates
- Loading and error state handling
- Optimistic updates support
- Query invalidation strategies

**Example**:

```typescript
// Dashboard Hook
export function useStateStats() {
  return useQuery({
    queryKey: ["dashboard", "state-stats"],
    queryFn: async () => {
      const response = await dashboardService.getStateStats();

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch state stats");
      }

      return {
        data: response.data.data.map(stateStatsAdapter),
        timestamp: new Date(response.data.timestamp),
      };
    },
  });
}

// Missing Casinos Hook
export function useMissingCasinos(params?: MissingCasinosQueryParams) {
  return useQuery({
    queryKey: ["missing-casinos", params],
    queryFn: async () => {
      const response = await missingCasinosService.getMissingCasinos(params);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch missing casinos");
      }

      return missingCasinosPaginatedAdapter(response.data);
    },
  });
}

// Promotion Comparisons Hook
export function usePromotionComparisons(
  params?: PromotionComparisonsQueryParams
) {
  return useQuery({
    queryKey: ["promotions", "comparisons", params],
    queryFn: async () => {
      const response = await promotionsService.getComparisons(params);

      if (!response.success) {
        throw new Error(
          response.error || "Failed to fetch promotion comparisons"
        );
      }

      return {
        data: response.data.data.map(promotionComparisonAdapter),
        pagination: paginationAdapter(response.data.pagination),
      };
    },
  });
}

// Mutation Hook for Updating Research Status
export function useUpdateResearchStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "start" | "stop") =>
      dashboardService.updateResearchStatus(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// Mutation Hook for Updating Promotion Comparison
export function useUpdatePromotionComparison() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comparisonId,
      action,
      notes,
    }: {
      comparisonId: string;
      action: "update" | "add" | "ignore";
      notes?: string;
    }) => promotionsService.updateComparison(comparisonId, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promotions", "comparisons"],
      });
    },
  });
}
```

## Data Flow

1. **Component** calls hook (e.g., `useMissingCasinos()`)
2. **Hook** calls service method (e.g., `missingCasinosService.getMissingCasinos()`)
3. **Service** calls HTTP client (e.g., `httpClient.get()`)
4. **HTTP Client** makes API request and transforms response format (`IsSuccess` → `success`, `Data` → `data`)
5. **Service** returns transformed response
6. **Hook** calls adapter to transform data structure (PascalCase → camelCase, ISO strings → Date objects)
7. **Adapter** returns frontend-formatted data
8. **Hook** provides data to component with loading/error states

## Type Safety

The architecture maintains full TypeScript coverage:

- **Global Types** (`core/types/api.types.ts`): Shared API response formats
- **Domain Types** (`modules/{domain}/types/`): Domain-specific interfaces
- **Backend Types**: Separate interfaces for backend data structures matching API schema
  - Backend types use mixed casing (PascalCase for nested objects like `State.Abbreviation`, `Casino.Name`, `Promotion.Offer_Name`)
  - Backend types use camelCase for top-level fields (e.g., `comparisonType`, `createdAt`)
- **Frontend Types**: Clean interfaces for UI consumption (consistent camelCase)

### Key Type Mappings

- **State**: `{ Abbreviation: string, Name: string }` → `{ abbreviation: string, name: string }`
- **Pagination**: `{ total, limit, page, totalPages, hasNext, hasPrevious }` (consistent across backend/frontend)
- **Dates**: ISO strings (`"2024-01-01T00:00:00Z"`) → `Date` objects
- **Enums**:
  - States: `"NJ" | "MI" | "PA" | "WV"`
  - Research Status: `"researching" | "idle"`
  - Comparison Type: `"better" | "alternative" | "new"`
  - Comparison Status: `"pending" | "updated" | "reviewed" | "ignored"`

## Key Principles

### Functional Programming

- Pure functions in adapters
- Immutable data transformations
- No side effects in data flow
- Composable functions

### Clean Architecture

- Dependencies flow inward (UI → Hooks → Services → HTTP Client)
- Clear separation of concerns
- Domain-driven module organization
- Reusable core infrastructure

### Error Handling

- Unified error format across all layers
- Graceful degradation
- Type-safe error propagation
- User-friendly error messages

## Usage Examples

### Dashboard Component

```typescript
function DashboardPage() {
  const { data, isLoading, error } = useStateStats();
  const updateStatus = useUpdateResearchStatus();

  if (error) return <ErrorComponent error={error} />;
  if (isLoading) return <LoadingSpinner />;

  const handleToggleResearch = () => {
    const action = data?.data[0]?.status === "researching" ? "stop" : "start";
    updateStatus.mutate(action);
  };

  return (
    <div>
      <button onClick={handleToggleResearch}>
        {data?.data[0]?.status === "researching" ? "Stop" : "Start"} Research
      </button>
      <StateStatsTable data={data?.data} />
    </div>
  );
}
```

### Missing Casinos Component

```typescript
function MissingCasinosPage() {
  const [filters, setFilters] = useState({ state: "NJ", limit: 50, offset: 0 });
  const { data, isLoading, error } = useMissingCasinos(filters);

  if (error) return <ErrorComponent error={error} />;
  if (isLoading) return <LoadingSpinner />;

  return (
    <Table
      dataSource={data?.data}
      pagination={{
        current: data?.pagination.page,
        total: data?.pagination.total,
        pageSize: data?.pagination.limit,
        showSizeChanger: true,
      }}
    />
  );
}
```

### Promotion Comparisons Component

```typescript
function PromotionComparisonsPage() {
  const [filters, setFilters] = useState({
    status: "pending",
    page: 1,
    limit: 10,
  });
  const { data, isLoading, error } = usePromotionComparisons(filters);
  const updateComparison = useUpdatePromotionComparison();

  if (error) return <ErrorComponent error={error} />;
  if (isLoading) return <LoadingSpinner />;

  const handleAction = (
    comparisonId: string,
    action: "update" | "add" | "ignore"
  ) => {
    updateComparison.mutate({ comparisonId, action });
  };

  return (
    <ComparisonsTable
      data={data?.data}
      onAction={handleAction}
      pagination={{
        current: data?.pagination.page,
        total: data?.pagination.total,
        pageSize: data?.pagination.limit,
      }}
    />
  );
}
```

## API Endpoints Reference

### Dashboard Endpoints

- `GET /dashboard/state-stats` - Get state-level statistics
  - Returns: `{ data: StateStats[], timestamp: string }`
- `POST /dashboard/research-status` - Update global research status
  - Body: `{ action: "start" | "stop" }`
  - Returns: `{ success: boolean, message: string, status: "researching" | "idle" }`

### Missing Casinos Endpoints

- `GET /missing-casinos` - List missing casinos
  - Query params: `state?`, `search?`, `limit?`, `offset?`
  - Returns: `{ data: MissingCasino[], pagination: Pagination }`

### Promotions Endpoints

- `GET /promotions/comparisons` - List promotion comparisons
  - Query params: `casino?`, `state?`, `offer_type?`, `insight?`, `status?`, `promotion_id?`, `limit?`, `page?`
  - Returns: `{ data: PromotionComparison[], pagination: Pagination }`
- `PATCH /promotions/comparisons/{comparisonId}` - Update promotion comparison status
  - Body: `{ action: "update" | "add" | "ignore", notes?: string }`
  - Returns: `{ success: boolean, message: string, comparison: PromotionComparison }`

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.casinoresearch.com/v1
# or for staging:
# NEXT_PUBLIC_API_BASE_URL=https://staging-api.casinoresearch.com/v1
```

### Query Client Setup

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && "status" in error) {
          const status = (error as Error & { status: number }).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
    },
  },
});
```

## Benefits

- **Maintainability**: Clear separation of concerns and consistent patterns
- **Scalability**: Easy to add new domains and API endpoints
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Developer Experience**: Clean APIs and automatic state management
- **Performance**: Intelligent caching and background updates
- **Testability**: Pure functions are easy to unit test
