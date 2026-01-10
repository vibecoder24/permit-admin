# Permit Agent Admin Panel - User Stories

## Tech Stack Decision

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | React 18 + TypeScript | Type safety, large ecosystem, team familiarity |
| Build Tool | Vite | Fast HMR, modern bundling, excellent DX |
| Styling | Tailwind CSS | Utility-first, rapid development, consistent design |
| UI Components | shadcn/ui | Accessible, customizable, built on Radix UI |
| Routing | React Router v6 | Industry standard, nested routes support |
| Data Fetching | TanStack Query | Caching, background refetching, optimistic updates |
| State Management | Zustand | Simple, lightweight, TypeScript-first |
| Charts | Recharts | React-native charts, good customization |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| Date Handling | date-fns | Lightweight, tree-shakeable |
| Icons | Lucide React | Consistent, comprehensive icon set |

---

## Epic 1: Authentication & Authorization

### US-1.1: Role-Based Access Control
**As a** system administrator
**I want** users to have role-based permissions (Viewer, Agent, Admin)
**So that** sensitive actions are restricted to authorized personnel

**Acceptance Criteria:**
- Viewers can only view requests and analytics
- Agents can view, change status (forward only), and upload documents
- Admins have full access including invoicing and team management
- UI elements are conditionally rendered based on role

---

## Epic 2: Dashboard

### US-2.1: View Summary Metrics
**As an** admin/agent
**I want** to see summary cards with key metrics
**So that** I can quickly understand the current workload

**Acceptance Criteria:**
- Display total requests this month
- Display pending action count
- Display awaiting payment count
- Display completed this week count
- Cards are clickable and navigate to filtered list

### US-2.2: View New Permits Alert
**As an** admin/agent
**I want** to see an alert for new submissions in the last 24 hours
**So that** I don't miss incoming requests

**Acceptance Criteria:**
- Alert shows count of unviewed submissions
- Alert is dismissible
- Clicking navigates to New Permits Queue

### US-2.3: View Recent Activity Feed
**As an** admin/agent
**I want** to see the last 10 status changes
**So that** I can track team activity

**Acceptance Criteria:**
- Shows timestamp, user, action, and permit ID
- Each item links to the permit detail
- Auto-refreshes every 30 seconds

### US-2.4: Quick Filters on Dashboard
**As an** admin/agent
**I want** quick filter buttons (My assigned, Needs manual handling, Stuck >3 days)
**So that** I can quickly access relevant requests

**Acceptance Criteria:**
- Clicking filter navigates to Requests List with filter applied
- Shows count badge on each filter button

---

## Epic 3: Requests List

### US-3.1: View Grouped Requests
**As an** admin/agent
**I want** to see requests grouped by Site → Project → Permit
**So that** I understand the hierarchy and relationships

**Acceptance Criteria:**
- Groups are expandable/collapsible
- Project header shows: name, site address, customer, permit count, invoice status
- Permit rows show: ID, type, status, automation status, date, assignee, actions

### US-3.2: Filter Requests
**As an** admin/agent
**I want** to filter requests by multiple criteria
**So that** I can find specific permits quickly

**Acceptance Criteria:**
- Filter by: date range, jurisdiction, permit type, status, automation status, assignee, invoice status
- Multi-select supported for applicable filters
- Filters persist in URL for shareability
- Clear all filters button

### US-3.3: Search Requests
**As an** admin/agent
**I want** to search by email, customer name, site address, or permit ID
**So that** I can find specific records quickly

**Acceptance Criteria:**
- Global search bar with debounced input
- Results highlight matching text
- Search works across all visible columns

### US-3.4: Bulk Actions
**As an** admin
**I want** to perform bulk actions on multiple requests
**So that** I can efficiently manage workload

**Acceptance Criteria:**
- Checkbox selection for multiple rows
- Bulk assign to agent
- Export to CSV
- Select all / deselect all

### US-3.5: Edit Project Name
**As an** admin/agent
**I want** to edit a project name inline
**So that** I can give meaningful names to projects

**Acceptance Criteria:**
- Click-to-edit on project name
- Auto-save on blur
- Shows saving indicator

---

## Epic 4: Permit Detail

### US-4.1: View Request Information
**As an** admin/agent
**I want** to see all request details in one place
**So that** I have complete context for processing

