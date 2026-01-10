// User roles
export type UserRole = 'viewer' | 'agent' | 'admin'

// Team member status
export type TeamMemberStatus = 'active' | 'inactive' | 'pending'

// Permit status
export type PermitStatus =
  | 'new'
  | 'in_review'
  | 'submitted_to_jurisdiction'
  | 'pending_payment'
  | 'payment_received'
  | 'permit_processing'
  | 'permit_ready'
  | 'completed'
  | 'on_hold'
  | 'rejected'

// Automation status
export type AutomationStatus = 'auto' | 'manual' | 'failed'

// Invoice status
export type InvoiceStatus = 'not_created' | 'draft' | 'sent' | 'paid' | 'refunded'

// Document type
export type DocumentType = 'customer_upload' | 'permit' | 'screenshot' | 'other'

// Customer
export interface Customer {
  id: string
  email: string
  name: string
  phone: string
  createdAt: string
}

// Site
export interface Site {
  id: string
  customerId: string
  address: string
  jurisdictionId: string
  jurisdictionName: string
  createdAt: string
}

// Project
export interface Project {
  id: string
  siteId: string
  name: string
  scopeOfWork: string
  createdAt: string
  invoiceStatus: InvoiceStatus
}

// Permit Request
export interface PermitRequest {
  id: string
  projectId: string
  permitTypeId: string
  permitTypeName: string
  status: PermitStatus
  automationStatus: AutomationStatus
  automationFailureReason?: string
  chatHistory: ChatMessage[]
  agentOutput: Record<string, unknown>
  assignedTo?: string
  assignedToName?: string
  createdAt: string
  updatedAt: string
}

// Document
export interface Document {
  id: string
  permitRequestId: string
  type: DocumentType
  fileName: string
  fileUrl: string
  uploadedBy: string
  uploadedByName: string
  uploadedAt: string
}

// Status History
export interface StatusHistory {
  id: string
  permitRequestId: string
  fromStatus: PermitStatus | null
  toStatus: PermitStatus
  changedBy: string
  changedByName: string
  reason: string
  timestamp: string
}

// Invoice
export interface Invoice {
  id: string
  projectId: string
  status: InvoiceStatus
  totalAmount: number
  lineItems: InvoiceLineItem[]
  paymentLink?: string
  notes?: string
  sentAt?: string
  paidAt?: string
  refundedAt?: string
  createdAt: string
}

// Invoice Line Item
export interface InvoiceLineItem {
  id: string
  description: string
  amount: number
  permitId?: string
}

// Refund
export interface Refund {
  id: string
  invoiceId: string
  amount: number
  reason: string
  createdBy: string
  createdByName: string
  createdAt: string
}

// Team Member
export interface TeamMember {
  id: string
  email: string
  name: string
  role: UserRole
  status: TeamMemberStatus
  invitedBy?: string
  createdAt: string
  lastActiveAt?: string
}

// Chat Message
export interface ChatMessage {
  id: string
  role: 'customer' | 'bot'
  content: string
  timestamp: string
}

// Jurisdiction
export interface Jurisdiction {
  id: string
  name: string
  state: string
  active: boolean
}

// Permit Type
export interface PermitType {
  id: string
  name: string
  description: string
  active: boolean
}

// Activity Log Entry
export interface ActivityLogEntry {
  id: string
  entityType: 'permit' | 'project' | 'invoice'
  entityId: string
  action: string
  details: string
  userId: string
  userName: string
  timestamp: string
}

// Grouped data for requests list
export interface GroupedRequests {
  site: Site
  customer: Customer
  projects: {
    project: Project
    permits: PermitRequest[]
  }[]
}

// Dashboard metrics
export interface DashboardMetrics {
  totalRequestsThisMonth: number
  pendingAction: number
  awaitingPayment: number
  completedThisWeek: number
  newPermits24h: number
}

// Analytics data
export interface AnalyticsData {
  totalRevenue: number
  totalRequests: number
  formCompletionRate: number
  avgTimeToSubmit: number
  avgTimeToPayment: number
  requestsByStatus: { status: string; count: number }[]
  requestsByJurisdiction: { jurisdiction: string; count: number }[]
  requestsByPermitType: { permitType: string; count: number }[]
  requestsByAgent: { agent: string; count: number; avgTime: number }[]
  requestsOverTime: { date: string; count: number }[]
  revenueOverTime: { date: string; revenue: number }[]
  automationSuccessRate: number
  stuckRequests: number
}

// Filter state
export interface RequestFilters {
  dateRange?: { start: string; end: string }
  jurisdictions: string[]
  permitTypes: string[]
  statuses: PermitStatus[]
  automationStatuses: AutomationStatus[]
  assignedTo: string[]
  invoiceStatuses: InvoiceStatus[]
  search: string
}
