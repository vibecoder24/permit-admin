# Permit Agent Admin Panel - Product Spec

## Overview
Admin interface for managing permit requests submitted through the customer-facing permit portal and chatbot. Enables team members to process permit applications, handle manual jurisdiction submissions, manage invoicing, and deliver completed permits.

---

## Data Hierarchy

```
Customer (login-based)
└── Site (property address → auto-detects jurisdiction)
    └── Project (auto-derived from scope, customer can rename)
        └── Permit Request(s) (multiple per project, e.g., electrical + plumbing)
```

- Single chat session can create multiple permit requests
- Invoicing is per project (permits bundled)

---

## User Roles & Permissions

| Role | View Requests | Change Status | Upload Documents | Raise Invoice | Manage Team | View Analytics |
|------|--------------|---------------|------------------|---------------|-------------|----------------|
| Viewer | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Agent | ✓ | Limited* | ✓ | ✗ | ✗ | ✓ |
| Admin | ✓ | All | ✓ | ✓ | ✓ | ✓ |

*Agent can move status forward but cannot revert or cancel

---

## Pages

### 1. Dashboard
**Purpose:** Quick overview of pipeline and action items

**Components:**
- Summary cards:
  - Total requests (this month)
  - Pending action
  - Awaiting payment
  - Completed (this week)
- "New Permits" alert - unviewed submissions in last 24h
- Recent activity feed (last 10 status changes)
- Quick filters: My assigned | Needs manual handling | Stuck >3 days

---

### 2. Requests List (Flat Permits View)
**Purpose:** Main working view for all permit requests - agent work queue

**View Type:** Flat table of all permit requests (not grouped)

**Table Columns:**
- Checkbox (for bulk selection)
- Permit ID (link to detail)
- Permit Type
- Project (link to project view)
- Customer (name + email)
- Site Address + Jurisdiction
- Status (color-coded badge)
- Automation Status (Auto / Manual / Failed)
- Invoice Status
- Submitted Date
- Assigned To
- Actions menu

**Filters Panel:**
- Jurisdiction (dropdown)
- Permit type (dropdown)
- Status (dropdown)
- Automation status (dropdown)
- Assigned to (dropdown with "Unassigned" option)

**Search:**
- Global search - permit ID, project name, customer name/email, site address

**Bulk Actions:**
- Assign to agent
- Export to CSV

---

### 3. Projects List
**Purpose:** Project-level management view for invoicing, progress tracking, and customer organization

**View Type:** Table of all projects with aggregated permit information

**Table Columns:**
- Project Name (link to project view)
- Customer (name + email)
- Site Address
- Jurisdiction
- Permits Count (with mini status breakdown: e.g., "3 permits: 1 new, 1 in review, 1 completed")
- Overall Progress (progress bar or status summary)
- Invoice Status (Not created / Draft / Sent / Paid / Refunded)
- Created Date
- Actions menu

**Filters Panel:**
- Jurisdiction (dropdown)
- Invoice status (dropdown)
- Has pending permits (checkbox)
- Date range (project created date)

**Search:**
- Search by project name, customer name/email, site address

**Actions:**
- View Project → Project View page
- Create Invoice (Admin only, if not created)
- Quick permit count hover to see breakdown

**Use Cases:**
- Admin reviewing which projects need invoicing
- Tracking overall project completion status
- Customer-centric view of work in progress

---

### 4. Permit Detail
**Purpose:** Full view of single permit request with all actions

**Header:**
- Permit ID, type, status
- Breadcrumb: Customer → Site → Project → Permit
- Assigned to (with reassign option)

**Sections:**

**A. Request Info**
- Customer: name, email, phone
- Site: address, jurisdiction (auto-detected)
- Project: name, scope of work
- Permit type
- Submitted documents (downloadable)
- Submission timestamp

**B. Chat History**
- Full conversation thread (customer ↔ chatbot)
- Chronological with timestamps
- Collapsible for long conversations

**C. JSON Output**
- Structured data extracted by permit agent
- Permit type, permit info, parsed fields
- Formatted viewer (collapsible, syntax highlighted)
- Copy to clipboard

**D. Automation Status**
- Status: Succeeded / Failed / Manual
- If failed: Reason for failure (displayed prominently)
- Manual override option

**E. Status Management**
- Current status (prominent)
- Status dropdown (role-filtered)
- Reason field (required)
- "Update Status" button

**Status Flow:**
```
New → In Review → Submitted to Jurisdiction → Pending Payment → 
Payment Received → Permit Processing → Permit Ready → Completed
        ↓
    On Hold / Rejected (with reason)
```

**F. Documents**
- Upload: Permit (final PDF), Submission screenshot, Other
- List: document type, uploaded by, timestamp
- Download/preview

**G. Activity Log**
- All actions: status changes, uploads, assignments, invoice events
- Format: Timestamp | User | Action | Details

---

### 5. Project View (Detail)
**Purpose:** Manage all permits under a project, handle bundled invoicing

