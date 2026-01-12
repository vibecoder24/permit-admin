import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Filter,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  DollarSign,
  MapPin,
  FileText,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { FeatureInfo } from "@/components/ui/feature-info"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllProjectsWithSummary, jurisdictions } from "@/data/mock"
import { formatDate } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import type { InvoiceStatus, PermitStatus } from "@/types"

const invoiceStatusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  not_created: { label: "Not Created", variant: "outline" },
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Pending", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  refunded: { label: "Refunded", variant: "destructive" },
}

const statusLabels: Record<PermitStatus, string> = {
  new: "New",
  in_review: "In Review",
  submitted_to_jurisdiction: "Submitted",
  pending_payment: "Pending Payment",
  payment_received: "Payment Received",
  permit_processing: "Processing",
  permit_ready: "Ready",
  completed: "Completed",
  on_hold: "On Hold",
  rejected: "Rejected",
}

export function ProjectsPage() {
  const navigate = useNavigate()
  const { hasPermission } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filterJurisdiction, setFilterJurisdiction] = useState("")
  const [filterInvoiceStatus, setFilterInvoiceStatus] = useState("")
  const [filterHasPending, setFilterHasPending] = useState(false)

  const allProjects = getAllProjectsWithSummary()

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          project.name.toLowerCase().includes(query) ||
          project.customerEmail.toLowerCase().includes(query) ||
          project.customerName.toLowerCase().includes(query) ||
          project.siteAddress.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Filter by jurisdiction
      if (filterJurisdiction && project.jurisdictionId !== filterJurisdiction) return false

      // Filter by invoice status
      if (filterInvoiceStatus && project.invoiceStatus !== filterInvoiceStatus) return false

      // Filter by has pending permits
      if (filterHasPending) {
        const hasPending = project.statusCounts["new"] > 0 ||
          project.statusCounts["in_review"] > 0 ||
          project.statusCounts["submitted_to_jurisdiction"] > 0 ||
          project.statusCounts["pending_payment"] > 0 ||
          project.statusCounts["permit_processing"] > 0
        if (!hasPending) return false
      }

      return true
    })
  }, [allProjects, searchQuery, filterJurisdiction, filterInvoiceStatus, filterHasPending])

  const clearFilters = () => {
    setFilterJurisdiction("")
    setFilterInvoiceStatus("")
    setFilterHasPending(false)
  }

  const hasActiveFilters = filterJurisdiction || filterInvoiceStatus || filterHasPending

  // Format status breakdown for tooltip
  const formatStatusBreakdown = (statusCounts: Record<string, number>) => {
    return Object.entries(statusCounts)
      .map(([status, count]) => `${count} ${statusLabels[status as PermitStatus] || status}`)
      .join(", ")
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Projects"
        subtitle="Manage projects and invoicing"
        actions={
          <div className="flex items-center gap-2">
            <FeatureInfo
              title="Projects Page"
              priority="P1"
              description="Project-level management view showing all projects with aggregated permit information. Used for invoicing, tracking overall progress, and customer organization."
              dataSource="GET /api/projects?include=permits,invoice → getAllProjectsWithSummary()"
              importance="Admin view for billing and project oversight. See which projects need invoicing, track completion rates."
            />
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by project, customer, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredProjects.length} of {allProjects.length} projects
            </span>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-4 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Filter Projects</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Jurisdiction</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={filterJurisdiction}
                  onChange={(e) => setFilterJurisdiction(e.target.value)}
                >
                  <option value="">All Jurisdictions</option>
                  {jurisdictions.map((j) => (
                    <option key={j.id} value={j.id}>{j.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Invoice Status</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={filterInvoiceStatus}
                  onChange={(e) => setFilterInvoiceStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {Object.entries(invoiceStatusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={filterHasPending}
                    onChange={(e) => setFilterHasPending(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Has pending permits
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* Projects Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Permits
                    <FeatureInfo
                      title="Permits Column"
                      priority="P2"
                      description="Shows total permits in the project with a status breakdown on hover. Click to see detailed permit list in Project View."
                      dataSource="Aggregated from permitRequests by projectId"
                      importance="Quick overview of project scope and current work status."
                    />
                  </div>
                </TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Invoice
                    <FeatureInfo
                      title="Invoice Status"
                      priority="P1"
                      description="Invoice status for the project. Admins can create invoices from Project View. Invoices bundle all permits in a project."
                      dataSource="project.invoiceStatus + invoices table"
                      importance="Key for revenue tracking. Filter by 'Not Created' to find projects needing billing."
                    />
                  </div>
                </TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No projects found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link
                        to={`/projects/${project.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {project.scopeOfWork}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.customerName}</p>
                        <p className="text-xs text-muted-foreground">{project.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm">{project.siteAddress.split(',')[0]}</p>
                          <p className="text-xs text-muted-foreground">{project.jurisdictionName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5" title={formatStatusBreakdown(project.statusCounts)}>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{project.permitsCount}</span>
                        <span className="text-muted-foreground text-sm">
                          permit{project.permitsCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${project.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">
                          {project.progressPercent}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={invoiceStatusConfig[project.invoiceStatus].variant}>
                        {invoiceStatusConfig[project.invoiceStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(project.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Project
                          </DropdownMenuItem>
                          {hasPermission("raise_invoice") && project.invoiceStatus === "not_created" && (
                            <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}`)}>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Create Invoice
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
