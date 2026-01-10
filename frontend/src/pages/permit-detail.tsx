import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  User,
  MapPin,
  Building,
  FileText,
  MessageSquare,
  Code,
  AlertTriangle,
  CheckCircle,
  Upload,
  Clock,
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  Zap,
  RefreshCw,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPermitWithDetails, teamMembers } from "@/data/mock"
import { formatDate, formatDateTime, cn } from "@/lib/utils"
import type { PermitStatus } from "@/types"

const statusOptions = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In Review" },
  { value: "submitted_to_jurisdiction", label: "Submitted to Jurisdiction" },
  { value: "pending_payment", label: "Pending Payment" },
  { value: "payment_received", label: "Payment Received" },
  { value: "permit_processing", label: "Permit Processing" },
  { value: "permit_ready", label: "Permit Ready" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
  { value: "rejected", label: "Rejected" },
]

const statusConfig: Record<PermitStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500" },
  in_review: { label: "In Review", color: "bg-yellow-500" },
  submitted_to_jurisdiction: { label: "Submitted", color: "bg-purple-500" },
  pending_payment: { label: "Pending Payment", color: "bg-orange-500" },
  payment_received: { label: "Payment Received", color: "bg-green-500" },
  permit_processing: { label: "Processing", color: "bg-indigo-500" },
  permit_ready: { label: "Ready", color: "bg-emerald-500" },
  completed: { label: "Completed", color: "bg-green-600" },
  on_hold: { label: "On Hold", color: "bg-gray-500" },
  rejected: { label: "Rejected", color: "bg-red-500" },
}

