import type {
  Customer,
  Site,
  Project,
  PermitRequest,
  Document,
  StatusHistory,
  Invoice,
  TeamMember,
  ChatMessage,
  Jurisdiction,
  PermitType,
  ActivityLogEntry,
  GroupedRequests,
  DashboardMetrics,
  AnalyticsData,
} from "@/types"

// Jurisdictions
export const jurisdictions: Jurisdiction[] = [
  { id: "j1", name: "Los Angeles County", state: "CA", active: true },
  { id: "j2", name: "San Francisco", state: "CA", active: true },
  { id: "j3", name: "Miami-Dade County", state: "FL", active: true },
  { id: "j4", name: "Houston", state: "TX", active: true },
  { id: "j5", name: "Phoenix", state: "AZ", active: true },
]

// Permit Types
export const permitTypes: PermitType[] = [
  { id: "pt1", name: "Electrical", description: "Electrical work permits", active: true },
  { id: "pt2", name: "Plumbing", description: "Plumbing work permits", active: true },
  { id: "pt3", name: "HVAC", description: "Heating, ventilation, and air conditioning permits", active: true },
  { id: "pt4", name: "Roofing", description: "Roofing work permits", active: true },
  { id: "pt5", name: "Solar", description: "Solar panel installation permits", active: true },
  { id: "pt6", name: "General Building", description: "General construction permits", active: true },
]

// Team Members
export const teamMembers: TeamMember[] = [
  {
    id: "tm1",
    email: "admin@permitagent.com",
    name: "Sarah Johnson",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
    lastActiveAt: "2025-01-09T14:30:00Z",
  },
  {
    id: "tm2",
    email: "agent1@permitagent.com",
    name: "Mike Chen",
    role: "agent",
    status: "active",
    invitedBy: "tm1",
    createdAt: "2024-02-20T09:00:00Z",
    lastActiveAt: "2025-01-09T12:15:00Z",
  },
  {
    id: "tm3",
    email: "agent2@permitagent.com",
    name: "Emily Rodriguez",
    role: "agent",
    status: "active",
    invitedBy: "tm1",
    createdAt: "2024-03-10T11:00:00Z",
    lastActiveAt: "2025-01-09T10:45:00Z",
  },
  {
    id: "tm4",
    email: "viewer@permitagent.com",
    name: "David Kim",
    role: "viewer",
    status: "active",
    invitedBy: "tm1",
    createdAt: "2024-06-01T08:00:00Z",
    lastActiveAt: "2025-01-08T16:00:00Z",
  },
  {
    id: "tm5",
    email: "newagent@permitagent.com",
    name: "Alex Thompson",
    role: "agent",
    status: "pending",
    invitedBy: "tm1",
    createdAt: "2025-01-05T14:00:00Z",
  },
]

// Customers
export const customers: Customer[] = [
  {
    id: "c1",
    email: "john.smith@email.com",
    name: "John Smith",
    phone: "(555) 123-4567",
    createdAt: "2024-11-01T10:00:00Z",
  },
  {
    id: "c2",
    email: "maria.garcia@email.com",
    name: "Maria Garcia",
    phone: "(555) 234-5678",
    createdAt: "2024-11-15T14:00:00Z",
  },
  {
    id: "c3",
    email: "robert.wilson@email.com",
    name: "Robert Wilson",
    phone: "(555) 345-6789",
    createdAt: "2024-12-01T09:00:00Z",
  },
  {
    id: "c4",
    email: "jennifer.lee@email.com",
    name: "Jennifer Lee",
    phone: "(555) 456-7890",
    createdAt: "2024-12-20T11:00:00Z",
  },
]

// Sites
export const sites: Site[] = [
  {
    id: "s1",
    customerId: "c1",
    address: "123 Main St, Los Angeles, CA 90001",
    jurisdictionId: "j1",
    jurisdictionName: "Los Angeles County",
    createdAt: "2024-11-01T10:05:00Z",
  },
  {
    id: "s2",
    customerId: "c2",
    address: "456 Oak Ave, San Francisco, CA 94102",
    jurisdictionId: "j2",
    jurisdictionName: "San Francisco",
    createdAt: "2024-11-15T14:10:00Z",
  },
  {
    id: "s3",
    customerId: "c3",
    address: "789 Palm Blvd, Miami, FL 33101",
    jurisdictionId: "j3",
    jurisdictionName: "Miami-Dade County",
    createdAt: "2024-12-01T09:15:00Z",
  },
  {
    id: "s4",
    customerId: "c4",
    address: "321 Cedar Ln, Houston, TX 77001",
    jurisdictionId: "j4",
    jurisdictionName: "Houston",
    createdAt: "2024-12-20T11:20:00Z",
  },
]

