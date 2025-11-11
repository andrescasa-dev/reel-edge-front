# API Communication Guide

This document describes how the Casino Research Assistant application communicates with the backend API for each view.

## Table of Contents

1. [Dashboard View](#dashboard-view)
2. [Missing Casinos View](#missing-casinos-view)
3. [Promotions View](#promotions-view)
4. [Authentication](#authentication)
5. [Error Handling](#error-handling)

---

## Dashboard View

### Initial Data Load

**Endpoint:** `GET /dashboard/state-stats`

**Purpose:** Load aggregated statistics for all states (NJ, MI, PA, WV) to display in the dashboard cards.

**When Called:**

- On application build each day (Next.js ISR)
- On manual refresh, user click Run Research (revalidate all ISR paths with Next.js)

**Request:**

```http
GET /dashboard/state-stats
```

**Response Example:**

```json
{
  "data": [
    {
      "state": {
        "Abbreviation": "NJ",
        "Name": "New Jersey"
      },
      "casinosTracked": 25,
      "promotionsActive": 87,
      "lastUpdated": "2025-11-09T10:30:00Z",
      "status": "idle",
      "missingCasinos": 3,
      "pendingComparisons": 12
    }
  ],
  "timestamp": "2025-11-09T10:30:00Z"
}
```

**UI Integration:**

- Display each state in a separate card
- Show casino and promotion counts
- Display last updated timestamp
- Show global research status badge (applies to all states)
- Display a single "Start Research" button that triggers research for all states simultaneously
- Enable/disable "Start Research" button based on global research status

---

### Start/Stop Research

**Endpoint:** `POST /dashboard/research-status`

**Purpose:** Trigger or stop the automated research process for all states (NJ, MI, PA, WV) simultaneously.

**When Called:**

- When user clicks the global "Start Research" button (single button for all states)
- When user clicks "Stop Research" button (if research is in progress)

**Request Example:**

```http
POST /dashboard/research-status
Content-Type: application/json

{
  "action": "start"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Research started for all states",
  "status": "researching"
}
```

**UI Integration:**

- Show toast notification with success/error message
- Update global research status indicator to "researching"
- Optionally show loading indicator
- Disable "Start Research" button and enable "Stop Research" button
- Display research status across all state cards

**Polling During Research:**
After starting research, poll `GET /dashboard/state-stats` every 30-60 seconds to get updated statistics while research is in progress. Continue polling until the status changes to "idle".

**After Research Completion:**
When research status changes to "idle" (research complete), provide the user with an option to reload the entire application to see the new results. This ensures all views (Dashboard, Missing Casinos, Promotions) display the latest data.

---

## Missing Casinos View

### List Missing Casinos

**Endpoint:** `GET /missing-casinos`

**Purpose:** Load the list of casinos found in regulatory sources but not present in the database.

**When Called:**

- On application build each day (Next ISR)
- When user changes filters (state, search query)
- When the user reach the limit and want to load more.

**Request Example (with filters):**

```http
GET /missing-casinos?state=NJ&search=golden&limit=50&offset=0
```

**Query Parameters:**

- `state` (optional): Filter by state abbreviation (NJ, MI, PA, WV)
- `search` (optional): Search term for casino name
- `limit` (optional): Number of results per page (default: 50, max: 100)
- `offset` (optional): Number of results to skip for pagination (default: 0)

**Response Example:**

```json
{
  "data": [
    {
      "id": "mc-123",
      "name": "Golden Nugget Online Casino",
      "state": {
        "Abbreviation": "NJ",
        "Name": "New Jersey"
      },
      "source": "NJ Gaming Commission",
      "promotionsFound": 5,
      "discoveredAt": "2025-11-08T14:22:00Z",
      "website": "https://www.goldennugget.com",
      "regulatoryId": "NJ-GC-2024-0156"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 50,
    "offset": 0,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

**UI Integration:**

- Display casinos in either list or card view mode
- Show total count: "Showing X of Y casinos"
- Apply client-side filtering if needed for better UX
- Implement infinite list with Tankstack

**Filter Behavior:**

- **State Filter:** When changed, make new API call with `state` parameter
- **Search Input:** Debounce input (300-500ms), then make API call with `search` parameter
- **View Mode Toggle:** Client-side only, no API call needed

---

### Casino Click Navigation

**Endpoint:** None (client-side routing)

**Purpose:** Navigate to Promotions view with casino filter pre-applied.

**When Called:**

- When user clicks on any casino card or list item

## Promotions View

### List Promotion Comparisons

**Endpoint:** `GET /promotions/comparisons`

**Purpose:** Load promotion comparisons between current database promotions and newly discovered promotions.

**When Called:**

- On application build each day ISR with Next.js
- When any filter changes (casino, state, offer type, insight, search)
- When user changes page (pagination)
- After user performs an action (update/add/ignore) to refresh the list

**Request Example (with all filters):**

```http
GET /promotions/comparisons?casino=Golden%20Nugget&state=NJ&offer_type=Deposit%20Bonus&insight=better&promotion_id=A3B7F2&status=pending&limit=10&page=1
```

**Query Parameters:**

- `casino` (optional): Filter by casino name
- `state` (optional): Filter by state (NJ, MI, PA, WV)
- `offer_type` (optional): Filter by offer type
- `insight` (optional): Filter by comparison type (better, alternative, new)
- `promotion_id` (optional): Search by promotion ID
- `status` (optional): Filter by status (pending, updated, reviewed, ignored) - default: "pending"
- `limit` (optional): Results per page (default: 10, max: 100)
- `page` (optional): Page number (1-based, default: 1)

**Response Example:**

```json
{
  "data": [
    {
      "id": "A3B7F2",
      "casino": {
        "casinodb_id": 101,
        "Name": "Golden Nugget",
        "state": {
          "Abbreviation": "NJ",
          "Name": "New Jersey"
        }
      },
      "currentPromotion": {
        "Offer_Name": "Welcome Bonus 100% Match",
        "offer_type": "Deposit Bonus",
        "Expected_Deposit": 50,
        "Expected_Bonus": 50,
        "terms_and_conditions": "...",
        "wagering_requirements": "10x",
        "valid_from": "2025-01-01T00:00:00Z",
        "valid_until": "2025-12-31T23:59:59Z"
      },
      "discoveredPromotion": {
        "Offer_Name": "Welcome Bonus 150% Match",
        "offer_type": "Deposit Bonus",
        "Expected_Deposit": 50,
        "Expected_Bonus": 75,
        "terms_and_conditions": "...",
        "wagering_requirements": "10x",
        "valid_from": "2025-11-01T00:00:00Z",
        "valid_until": "2025-12-31T23:59:59Z"
      },
      "comparisonType": "better",
      "status": "pending",
      "createdAt": "2025-11-09T08:00:00Z",
      "updatedAt": "2025-11-09T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 87,
    "limit": 10,
    "page": 1,
    "totalPages": 9,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

**UI Integration:**

- Display promotions in table format
- Show pagination controls
- Update URL query parameters when filters change (optional, for bookmarking)
- Show loading state during API calls
- Display "Showing X to Y of Z" based on pagination data

**Filter Behavior:**

- **ID Search:** Debounce input (300-500ms), then make API call
- **Select Filters (Casino, State, Offer Type, Insight):** Make immediate API call when changed
- **Pagination:** Make API call with updated page number when page changes
- Always reset to page=1 when changing filters

**Default State:**

- Load with `status=pending` to show only pending comparisons

---

### Update Promotion Comparison

**Endpoint:** `PATCH /promotions/comparisons/{comparisonId}`

**Purpose:** Update the status of a promotion comparison when user takes action.

**When Called:**

- When user clicks "Update" button (for better/alternative comparisons)
- When user clicks "Add" button (for new promotions)
- When user clicks "Ignore" button (X icon)

**Request Examples:**

**Update Action:**

```http
PATCH /promotions/comparisons/A3B7F2
Content-Type: application/json

{
  "action": "update",
  "notes": "Updated to reflect better bonus amount"
}
```

**Add Action:**

```http
PATCH /promotions/comparisons/B8C3D1
Content-Type: application/json

{
  "action": "add",
  "notes": "New promotion added to database"
}
```

**Ignore Action:**

```http
PATCH /promotions/comparisons/C9E2F5
Content-Type: application/json

{
  "action": "ignore",
  "notes": "Not relevant for current campaign"
}
```

**Response Example:**

```json
{
  "success": true,
  "message": "Promotion comparison updated successfully",
  "comparison": {
    "id": "A3B7F2",
    "status": "updated",
    "updatedAt": "2025-11-09T10:45:00Z"
  }
}
```

**UI Integration:**

- Show toast notification with success message
- Update local state to reflect new status
- Optionally remove item from table (since default filter is status=pending)
- Update pending count in UI
- Handle errors gracefully with error toast

**Action Mapping:**

- "Update" button → `action: "update"`
- "Add" button → `action: "add"`
- "X" button → `action: "ignore"`

**Optimistic Updates:**

1. Immediately update UI to show new status
2. Make API call in background
3. If API call fails, revert UI to previous state and show error

---

## Authentication

All API requests require authentication using NextAuth.js with CredentialsProvider. The authentication is handled through HTTP-only session cookies that are automatically included in requests.

### Authentication Method

- **Authentication Type**: NextAuth.js with CredentialsProvider
- **Session Storage**: HTTP-only cookies
- **Cookie Name**: `next-auth.session-token`
- **Cookie Inclusion**: Cookies are automatically included in requests by the browser

### How NextAuth.js Authentication Works

1. **User Login**: User submits credentials (username/password) to `/api/auth/signin`
2. **Credential Validation**: NextAuth.js executes the `authorize()` function to validate credentials
3. **Session Creation**: If credentials are valid, NextAuth.js creates a session and returns user information (ID, name, etc.)
4. **Cookie Management**: Session token is stored in an HTTP-only cookie (`next-auth.session-token`)
5. **Automatic Inclusion**: All subsequent API requests automatically include the session cookie
6. **Session Validation**: Backend validates the session cookie on each request

### NextAuth.js Configuration

The authentication is configured in `/api/auth/[...nextauth]` endpoint within Next.js:

- Uses CredentialsProvider for username/password authentication
- The `authorize()` function validates credentials against environment variables
- Returns user object (ID, name) on successful authentication
- Creates active session in the browser

### API Request Requirements

- All API requests must include credentials (cookies) in the request
- Session cookie is automatically included by the browser for same-domain requests
- If session is invalid or expired, API returns `401 Unauthorized`
- No manual headers required (unlike API keys or Bearer tokens)

### Security Notes

- **Never hardcode passwords**: Always use environment variables (e.g., `process.env.ADMIN_PASSWORD`) for credentials
- **HTTP-only cookies**: Session tokens are stored in HTTP-only cookies, preventing XSS attacks
- **Automatic cookie handling**: Browsers automatically include cookies in requests to the same domain
- **Session validation**: Backend validates session on each API request
- **Credentials storage**: Store sensitive credentials in environment variables, not in code
- **Ideal for**: Prototypes, technical tests, or small projects that don't require external authentication services or databases

### Authentication Flow

1. User submits credentials via login form
2. Credentials are sent to `/api/auth/signin` endpoint
3. NextAuth.js validates credentials using `authorize()` function
4. If valid, session is created and cookie is set
5. All subsequent API requests automatically include the session cookie
6. Backend validates the session cookie on each request
7. If invalid or expired, user is redirected to login

---

## Error Handling

### Standard Error Response

All endpoints return errors in the following format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "specific error details"
  }
}
```

### HTTP Status Codes

- **200 OK:** Request successful
- **400 Bad Request:** Invalid parameters or request body
- **401 Unauthorized:** Missing or invalid authentication
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

### Recommended Error Handling

When handling API errors, the client should:

- **401 Unauthorized**: Redirect user to login or refresh session
- **404 Not Found**: Display "Resource not found" message
- **400 Bad Request**: Display validation error message from response
- **500 Internal Server Error**: Display "Server error" message and allow retry
- Log errors for debugging purposes
- Show user-friendly error messages

---

## Complete Flow Examples

### Example 1: User Clicks Casino from Missing Casinos

1. User clicks "Golden Nugget" in Missing Casinos view
2. Navigate to Promotions view with casino filter applied
3. API call: `GET /promotions/comparisons?casino=Golden%20Nugget&status=pending&limit=10&page=1`
4. Display filtered promotions for Golden Nugget

### Example 2: User Updates a Promotion

1. User clicks "Update" button on promotion comparison
2. Optimistically update UI to show "Updated" badge
3. API call: `PATCH /promotions/comparisons/A3B7F2` with `action: "update"`
4. On success: Show toast "Promotion updated"
5. Item disappears from table (since status is now "updated", not "pending")
6. Update pending count in UI

### Example 3: User Starts Research

1. User clicks the global "Start Research" button
2. API call: `POST /dashboard/research-status` with `action: "start"`
3. On success:
   - Show toast "Research started for all states"
   - Update global research status to "researching"
   - Start polling for updates every 30-60 seconds
4. Poll: `GET /dashboard/state-stats` every 30-60 seconds
5. Update dashboard cards with latest statistics
6. Continue polling until status changes to "idle"
7. When research completes (status: "idle"):
   - Show notification that research is complete
   - Provide option to reload the entire application to see new results
   - User can reload to refresh all views (Dashboard, Missing Casinos, Promotions) with latest data

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All monetary values are in USD
- State codes are always uppercase (NJ, MI, PA, WV)
- Promotion IDs are 6-character alphanumeric strings (e.g., "A3B7F2")
- Casino names are case-sensitive and should match exactly
