import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  UserPlus,
  Zap,
  Building,
  Mail,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
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
import { getGroupedRequests, jurisdictions, permitTypes, teamMembers } from "@/data/mock"
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
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set())
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [selectedPermits, setSelectedPermits] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const groupedRequests = getGroupedRequests()

  const toggleSite = (siteId: string) => {
    const newExpanded = new Set(expandedSites)
    if (newExpanded.has(siteId)) {
      newExpanded.delete(siteId)
    } else {
      newExpanded.add(siteId)
    }
    setExpandedSites(newExpanded)
  }

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects)
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId)
    } else {
      newExpanded.add(projectId)
    }
    setExpandedProjects(newExpanded)
  }

  const togglePermitSelection = (permitId: string) => {
    const newSelected = new Set(selectedPermits)
    if (newSelected.has(permitId)) {
      newSelected.delete(permitId)
    } else {
      newSelected.add(permitId)
    }
    setSelectedPermits(newSelected)
  }

  const expandAll = () => {
    const allSites = new Set(groupedRequests.map((g) => g.site.id))
    const allProjects = new Set(
      groupedRequests.flatMap((g) => g.projects.map((p) => p.project.id))
    )
    setExpandedSites(allSites)
    setExpandedProjects(allProjects)
  }

  const collapseAll = () => {
    setExpandedSites(new Set())
    setExpandedProjects(new Set())
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Requests"
        subtitle="Manage all permit requests"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
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
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by email, name, address, or permit ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>

          {selectedPermits.size > 0 && (
            <div className="flex items-center gap-2">
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
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Jurisdiction</label>
                <select className="w-full rounded-md border px-3 py-2 text-sm">
                  <option value="">All Jurisdictions</option>
                  {jurisdictions.map((j) => (
                    <option key={j.id} value={j.id}>{j.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Permit Type</label>
                <select className="w-full rounded-md border px-3 py-2 text-sm">
                  <option value="">All Types</option>
                  {permitTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>{pt.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select className="w-full rounded-md border px-3 py-2 text-sm">
                  <option value="">All Statuses</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Automation</label>
                <select className="w-full rounded-md border px-3 py-2 text-sm">
                  <option value="">All</option>
                  {Object.entries(automationConfig).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Assigned To</label>
                <select className="w-full rounded-md border px-3 py-2 text-sm">
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

        {/* Grouped Requests Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-10">
                  <Checkbox />
                </TableHead>
                <TableHead>Permit ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Automation</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedRequests.map((group) => (
                <>
                  {/* Site Header */}
                  <TableRow
                    key={`site-${group.site.id}`}
                    className="bg-muted/50 cursor-pointer hover:bg-muted"
                    onClick={() => toggleSite(group.site.id)}
                  >
                    <TableCell colSpan={9}>
                      <div className="flex items-center gap-3">
                        {expandedSites.has(group.site.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">{group.site.address}</span>
                          <span className="mx-2 text-muted-foreground">|</span>
                          <span className="text-sm text-muted-foreground">{group.site.jurisdictionName}</span>
                        </div>
                        <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {group.customer.email}
                          </span>
                          <span>{group.customer.name}</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Projects and Permits */}
                  {expandedSites.has(group.site.id) &&
                    group.projects.map((projectData) => (
                      <>
                        {/* Project Header */}
                        <TableRow
                          key={`project-${projectData.project.id}`}
                          className="bg-muted/30 cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleProject(projectData.project.id)}
                        >
                          <TableCell colSpan={9}>
                            <div className="flex items-center gap-3 pl-6">
                              {expandedProjects.has(projectData.project.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <div className="flex-1">
                                <Link
                                  to={`/projects/${projectData.project.id}`}
                                  className="font-medium hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {projectData.project.name}
                                </Link>
                                <span className="ml-2 text-sm text-muted-foreground">
                                  ({projectData.permits.length} permit{projectData.permits.length > 1 ? "s" : ""})
                                </span>
                              </div>
                              <Badge variant={invoiceConfig[projectData.project.invoiceStatus].variant}>
                                {invoiceConfig[projectData.project.invoiceStatus].label}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Permits */}
                        {expandedProjects.has(projectData.project.id) &&
                          projectData.permits.map((permit) => (
                            <TableRow key={permit.id}>
                              <TableCell></TableCell>
                              <TableCell onClick={(e) => e.stopPropagation()}>
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
                              <TableCell className="text-muted-foreground">
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
                          ))}
                      </>
                    ))}
                </>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