// Projects
export const projects: Project[] = [
  {
    id: "p1",
    siteId: "s1",
    name: "Kitchen Renovation",
    scopeOfWork: "Complete kitchen remodel including electrical and plumbing upgrades",
    createdAt: "2024-11-02T10:00:00Z",
    invoiceStatus: "paid",
  },
  {
    id: "p2",
    siteId: "s2",
    name: "Solar Installation",
    scopeOfWork: "Installation of 20-panel solar system with battery storage",
    createdAt: "2024-11-16T14:00:00Z",
    invoiceStatus: "sent",
  },
  {
    id: "p3",
    siteId: "s3",
    name: "HVAC Replacement",
    scopeOfWork: "Full HVAC system replacement with new ductwork",
    createdAt: "2024-12-02T09:00:00Z",
    invoiceStatus: "not_created",
  },
  {
    id: "p4",
    siteId: "s4",
    name: "Bathroom Addition",
    scopeOfWork: "New bathroom addition with plumbing and electrical",
    createdAt: "2024-12-21T11:00:00Z",
    invoiceStatus: "not_created",
  },
  {
    id: "p5",
    siteId: "s1",
    name: "Garage Electrical Upgrade",
    scopeOfWork: "Upgrade electrical panel and add EV charger circuit",
    createdAt: "2025-01-05T10:00:00Z",
    invoiceStatus: "not_created",
  },
]

// Chat History
const chatHistory1: ChatMessage[] = [
  { id: "ch1", role: "bot", content: "Hello! Welcome to PermitAgent. What type of permit do you need today?", timestamp: "2024-11-02T10:00:00Z" },
  { id: "ch2", role: "customer", content: "I need an electrical permit for my kitchen renovation", timestamp: "2024-11-02T10:01:00Z" },
  { id: "ch3", role: "bot", content: "I can help with that. What's the property address?", timestamp: "2024-11-02T10:01:30Z" },
  { id: "ch4", role: "customer", content: "123 Main St, Los Angeles, CA 90001", timestamp: "2024-11-02T10:02:00Z" },
  { id: "ch5", role: "bot", content: "Thank you. Can you describe the electrical work you're planning?", timestamp: "2024-11-02T10:02:30Z" },
  { id: "ch6", role: "customer", content: "Adding new circuits for appliances, updating the panel, and adding recessed lighting", timestamp: "2024-11-02T10:03:00Z" },
  { id: "ch7", role: "bot", content: "Got it. I've gathered all the information needed. Your permit request has been submitted!", timestamp: "2024-11-02T10:05:00Z" },
]

