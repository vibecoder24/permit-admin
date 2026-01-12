import { Link } from "react-router-dom"
import {
  AlertTriangle,
  Zap,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { FeatureInfo } from "@/components/ui/feature-info"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { permitRequests, teamMembers, sites, projects, customers } from "@/data/mock"
import { formatDateTime, cn } from "@/lib/utils"
import type { AutomationStatus } from "@/types"

const automationConfig: Record<AutomationStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  auto: { label: "Auto", variant: "success" },
  manual: { label: "Manual", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
}

export function QueuePage() {
  // Filter only new permits
  const newPermits = permitRequests
    .filter((pr) => pr.status === "new")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const failedCount = newPermits.filter((p) => p.automationStatus === "failed").length

  // Get related data for each permit
  const getPermitContext = (permit: typeof permitRequests[0]) => {
    const project = projects.find((p) => p.id === permit.projectId)!
    const site = sites.find((s) => s.id === project.siteId)!
    const customer = customers.find((c) => c.id === site.customerId)!
    return { site, customer }
  }

  const agents = teamMembers.filter((tm) => tm.role !== "viewer" && tm.status === "active")

  return (
    <div className="flex flex-col h-full">
      <Header
        title="New Permits Queue"
        subtitle={`${newPermits.length} permits awaiting review`}
        actions={
          <FeatureInfo
            title="Queue Page"
            priority="P0"
            description="Shows only permits with 'new' status - freshly submitted and not yet reviewed. Sorted oldest first (FIFO) to ensure timely processing."
            dataSource="GET /api/permits?status=new&sort=created_at:asc"
            importance="Primary intake view. All new customer submissions appear here first. Check this view daily to maintain response SLA."
          />
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Alert Banner */}
        {failedCount > 0 && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-red-900 dark:text-red-100">
                    {failedCount} permit{failedCount > 1 ? "s" : ""} require manual handling
                  </p>
                  <FeatureInfo
                    title="Failed Automation Alert"
                    priority="P0"
                    description="When automation fails (e.g., jurisdiction website down, validation errors), permits are flagged and highlighted. These need manual submission to the jurisdiction."
                    dataSource="GET /api/permits?status=new&automation=failed → failedCount"
                    importance="Critical priority. Failed automations mean permits are stuck. Manual intervention required to prevent customer delays."
                  />
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Automation failed - please review and submit manually
                </p>
              </div>
            </div>
          </div>
        )}

        {newPermits.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">All caught up!</h3>
            <p className="text-muted-foreground text-center max-w-md">
              There are no new permits waiting for review. Check back later or view all requests.
            </p>
            <Link to="/requests" className="mt-4">
              <Button variant="outline">View All Requests</Button>
            </Link>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permit ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Automation
                      <FeatureInfo
                        title="Automation Status"
                        priority="P0"
                        description="Shows if permit was auto-submitted (Auto), manually flagged (Manual), or failed automation (Failed). Failed permits are highlighted in red."
                        dataSource="permit.automationStatus: 'auto' | 'manual' | 'failed'"
                        importance="Identifies work type. Auto permits need review only. Failed permits need manual jurisdiction submission."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Submitted
                      <FeatureInfo
                        title="Wait Time"
                        priority="P1"
                        description="When the customer submitted the permit. Shows warning badge if waiting > 24 hours. Oldest permits sorted first."
                        dataSource="permit.createdAt → Calculate hours since submission"
                        importance="SLA tracking. Permits waiting > 24h need urgent attention to maintain customer satisfaction."
                      />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Assign To
                      <FeatureInfo
                        title="Agent Assignment"
                        priority="P1"
                        description="Dropdown to assign permit to an available agent. Only active agents with agent/admin roles are shown."
                        dataSource="GET /api/team?role=agent,admin&status=active → POST /api/permits/{id}/assign"
                        importance="Workload distribution. Assign permits to spread work evenly and establish ownership."
                      />
                    </div>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newPermits.map((permit) => {
                  const { site, customer } = getPermitContext(permit)
                  const waitTime = Math.floor(
                    (Date.now() - new Date(permit.createdAt).getTime()) / (1000 * 60 * 60)
                  )

                  return (
                    <TableRow
                      key={permit.id}
                      className={cn(
                        permit.automationStatus === "failed" && "bg-red-50/50 dark:bg-red-950/20"
                      )}
                    >
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
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{site.address.split(",")[0]}</p>
                          <p className="text-xs text-muted-foreground">{site.jurisdictionName}</p>
                        </div>
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
                        {permit.automationStatus === "failed" && permit.automationFailureReason && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-[200px] truncate">
                            {permit.automationFailureReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatDateTime(permit.createdAt)}
                          </span>
                        </div>
                        {waitTime > 24 && (
                          <Badge variant="warning" className="mt-1 text-xs">
                            {waitTime}h waiting
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          options={agents.map((a) => ({ value: a.id, label: a.name }))}
                          placeholder="Select..."
                          className="w-36"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/permits/${permit.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              Review
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  )
}