**Acceptance Criteria:**
- Display customer info (name, email, phone)
- Display site info (address, jurisdiction)
- Display project info (name, scope of work)
- Display permit type and submission timestamp
- Show downloadable submitted documents

### US-4.2: View Chat History
**As an** admin/agent
**I want** to see the full chatbot conversation
**So that** I understand what the customer requested

**Acceptance Criteria:**
- Chronological display with timestamps
- Visual distinction between customer and bot messages
- Collapsible for long conversations
- Copy entire conversation option

### US-4.3: View JSON Output
**As an** admin/agent
**I want** to see the structured data extracted by the permit agent
**So that** I can use it for manual submission

**Acceptance Criteria:**
- Syntax-highlighted JSON viewer
- Collapsible/expandable sections
- Copy to clipboard button
- Search within JSON

### US-4.4: View Automation Status
**As an** admin/agent
**I want** to see why automation succeeded or failed
**So that** I know if manual intervention is needed

**Acceptance Criteria:**
- Clear status indicator (Succeeded/Failed/Manual)
- Failure reason displayed prominently if failed
- Manual override toggle for agents

### US-4.5: Update Permit Status
**As an** admin/agent
**I want** to update the permit status with a reason
**So that** the workflow progresses correctly

**Acceptance Criteria:**
- Status dropdown filtered by user role
- Agents can only move status forward
- Reason field required for status changes
- Status flow enforced: New → In Review → Submitted to Jurisdiction → etc.
- On Hold/Rejected requires reason

### US-4.6: Upload Documents
**As an** admin/agent
**I want** to upload documents (permit PDF, screenshots, other)
**So that** records are complete

**Acceptance Criteria:**
- File upload with drag-and-drop
- Document type selection
- List of uploaded documents with metadata
- Download and preview options
- Delete option (admin only)

### US-4.7: View Activity Log
**As an** admin/agent/viewer
**I want** to see all actions taken on a permit
**So that** I have an audit trail

**Acceptance Criteria:**
- Shows: timestamp, user, action, details
- Includes status changes, uploads, assignments, invoice events
- Sortable and filterable

### US-4.8: Reassign Permit
**As an** admin
**I want** to reassign a permit to another agent
**So that** workload can be balanced

**Acceptance Criteria:**
- Dropdown of active team members
- Logs reassignment in activity log
- Notifies new assignee (future: email)

---

## Epic 5: Project View

### US-5.1: View All Project Permits
**As an** admin/agent
**I want** to see all permits under a project
**So that** I can manage them together

**Acceptance Criteria:**
- Table of permits with status, assignee, actions
- Project header with site and customer info
- Combined activity log across all permits

### US-5.2: Create Invoice
**As an** admin
**I want** to create an invoice for a project
**So that** I can charge the customer for all permits

**Acceptance Criteria:**
- Auto-lists all permits in project
- Editable line items with amounts
- Notes field
- Total calculation
- Save as draft or send immediately

### US-5.3: Manage Invoice
**As an** admin
**I want** to view invoice status and history
**So that** I can track payments

**Acceptance Criteria:**
- Display invoice status: Not created / Sent / Paid / Refunded
- View invoice details and history
- Process refund with reason (admin only)

---

## Epic 6: New Permits Queue

### US-6.1: View Incoming Requests
**As an** admin/agent
**I want** to see all new submissions in a triage queue
**So that** I can process them efficiently

**Acceptance Criteria:**
- Shows only status = "New"
- Sorted by submission date (oldest first)
- Highlights failed automation items
- Badge count in navigation

### US-6.2: Quick Assign from Queue
**As an** admin/agent
**I want** to quickly assign requests from the queue
**So that** triage is fast

**Acceptance Criteria:**
- Assign dropdown on each row
- Auto-advances status to "In Review" when assigned
- "Mark as Reviewed" action

---

## Epic 7: Analytics & Reporting

### US-7.1: View Summary Analytics
**As an** admin/viewer
**I want** to see key performance metrics
**So that** I can track business health

**Acceptance Criteria:**
- Total revenue collected (period)
- Total requests raised (period)
- Form completion rate
- Avg time to submit to jurisdiction
- Avg time to payment

### US-7.2: View Volume Charts
**As an** admin/viewer
**I want** to see request volume over time
**So that** I can identify trends