// Permit Requests
export const permitRequests: PermitRequest[] = [
  {
    id: "pr1",
    projectId: "p1",
    permitTypeId: "pt1",
    permitTypeName: "Electrical",
    status: "completed",
    automationStatus: "auto",
    chatHistory: chatHistory1,
    agentOutput: {
      permitType: "Electrical",
      propertyAddress: "123 Main St, Los Angeles, CA 90001",
      scopeOfWork: "Kitchen electrical upgrade - new circuits, panel update, recessed lighting",
      estimatedValue: 8500,
      contractor: "ABC Electric Inc.",
      contractorLicense: "C10-123456",
    },
    assignedTo: "tm2",
    assignedToName: "Mike Chen",
    createdAt: "2024-11-02T10:05:00Z",
    updatedAt: "2024-12-15T14:30:00Z",
  },
  {
    id: "pr2",
    projectId: "p1",
    permitTypeId: "pt2",
    permitTypeName: "Plumbing",
    status: "completed",
    automationStatus: "auto",
    chatHistory: [],
    agentOutput: {
      permitType: "Plumbing",
      propertyAddress: "123 Main St, Los Angeles, CA 90001",
      scopeOfWork: "Kitchen plumbing - sink relocation, dishwasher connection, new water lines",
      estimatedValue: 5500,
    },
    assignedTo: "tm2",
    assignedToName: "Mike Chen",
    createdAt: "2024-11-02T10:30:00Z",
    updatedAt: "2024-12-15T14:30:00Z",
  },
  {
    id: "pr3",
    projectId: "p2",
    permitTypeId: "pt5",
    permitTypeName: "Solar",
    status: "pending_payment",
    automationStatus: "auto",
    chatHistory: [],
    agentOutput: {
      permitType: "Solar",
      propertyAddress: "456 Oak Ave, San Francisco, CA 94102",
      systemSize: "8.5 kW",
      panelCount: 20,
      batteryStorage: "Tesla Powerwall 2",
    },
    assignedTo: "tm3",
    assignedToName: "Emily Rodriguez",
    createdAt: "2024-11-16T14:15:00Z",
    updatedAt: "2025-01-05T10:00:00Z",
  },
  {
    id: "pr4",
    projectId: "p3",
    permitTypeId: "pt3",
    permitTypeName: "HVAC",
    status: "submitted_to_jurisdiction",
    automationStatus: "failed",
    automationFailureReason: "Jurisdiction portal was unavailable. Manual submission required.",
    chatHistory: [],
    agentOutput: {
      permitType: "HVAC",
      propertyAddress: "789 Palm Blvd, Miami, FL 33101",
      equipmentType: "Central AC with Heat Pump",
      tonnage: "4 tons",
      seer: 18,
    },
    assignedTo: "tm2",
    assignedToName: "Mike Chen",
    createdAt: "2024-12-02T09:30:00Z",
    updatedAt: "2025-01-08T11:00:00Z",
  },
  {
    id: "pr5",
    projectId: "p4",
    permitTypeId: "pt2",
    permitTypeName: "Plumbing",
    status: "in_review",
    automationStatus: "manual",
    chatHistory: [],
    agentOutput: {
      permitType: "Plumbing",
      propertyAddress: "321 Cedar Ln, Houston, TX 77001",
      scopeOfWork: "New bathroom - toilet, vanity, shower with drain",
    },
    assignedTo: "tm3",
    assignedToName: "Emily Rodriguez",
    createdAt: "2024-12-21T11:30:00Z",
    updatedAt: "2025-01-07T09:00:00Z",
  },
  {
    id: "pr6",
    projectId: "p4",
    permitTypeId: "pt1",
    permitTypeName: "Electrical",
    status: "new",
    automationStatus: "auto",
    chatHistory: [],
    agentOutput: {
      permitType: "Electrical",
      propertyAddress: "321 Cedar Ln, Houston, TX 77001",
      scopeOfWork: "New bathroom - lighting, GFCI outlets, exhaust fan",
    },
    createdAt: "2024-12-21T11:45:00Z",
    updatedAt: "2024-12-21T11:45:00Z",
  },
  {
    id: "pr7",
    projectId: "p5",
    permitTypeId: "pt1",
    permitTypeName: "Electrical",
    status: "new",
    automationStatus: "failed",
    automationFailureReason: "Missing contractor license information. Please update and retry.",
    chatHistory: [],
    agentOutput: {
      permitType: "Electrical",
      propertyAddress: "123 Main St, Los Angeles, CA 90001",
      scopeOfWork: "Panel upgrade to 200A, EV charger circuit installation",
    },
    createdAt: "2025-01-05T10:15:00Z",
    updatedAt: "2025-01-05T10:15:00Z",
  },
  {
    id: "pr8",
    projectId: "p3",
    permitTypeId: "pt1",
    permitTypeName: "Electrical",
    status: "new",
    automationStatus: "auto",
    chatHistory: [],
    agentOutput: {
      permitType: "Electrical",
      propertyAddress: "789 Palm Blvd, Miami, FL 33101",
      scopeOfWork: "HVAC electrical disconnect and new circuit for heat pump",
    },
    createdAt: "2025-01-09T08:00:00Z",
    updatedAt: "2025-01-09T08:00:00Z",
  },
]

// Documents
export const documents: Document[] = [
  {
    id: "d1",
    permitRequestId: "pr1",
    type: "customer_upload",
    fileName: "kitchen_plans.pdf",
    fileUrl: "/documents/kitchen_plans.pdf",
    uploadedBy: "c1",
    uploadedByName: "John Smith",
    uploadedAt: "2024-11-02T10:10:00Z",
  },
  {
    id: "d2",
    permitRequestId: "pr1",
    type: "permit",
    fileName: "electrical_permit_approved.pdf",
    fileUrl: "/documents/electrical_permit_approved.pdf",
    uploadedBy: "tm2",
    uploadedByName: "Mike Chen",
    uploadedAt: "2024-12-15T14:30:00Z",
  },
  {
    id: "d3",
    permitRequestId: "pr4",
    type: "screenshot",
    fileName: "jurisdiction_submission.png",
    fileUrl: "/documents/jurisdiction_submission.png",
    uploadedBy: "tm2",
    uploadedByName: "Mike Chen",
    uploadedAt: "2025-01-08T11:00:00Z",
  },
]

