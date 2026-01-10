import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Plus,
  Send,
  RefreshCw,
  Download,
  Edit,
  Check,
  X,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { getProjectWithDetails, activityLog } from "@/data/mock"
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import type { PermitStatus, InvoiceStatus } from "@/types"

const statusConfig: Record<PermitStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  new: { label: "New", variant: "info" },
  in_review: { label: "In Review", variant: "warning" },
  submitted_to_jurisdiction: { label: "Submitted", variant: "secondary" },
  pending_payment: { label: "Pending Payment", variant: "warning" },
  payment_received: { label: "Payment Received", variant: "success" },
  permit_processing: { label: "Processing", variant: "secondary" },
  permit_ready: { label: "Ready", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "outline" },
  rejected: { label: "Rejected", variant: "destructive" },
}

const invoiceStatusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  not_created: { label: "Not Created", variant: "outline" },
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  refunded: { label: "Refunded", variant: "destructive" },
}

export function ProjectViewPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { hasPermission } = useAuthStore()
  const [isEditingName, setIsEditingName] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)

  const data = getProjectWithDetails(projectId || "")

  if (!data) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Project Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
            <Link to="/requests">
              <Button>Back to Requests</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { project, site, customer, permits, invoice } = data

  const projectActivity = activityLog.filter(
    (a) =>
      (a.entityType === "project" && a.entityId === project.id) ||
      (a.entityType === "permit" && permits.some((p) => p.id === a.entityId)) ||
      (a.entityType === "invoice" && invoice?.id === a.entityId)
  )

  const handleNameSave = () => {
    // In a real app, this would make an API call
    setIsEditingName(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Project Details"
        actions={
          hasPermission("raise_invoice") && !invoice && (
            <Dialog open={showCreateInvoice} onOpenChange={setShowCreateInvoice}>
              <DialogTrigger asChild>
                <Button>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Invoice</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Line Items</Label>
                    {permits.map((permit, index) => (
                      <div key={permit.id} className="flex items-center gap-4">
                        <Input
                          defaultValue={`${permit.permitTypeName} Permit`}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          defaultValue={150 + index * 50}
                          className="w-32"
                          placeholder="Amount"
                        />
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Line Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Add any notes for the customer..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(permits.length * 200)}
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateInvoice(false)}>
                    Save as Draft
                  </Button>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invoice
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
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
          <span className="text-foreground">{project.name}</span>
        </div>

        {/* Project Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={projectName || project.name}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="text-xl font-bold w-64"
                    />
                    <Button size="icon" variant="ghost" onClick={handleNameSave}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditingName(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{project.name}</h2>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setProjectName(project.name)
                        setIsEditingName(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-muted-foreground mt-1">{project.scopeOfWork}</p>
              </div>
              <Badge variant={invoiceStatusConfig[project.invoiceStatus].variant}>
                Invoice: {invoiceStatusConfig[project.invoiceStatus].label}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Site Address</p>
                <p className="font-medium">{site.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jurisdiction</p>
                <p className="font-medium">{site.jurisdictionName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Permits Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Permits ({permits.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permit ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permits.map((permit) => (
                      <TableRow key={permit.id}>
                        <TableCell>
                          <Link
                            to={`/permits/${permit.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {permit.id}
                          </Link>
                        </TableCell>
                        <TableCell>{permit.permitTypeName}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[permit.status].variant}>
                            {statusConfig[permit.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {permit.assignedToName || (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(permit.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Link to={`/permits/${permit.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Activity Log</CardTitle>
              </CardHeader>
              <CardContent>
                {projectActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No activity recorded
                  </p>
                ) : (
                  <div className="space-y-3">
                    {projectActivity.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="flex gap-3 text-sm">
                        <div className="rounded-full bg-muted p-1.5 h-fit">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <div>
                          <p>
                            <span className="font-medium">{activity.userName}</span>{" "}
                            <span className="text-muted-foreground">
                              {activity.details.toLowerCase()}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Invoice Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Invoice
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoice ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={invoiceStatusConfig[invoice.status].variant}>
                        {invoiceStatusConfig[invoice.status].label}
                      </Badge>
                      <span className="text-xl font-bold">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      {invoice.lineItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.description}</span>
                          <span>{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t space-y-2 text-sm">
                      {invoice.sentAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sent</span>
                          <span>{formatDate(invoice.sentAt)}</span>
                        </div>
                      )}
                      {invoice.paidAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Paid</span>
                          <span>{formatDate(invoice.paidAt)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" className="flex-1" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      {invoice.status === "sent" && (
                        <Button variant="outline" className="flex-1" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend
                        </Button>
                      )}
                    </div>

                    {hasPermission("raise_invoice") && invoice.status === "paid" && (
                      <Button variant="destructive" className="w-full" size="sm">
                        Process Refund
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">No invoice created yet</p>
                    {hasPermission("raise_invoice") && (
                      <Button onClick={() => setShowCreateInvoice(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