**Acceptance Criteria:**
- Requests over time (daily/weekly/monthly toggle)
- Status funnel chart
- Interactive tooltips

### US-7.3: View Breakdown Reports
**As an** admin/viewer
**I want** to see breakdowns by jurisdiction, permit type, and agent
**So that** I can identify patterns

**Acceptance Criteria:**
- By jurisdiction (bar chart + table)
- By permit type (pie chart)
- By agent (table with count and avg completion time)

### US-7.4: View Performance Metrics
**As an** admin/viewer
**I want** to see performance and bottleneck data
**So that** I can improve operations

**Acceptance Criteria:**
- Avg turnaround by stage
- Automation success rate
- Requests stuck > X days
- Configurable threshold for "stuck"

### US-7.5: View Revenue Reports
**As an** admin
**I want** to see revenue analytics
**So that** I can track financial performance

**Acceptance Criteria:**
- Revenue by period
- Revenue by jurisdiction / permit type
- Outstanding invoices total
- Refunds issued

### US-7.6: Export Analytics
**As an** admin/viewer
**I want** to export analytics data
**So that** I can share with stakeholders

**Acceptance Criteria:**
- Export to CSV
- Export to PDF
- Includes current filters in export

---

## Epic 8: Team Management

### US-8.1: View Team Members
**As an** admin
**I want** to see all team members
**So that** I can manage access

**Acceptance Criteria:**
- Table: Name, Email, Role, Status, Last Active
- Filter by role and status
- Sort by any column

### US-8.2: Invite Team Member
**As an** admin
**I want** to invite new team members
**So that** they can access the system

**Acceptance Criteria:**
- Email input with validation
- Role selection dropdown
- Sends invite email with link
- Shows pending invitations

### US-8.3: Manage Team Member
**As an** admin
**I want** to modify team member roles and status
**So that** I can control access

**Acceptance Criteria:**
- Change role dropdown
- Deactivate/reactivate toggle
- Cannot deactivate self
- Logs changes in audit

---

## Epic 9: Settings

### US-9.1: Manage Jurisdictions
**As an** admin
**I want** to add/edit/deactivate jurisdictions
**So that** the system supports new areas

**Acceptance Criteria:**
- List of jurisdictions with status
- Add new jurisdiction form
- Edit existing jurisdiction
- Deactivate (not delete) option

### US-9.2: Manage Permit Types
**As an** admin
**I want** to add/edit/deactivate permit types
**So that** the system supports new permit categories

**Acceptance Criteria:**
- List of permit types with status
- Add new permit type form
- Edit existing permit type
- Deactivate (not delete) option

### US-9.3: Configure Invoice Defaults
**As an** admin
**I want** to set default invoice settings
**So that** invoice creation is consistent

**Acceptance Criteria:**
- Default payment terms
- Default notes template
- Save and apply to new invoices

### US-9.4: Configure Notifications
**As an** admin
**I want** to configure notification settings
**So that** the right alerts are sent

**Acceptance Criteria:**
- Toggle notifications by type
- Configure recipients
- Test notification option

---

## Implementation Priority (MVP)

### Phase 1 - Core Functionality
1. Authentication & RBAC (US-1.1)
2. Requests List (US-3.1, US-3.2, US-3.3)
3. Permit Detail (US-4.1 through US-4.7)
4. New Permits Queue (US-6.1, US-6.2)
5. Dashboard (US-2.1 through US-2.4)

### Phase 2 - Advanced Features
6. Project View & Invoicing (US-5.1 through US-5.3)
7. Team Management (US-8.1 through US-8.3)
8. Bulk Actions (US-3.4)

### Phase 3 - Analytics & Configuration
9. Analytics & Reporting (US-7.1 through US-7.6)
10. Settings (US-9.1 through US-9.4)

---

## Story Points Estimation

| Epic | Stories | Total Points |
|------|---------|--------------|
| Authentication & Authorization | 1 | 5 |
| Dashboard | 4 | 8 |
| Requests List | 5 | 13 |
| Permit Detail | 8 | 21 |
| Project View | 3 | 13 |
| New Permits Queue | 2 | 5 |
| Analytics & Reporting | 6 | 21 |
| Team Management | 3 | 8 |
| Settings | 4 | 8 |
| **Total** | **36** | **102** |