// Status History
export const statusHistory: StatusHistory[] = [
  {
    id: "sh1",
    permitRequestId: "pr1",
    fromStatus: null,
    toStatus: "new",
    changedBy: "system",
    changedByName: "System",
    reason: "Request submitted via chatbot",
    timestamp: "2024-11-02T10:05:00Z",
  },
  {
    id: "sh2",
    permitRequestId: "pr1",
    fromStatus: "new",
    toStatus: "in_review",
    changedBy: "tm2",
    changedByName: "Mike Chen",
    reason: "Assigned for review",
    timestamp: "2024-11-03T09:00:00Z",
  },
  {
    id: "sh3",
    permitRequestId: "pr1",
    fromStatus: "in_review",
    toStatus: "submitted_to_jurisdiction",
    changedBy: "tm2",
    changedByName: "Mike Chen",
    reason: "Submitted to LA County portal",
    timestamp: "2024-11-05T14:00:00Z",
  },
  {
    id: "sh4",
    permitRequestId: "pr1",
    fromStatus: "submitted_to_jurisdiction",
    toStatus: "permit_ready",
    changedBy: "tm2",
    changedByName: "Mike Chen",
    reason: "Permit approved by jurisdiction",
    timestamp: "2024-12-10T11:00:00Z",
  },
  {
    id: "sh5",
    permitRequestId: "pr1",
    fromStatus: "permit_ready",
    toStatus: "completed",
    changedBy: "tm2",
    changedByName: "Mike Chen",
    reason: "Permit delivered to customer",
    timestamp: "2024-12-15T14:30:00Z",
  },
]

// Invoices
export const invoices: Invoice[] = [
  {
    id: "inv1",
    projectId: "p1",
    status: "paid",
    totalAmount: 450,
    lineItems: [
      { id: "li1", description: "Electrical Permit - Kitchen", amount: 250, permitId: "pr1" },
      { id: "li2", description: "Plumbing Permit - Kitchen", amount: 200, permitId: "pr2" },
    ],
    paymentLink: "https://pay.stripe.com/abc123",
    notes: "Thank you for choosing PermitAgent!",
    sentAt: "2024-12-10T12:00:00Z",
    paidAt: "2024-12-12T15:30:00Z",
    createdAt: "2024-12-10T11:30:00Z",
  },
  {
    id: "inv2",
    projectId: "p2",
    status: "sent",
    totalAmount: 350,
    lineItems: [
      { id: "li3", description: "Solar Permit", amount: 350, permitId: "pr3" },
    ],
    paymentLink: "https://pay.stripe.com/def456",
    sentAt: "2025-01-05T10:00:00Z",
    createdAt: "2025-01-05T09:45:00Z",
  },
]

// Activity Log
export const activityLog: ActivityLogEntry[] = [
  {
    id: "al1",
    entityType: "permit",
    entityId: "pr8",
    action: "created",
    details: "New electrical permit request submitted",
    userId: "system",
    userName: "System",
    timestamp: "2025-01-09T08:00:00Z",
  },
  {
    id: "al2",
    entityType: "permit",
    entityId: "pr4",
    action: "status_changed",
    details: "Status changed from In Review to Submitted to Jurisdiction",
    userId: "tm2",
    userName: "Mike Chen",
    timestamp: "2025-01-08T11:00:00Z",
  },
  {
    id: "al3",
    entityType: "permit",
    entityId: "pr4",
    action: "document_uploaded",
    details: "Screenshot uploaded: jurisdiction_submission.png",
    userId: "tm2",
    userName: "Mike Chen",
    timestamp: "2025-01-08T11:00:00Z",
  },
  {
    id: "al4",
    entityType: "permit",
    entityId: "pr5",
    action: "assigned",
    details: "Assigned to Emily Rodriguez",
    userId: "tm1",
    userName: "Sarah Johnson",
    timestamp: "2025-01-07T09:00:00Z",
  },
  {
    id: "al5",
    entityType: "invoice",
    entityId: "inv2",
    action: "sent",
    details: "Invoice sent to customer",
    userId: "tm1",
    userName: "Sarah Johnson",
    timestamp: "2025-01-05T10:00:00Z",
  },
  {
    id: "al6",
    entityType: "permit",
    entityId: "pr7",
    action: "automation_failed",
    details: "Automation failed: Missing contractor license",
    userId: "system",
    userName: "System",
    timestamp: "2025-01-05T10:15:00Z",
  },
  {
    id: "al7",
    entityType: "permit",
    entityId: "pr3",
    action: "status_changed",
    details: "Status changed to Pending Payment",
    userId: "tm3",
    userName: "Emily Rodriguez",
    timestamp: "2025-01-05T10:00:00Z",
  },
  {
    id: "al8",
    entityType: "invoice",
    entityId: "inv1",
    action: "paid",
    details: "Payment received: $450.00",
    userId: "system",
    userName: "System",
    timestamp: "2024-12-12T15:30:00Z",
  },
  {
    id: "al9",
    entityType: "permit",
    entityId: "pr1",
    action: "status_changed",
    details: "Status changed to Completed",
    userId: "tm2",
    userName: "Mike Chen",
    timestamp: "2024-12-15T14:30:00Z",
  },
  {
    id: "al10",
    entityType: "permit",
    entityId: "pr2",
    action: "status_changed",
    details: "Status changed to Completed",
    userId: "tm2",
    userName: "Mike Chen",
    timestamp: "2024-12-15T14:30:00Z",
  },
]