export function PermitDetailPage() {
  const { permitId } = useParams<{ permitId: string }>()
  const [chatExpanded, setChatExpanded] = useState(true)
  const [jsonExpanded, setJsonExpanded] = useState(true)
  const [newStatus, setNewStatus] = useState("")
  const [statusReason, setStatusReason] = useState("")

  const data = getPermitWithDetails(permitId || "")

  if (!data) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Permit Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">The permit you're looking for doesn't exist.</p>
            <Link to="/requests">
              <Button>Back to Requests</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { permit, project, site, customer, documents, statusHistory, activityLog } = data

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(permit.agentOutput, null, 2))
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title={`Permit ${permit.id}`}
        subtitle={permit.permitTypeName}
        actions={
          <div className="flex items-center gap-2">
            <Select
              options={teamMembers
                .filter((tm) => tm.role !== "viewer" && tm.status === "active")
                .map((tm) => ({ value: tm.id, label: tm.name }))}
              value={permit.assignedTo || ""}
              placeholder="Assign to..."
              className="w-48"
            />
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/requests" className="hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link to={`/customers/${customer.id}`} className="hover:text-foreground">
            {customer.name}
          </Link>
          <span>/</span>
          <span>{site.address.split(",")[0]}</span>
          <span>/</span>
          <Link to={`/projects/${project.id}`} className="hover:text-foreground">
            {project.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{permit.id}</span>
        </div>

        {/* Status and Assignment Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", statusConfig[permit.status].color)} />
              <span className="text-lg font-medium">{statusConfig[permit.status].label}</span>
            </div>
            {permit.automationStatus === "failed" && (
              <Badge variant="destructive" className="gap-1">
                <Zap className="h-3 w-3" />
                Automation Failed
              </Badge>
            )}
            {permit.automationStatus === "auto" && (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Auto Submitted
              </Badge>
            )}
          </div>
          {permit.assignedTo && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Assigned to:</span>
              <Avatar fallback={permit.assignedToName || ""} size="sm" />
              <span className="text-sm font-medium">{permit.assignedToName}</span>
            </div>
          )}
        </div>

        {/* Automation Failure Alert */}
        {permit.automationStatus === "failed" && permit.automationFailureReason && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900 dark:text-red-100">Automation Failed</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {permit.automationFailureReason}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">Request Info</TabsTrigger>
                <TabsTrigger value="chat">Chat History</TabsTrigger>
                <TabsTrigger value="json">Agent Output</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
              </TabsList>

              {/* Request Info Tab */}
              <TabsContent value="info">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Customer Info */}
                      <div>
                        <h3 className="flex items-center gap-2 font-medium mb-3">
                          <User className="h-4 w-4" />
                          Customer
                        </h3>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Name</dt>
                            <dd>{customer.name}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                              <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                                {customer.email}
                              </a>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>{customer.phone}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Site Info */}
                      <div>
                        <h3 className="flex items-center gap-2 font-medium mb-3">
                          <MapPin className="h-4 w-4" />
                          Site
                        </h3>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Address</dt>
                            <dd>{site.address}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Jurisdiction</dt>
                            <dd>{site.jurisdictionName}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Project Info */}
                      <div>
                        <h3 className="flex items-center gap-2 font-medium mb-3">
                          <Building className="h-4 w-4" />
                          Project
                        </h3>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Name</dt>
                            <dd>
                              <Link to={`/projects/${project.id}`} className="text-primary hover:underline">
                                {project.name}
                              </Link>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Scope of Work</dt>
                            <dd>{project.scopeOfWork}</dd>
                          </div>
                        </dl>
                      </div>

                      {/* Permit Info */}
                      <div>
                        <h3 className="flex items-center gap-2 font-medium mb-3">
                          <FileText className="h-4 w-4" />
                          Permit
                        </h3>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-muted-foreground">Type</dt>
                            <dd>{permit.permitTypeName}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Submitted</dt>
                            <dd>{formatDateTime(permit.createdAt)}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Last Updated</dt>
                            <dd>{formatDateTime(permit.updatedAt)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chat History Tab */}
              <TabsContent value="chat">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Conversation
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setChatExpanded(!chatExpanded)}
                      >
                        {chatExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {chatExpanded && (
                    <CardContent>
                      {permit.chatHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No chat history available
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {permit.chatHistory.map((message) => (
                            <div
                              key={message.id}
                              className={cn(
                                "flex gap-3",
                                message.role === "customer" ? "flex-row-reverse" : ""
                              )}
                            >
                              <Avatar
                                fallback={message.role === "customer" ? customer.name : "Bot"}
                                size="sm"
                              />
                              <div
                                className={cn(
                                  "flex-1 max-w-[80%]",
                                  message.role === "customer" ? "text-right" : ""
                                )}
                              >
                                <div
                                  className={cn(
                                    "inline-block rounded-lg px-4 py-2 text-sm",
                                    message.role === "customer"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  )}
                                >
                                  {message.content}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDateTime(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* JSON Output Tab */}
              <TabsContent value="json">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Extracted Data
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={copyJson}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setJsonExpanded(!jsonExpanded)}
                        >
                          {jsonExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {jsonExpanded && (
                    <CardContent>
                      <pre className="rounded-lg bg-muted p-4 text-sm overflow-auto max-h-96">
                        <code>{JSON.stringify(permit.agentOutput, null, 2)}</code>
                      </pre>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents">
                <Card>
                  <CardContent className="pt-6">
                    {documents.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Document
                        </Button>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Uploaded By</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {documents.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell className="font-medium">{doc.fileName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {doc.type.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>{doc.uploadedByName}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(doc.uploadedAt)}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {statusHistory.length === 0 && activityLog.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No activity recorded yet
                        </p>
                      ) : (
                        [...statusHistory, ...activityLog]
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .map((entry, index) => (
                            <div key={index} className="flex gap-3 text-sm">
                              <div className="flex flex-col items-center">
                                <div className="rounded-full bg-muted p-2">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                </div>
                                {index < statusHistory.length + activityLog.length - 1 && (
                                  <div className="w-px flex-1 bg-border mt-2" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <p>
                                  <span className="font-medium">
                                    {"changedByName" in entry ? entry.changedByName : entry.userName}
                                  </span>{" "}
                                  <span className="text-muted-foreground">
                                    {"toStatus" in entry
                                      ? `changed status to ${statusConfig[entry.toStatus].label}`
                                      : entry.details}
                                  </span>
                                </p>
                                {"reason" in entry && entry.reason && (
                                  <p className="text-muted-foreground mt-1">
                                    Reason: {entry.reason}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDateTime(entry.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>New Status</Label>
                  <Select
                    options={statusOptions}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="Select status..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reason (required)</Label>
                  <Textarea
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Enter reason for status change..."
                    rows={3}
                  />
                </div>
                <Button className="w-full" disabled={!newStatus || !statusReason}>
                  Update Status
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Submitted</dt>
                    <dd>{formatDate(permit.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last Updated</dt>
                    <dd>{formatDate(permit.updatedAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status Changes</dt>
                    <dd>{statusHistory.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Documents</dt>
                    <dd>{documents.length}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