**Header:**
- Project name (editable)
- Site address | Jurisdiction
- Customer info

**Permits Table:**
- All permits under this project
- Status, assigned to, actions

**Invoice Section:**
- Invoice status: Not created / Sent / Paid / Refunded
- "Create Invoice" button (Admin only)
  - Auto-lists permits in project
  - Line items with amounts (editable)
  - Total
  - Notes field
- Invoice history
- Refund action (with reason)

**Combined Activity Log:**
- All activity across permits in this project

---

### 6. New Permits Queue
**Purpose:** Triage incoming requests

**Features:**
- Shows status = "New" only
- Sorted by submission date (oldest first)
- Highlights: Failed automation (needs manual)
- Quick assign per row
- "Mark as Reviewed" action
- Badge count in nav

---

### 7. Analytics & Reporting
**Purpose:** Track performance and identify bottlenecks

**Summary Cards:**
- Total revenue collected (period)
- Total requests raised (period)
- Form completion rate (chatbot: started vs. submitted)
- Avg. time to submit to jurisdiction portal
- Avg. time to payment

**Charts:**

*Volume*
- Requests over time (daily/weekly/monthly)
- Requests by status (funnel)

*Breakdown*
- By jurisdiction (bar + table)
- By permit type (pie chart)
- By agent (table: count, avg completion time)

*Performance*
- Avg. turnaround by stage (identify bottlenecks)
- Automation success rate
- Requests stuck > X days

*Revenue*
- Revenue by period
- Revenue by jurisdiction / permit type
- Outstanding invoices
- Refunds issued

**Filters:**
- Date range
- Jurisdiction
- Permit type
- Agent

**Export:** CSV / PDF

---

### 8. Team Management (Admin only)
**Purpose:** Manage access and roles

**Team List:**
- Name, Email, Role, Status, Last Active
- Invite button
- Filter by role

**Invite Flow:**
- Email + Role selection
- Sends invite link

**Member Actions:**
- Change role
- Deactivate / Reactivate

---

### 9. Settings (Admin only)
**Purpose:** System configuration

- Jurisdiction list (add/edit/deactivate)
- Permit type list (add/edit/deactivate)
- Invoice defaults (payment terms, notes template)
- Notification settings

---

## Key Workflows

### Manual Permit Processing
1. Request arrives, automation attempts submission
2. If automation fails → flagged with reason, appears in queue
3. Agent picks up, views JSON output + chat history
4. Agent fills jurisdiction portal manually
5. Agent uploads submission screenshot
6. Agent updates status to "Submitted to Jurisdiction"

### Invoice & Payment
1. Admin opens Project View
2. Clicks "Create Invoice" (bundles all permits in project)
3. Adjusts line items / amounts as needed
4. Sends invoice → customer receives email with payment link
5. Customer pays online
6. System marks invoice as Paid, status updates to "Payment Received"

### Permit Delivery
1. Agent monitors jurisdiction portal
2. Downloads approved permit PDF
3. Uploads to admin under permit detail
4. Updates status to "Permit Ready"
5. Customer notified via email with download link
6. Customer downloads from their portal

---

## Customer Notifications (Triggered)

| Trigger | Notification |
|---------|--------------|
| Invoice created | Email with payment link |
| Permit uploaded | Email: "Your permit is ready" with download link |

---

## Data Model

```
Customer
├── id, email, name, phone
├── created_at

Site
├── id, customer_id
├── address, jurisdiction_id
├── created_at

Project
├── id, site_id
├── name (auto-derived, editable)
├── scope_of_work
├── created_at

PermitRequest
├── id, project_id
├── permit_type_id
├── status
├── automation_status (auto | manual | failed)
├── automation_failure_reason
├── chat_history (JSON)
├── agent_output (JSON)
├── assigned_to
├── created_at, updated_at

Document
├── id, permit_request_id
├── type (customer_upload | permit | screenshot | other)
├── file_url, uploaded_by, uploaded_at

StatusHistory
├── id, permit_request_id
├── from_status, to_status
├── changed_by, reason, timestamp

Invoice
├── id, project_id
├── status (draft | sent | paid | refunded)
├── total_amount
├── line_items (JSON)
├── payment_link
├── sent_at, paid_at, refunded_at

Refund
├── id, invoice_id
├── amount, reason
├── created_by, created_at

TeamMember
├── id, email, name
├── role (viewer | agent | admin)
├── status (active | inactive | pending)
├── invited_by, created_at, last_active_at
```

---

## Out of Scope (v1)
- Customer portal (separate spec)
- Jurisdiction automation config (handled outside admin)
- Partial payments
- Payment gateway integration (assume payment link exists)
- Email/SMS template customization

---

## Open Questions
1. Should agents see only their assigned permits, or all permits?
2. Do you need audit logs for compliance (who viewed what, when)?
3. Any SLA commitments to track (e.g., 24h response time)?