// Dashboard Metrics
export const dashboardMetrics: DashboardMetrics = {
  totalRequestsThisMonth: 4,
  pendingAction: 3,
  awaitingPayment: 1,
  completedThisWeek: 0,
  newPermits24h: 2,
}

// Analytics Data
export const analyticsData: AnalyticsData = {
  totalRevenue: 800,
  totalRequests: 8,
  formCompletionRate: 85,
  avgTimeToSubmit: 2.5,
  avgTimeToPayment: 5,
  requestsByStatus: [
    { status: "new", count: 3 },
    { status: "in_review", count: 1 },
    { status: "submitted_to_jurisdiction", count: 1 },
    { status: "pending_payment", count: 1 },
    { status: "completed", count: 2 },
  ],
  requestsByJurisdiction: [
    { jurisdiction: "Los Angeles County", count: 3 },
    { jurisdiction: "San Francisco", count: 1 },
    { jurisdiction: "Miami-Dade County", count: 2 },
    { jurisdiction: "Houston", count: 2 },
  ],
  requestsByPermitType: [
    { permitType: "Electrical", count: 5 },
    { permitType: "Plumbing", count: 2 },
    { permitType: "Solar", count: 1 },
  ],
  requestsByAgent: [
    { agent: "Mike Chen", count: 4, avgTime: 12 },
    { agent: "Emily Rodriguez", count: 2, avgTime: 8 },
    { agent: "Unassigned", count: 2, avgTime: 0 },
  ],
  requestsOverTime: [
    { date: "2024-11", count: 2 },
    { date: "2024-12", count: 3 },
    { date: "2025-01", count: 3 },
  ],
  revenueOverTime: [
    { date: "2024-11", revenue: 0 },
    { date: "2024-12", revenue: 450 },
    { date: "2025-01", revenue: 350 },
  ],
  automationSuccessRate: 62.5,
  stuckRequests: 1,
}

// Helper function to get grouped requests
export function getGroupedRequests(): GroupedRequests[] {
  const grouped: GroupedRequests[] = []

  for (const site of sites) {
    const customer = customers.find((c) => c.id === site.customerId)!
    const siteProjects = projects.filter((p) => p.siteId === site.id)

    if (siteProjects.length === 0) continue

    const projectsWithPermits = siteProjects.map((project) => ({
      project,
      permits: permitRequests.filter((pr) => pr.projectId === project.id),
    }))

    grouped.push({
      site,
      customer,
      projects: projectsWithPermits,
    })
  }

  return grouped
}

// Helper to get a single permit with all related data
export function getPermitWithDetails(permitId: string) {
  const permit = permitRequests.find((pr) => pr.id === permitId)
  if (!permit) return null

  const project = projects.find((p) => p.id === permit.projectId)!
  const site = sites.find((s) => s.id === project.siteId)!
  const customer = customers.find((c) => c.id === site.customerId)!
  const permitDocuments = documents.filter((d) => d.permitRequestId === permitId)
  const permitHistory = statusHistory.filter((sh) => sh.permitRequestId === permitId)
  const permitActivity = activityLog.filter(
    (al) => al.entityType === "permit" && al.entityId === permitId
  )

  return {
    permit,
    project,
    site,
    customer,
    documents: permitDocuments,
    statusHistory: permitHistory,
    activityLog: permitActivity,
  }
}

// Helper to get project with all permits
export function getProjectWithDetails(projectId: string) {
  const project = projects.find((p) => p.id === projectId)
  if (!project) return null

  const site = sites.find((s) => s.id === project.siteId)!
  const customer = customers.find((c) => c.id === site.customerId)!
  const projectPermits = permitRequests.filter((pr) => pr.projectId === projectId)
  const projectInvoice = invoices.find((inv) => inv.projectId === projectId)

  return {
    project,
    site,
    customer,
    permits: projectPermits,
    invoice: projectInvoice,
  }
}
