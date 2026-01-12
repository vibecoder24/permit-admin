import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Filter,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  UserPlus,
  Zap,
  MapPin,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAllPermitsFlat, jurisdictions, permitTypes, teamMembers } from "@/data/mock"
import { formatDate, cn } from "@/lib/utils"
import type { PermitStatus, AutomationStatus, InvoiceStatus } from "@/types"

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

const automationConfig: Record<AutomationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  auto: { label: "Auto", variant: "success" },
  manual: { label: "Manual", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
}

const invoiceConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  not_created: { label: "Not Invoiced", variant: "outline" },
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Pending", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  refunded: { label: "Refunded", variant: "destructive" },
}

export function RequestsPage() {
  const [selectedPermits, setSelectedPermits] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filterJurisdiction, setFilterJurisdiction] = useState("")
  const [filterPermitType, setFilterPermitType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterAutomation, setFilterAutomation] = useState("")
  const [filterAssigned, setFilterAssigned] = useState("")

  const allPermits = getAllPermitsFlat()

  // Filter permits based on search and filters
  const filteredPermits = useMemo(() => {
    return allPermits.filter((permit) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          permit.id.toLowerCase().includes(query) ||
          permit.customerEmail.toLowerCase().includes(query) ||
          permit.customerName.toLowerCase().includes(query) ||
          permit.siteAddress.toLowerCase().includes(query) ||
          permit.projectName.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Filter by jurisdiction
      if (filterJurisdiction && permit.jurisdictionId !== filterJurisdiction) return false

      // Filter by permit type
      if (filterPermitType && permit.permitTypeId !== filterPermitType) return false

      // Filter by status
      if (filterStatus && permit.status !== filterStatus) return false

      // Filter by automation status
      if (filterAutomation && permit.automationStatus !== filterAutomation) return false

      // Filter by assigned
      if (filterAssigned === "unassigned" && permit.assignedTo) return false
      if (filterAssigned && filterAssigned !== "unassigned" && permit.assignedTo !== filterAssigned) return false

      return true
    })
  }, [allPermits, searchQuery, filterJurisdiction, filterPermitType, filterStatus, filterAutomation, filterAssigned])

  const togglePermitSelection = (permitId: string) => {
    const newSelected = new Set(selectedPermits)
    if (newSelected.has(permitId)) {
      newSelected.delete(permitId)
    } else {
      newSelected.add(permitId)
    }
    setSelectedPermits(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedPermits.size === filteredPermits.length) {
      setSelectedPermits(new Set())
    } else {
      setSelectedPermits(new Set(filteredPermits.map((p) => p.id)))
    }
  }

  const clearFilters = () => {
    setFilterJurisdiction("")
    setFilterPermitType("")
    setFilterStatus("")
    setFilterAutomation("")
    setFilterAssigned("")
  }

  const hasActiveFilters = filterJurisdiction || filterPermitType || filterStatus || filterAutomation || filterAssigned

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Requests"
        subtitle="Manage all permit requests"
        actions={
          <div className="flex items-center gap-2">
            <FeatureInfo
              title="Requests Page"
              priority="P0"
              description="Main working view for all permit requests. Flat table showing all permits with project, customer, and site info as columns. Supports search, filters, and bulk actions."
              dataSource="GET /api/permits?include=project,site,customer → getAllPermitsFlat()"
              importance="Core workflow screen. Agents spend most time here reviewing, assigning, and processing permit requests."
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
        {/* Search and Actions Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by permit ID, project, customer, address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <FeatureInfo
                title="Search"
                priority="P1"
                description="Full-text search across permit ID, project name, customer email/name, and site address. Results filter in real-time."
                dataSource="Client-side filter on loaded data using searchQuery state"
                importance="Quick lookup tool. Find specific permits without scrolling through the table."
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredPermits.length} of {allPermits.length} permits
            </span>
          </div>

          {selectedPermits.size > 0 && (
            <div className="flex items-center gap-2">
              <FeatureInfo
                title="Bulk Selection"
                priority="P1"
                description="Select multiple permits using checkboxes, then perform bulk actions like assignment."
                dataSource="Local state: selectedPermits Set → POST /api/permits/bulk-assign"
                importance="Efficiency feature for assigning multiple permits at once, especially during shift handoffs."
              />
              <span className="text-sm text-muted-foreground">
                {selectedPermits.size} selected
              </span>
              <Button variant="outline" size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Assign
              </Button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-4 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Filter Permits</h3>
                <FeatureInfo
                  title="Filters Panel"
                  priority="P1"
                  description="Advanced filtering by jurisdiction, permit type, status, automation status, and assigned agent. Multiple filters can be combined (AND logic)."
                  dataSource="Client-side filtering using filter state variables"
                  importance="Helps agents find specific permits. Commonly used: 'failed automation' to find manual work, 'unassigned' for new intake."
                />
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-4">
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
                <label className="text-sm font-medium mb-2 block">Permit Type</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={filterPermitType}
                  onChange={(e) => setFilterPermitType(e.target.value)}
                >
                  <option value="">All Types</option>
                  {permitTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>{pt.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Automation</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={filterAutomation}
                  onChange={(e) => setFilterAutomation(e.target.value)}
                >
                  <option value="">All</option>
                  {Object.entries(automationConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Assigned To</label>
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={filterAssigned}
                  onChange={(e) => setFilterAssigned(e.target.value)}
                >
                  <option value="">All Agents</option>
                  <option value="unassigned">Unassigned</option>
                  {teamMembers.filter((tm) => tm.role !== "viewer").map((tm) => (
                    <option key={tm.id} value={tm.id}>{tm.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Permits Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedPermits.size === filteredPermits.length && filteredPermits.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Permit ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Project
                    <FeatureInfo
                      title="Project Column"
                      priority="P1"
                      description="The project this permit belongs to. Click to view all permits in the project and manage invoicing."
                      dataSource="project.name from joined data"
                      importance="Groups related permits. One project may have multiple permit types (e.g., electrical + plumbing for a kitchen renovation)."
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Customer
                    <FeatureInfo
                      title="Customer Column"
                      priority="P2"
                      description="Customer name and email who submitted the permit request."
                      dataSource="customer.name, customer.email from joined data"
                      importance="Identify the requester for communication and billing purposes."
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Address
                    <FeatureInfo
                      title="Site Address"
                      priority="P1"
                      description="Physical location where the permit work will be done. Includes jurisdiction info."
                      dataSource="site.address, site.jurisdictionName from joined data"
                      importance="Critical for jurisdiction submission. The address determines which city/county processes the permit."
                    />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Automation</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                    No permits found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermits.map((permit) => (
                  <TableRow key={permit.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPermits.has(permit.id)}
                        onCheckedChange={() => togglePermitSelection(permit.id)}
                      />
                    </TableCell>
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
                      <Link
                        to={`/projects/${permit.projectId}`}
                        className="hover:underline"
                      >
                        {permit.projectName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{permit.customerName}</p>
                        <p className="text-xs text-muted-foreground">{permit.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm">{permit.siteAddress.split(',')[0]}</p>
                          <p className="text-xs text-muted-foreground">{permit.jurisdictionName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[permit.status].variant}>
                        {statusConfig[permit.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={automationConfig[permit.automationStatus].variant}
                        className={cn(
                          permit.automationStatus === "failed" && "gap-1"
                        )}
                      >
                        {permit.automationStatus === "failed" && (
                          <Zap className="h-3 w-3" />
                        )}
                        {automationConfig[permit.automationStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={invoiceConfig[permit.invoiceStatus].variant}>
                        {invoiceConfig[permit.invoiceStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(permit.createdAt)}
                    </TableCell>
                    <TableCell>
                      {permit.assignedToName || (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.location.href = `/permits/${permit.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.location.href = `/projects/${permit.projectId}`}>
                            View Project
                          </DropdownMenuItem>
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
