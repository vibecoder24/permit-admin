import { Link } from "react-router-dom"
import {
  FileText,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  User,
  Zap,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FeatureInfo } from "@/components/ui/feature-info"
import { dashboardMetrics, activityLog, permitRequests } from "@/data/mock"
import { formatDateTime, cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  in_review: "bg-yellow-500",
  submitted_to_jurisdiction: "bg-purple-500",
  pending_payment: "bg-orange-500",
  payment_received: "bg-green-500",
  permit_processing: "bg-indigo-500",
  permit_ready: "bg-emerald-500",
  completed: "bg-green-600",
  on_hold: "bg-gray-500",
  rejected: "bg-red-500",
}

const quickFilters = [
  { label: "My Assigned", count: 3, href: "/requests?assigned=me" },
  { label: "Needs Manual", count: 2, href: "/requests?automation=failed" },
  { label: "Stuck >3 days", count: 1, href: "/requests?stuck=true" },
]

export function DashboardPage() {
  const newPermits = permitRequests.filter((pr) => pr.status === "new")
  const recentActivity = activityLog.slice(0, 10)

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle="Overview of your permit pipeline" />

      <div className="flex-1 overflow-auto p-6">
        {/* New Permits Alert */}
        {dashboardMetrics.newPermits24h > 0 && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {dashboardMetrics.newPermits24h} new permit{dashboardMetrics.newPermits24h > 1 ? "s" : ""} in the last 24 hours
                  </p>
                  <FeatureInfo
                    title="New Permits Alert"
                    priority="P0"
                    description="Shows count of permit requests submitted in the last 24 hours that haven't been reviewed yet."
                    dataSource="GET /api/permits?status=new&created_after=24h → dashboardMetrics.newPermits24h"
                    importance="Critical for ensuring no new requests are missed. Agents should review new permits daily to maintain SLA."
                  />
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Review and assign them to your team
                </p>
              </div>
            </div>
            <Link to="/queue">
              <Button>
                View Queue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Requests (This Month)
                </CardTitle>
                <FeatureInfo
                  title="Total Requests"
                  priority="P1"
                  description="Count of all permit requests submitted during the current calendar month, regardless of status."
                  dataSource="GET /api/permits?created_after=month_start → COUNT(*)"
                  importance="Key volume metric for tracking business growth and capacity planning. Compare month-over-month."
                />
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardMetrics.totalRequestsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Action
                </CardTitle>
                <FeatureInfo
                  title="Pending Action"
                  priority="P0"
                  description="Count of permits that require agent action - includes statuses: new, in_review, automation_failed. These are blocking items."
                  dataSource="GET /api/permits?status=new,in_review,failed → COUNT(*)"
                  importance="Critical workload indicator. High numbers mean backlog is building up. Should be monitored daily."
                />
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardMetrics.pendingAction}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Awaiting Payment
                </CardTitle>
                <FeatureInfo
                  title="Awaiting Payment"
                  priority="P1"
                  description="Count of permits where invoice has been sent but payment hasn't been received yet. Status: pending_payment."
                  dataSource="GET /api/permits?status=pending_payment → COUNT(*)"
                  importance="Revenue tracking - these represent unbilled work. Follow up on overdue invoices to maintain cash flow."
                />
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardMetrics.awaitingPayment}</div>
              <p className="text-xs text-muted-foreground">
                Invoices sent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed (This Week)
                </CardTitle>
                <FeatureInfo
                  title="Completed This Week"
                  priority="P2"
                  description="Count of permits that reached 'completed' status in the last 7 days. Customer has received their permit."
                  dataSource="GET /api/permits?status=completed&updated_after=7d → COUNT(*)"
                  importance="Team productivity metric. Tracks throughput and helps identify if team is keeping pace with incoming volume."
                />
              </div>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardMetrics.completedThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                Permits delivered
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Filters */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Quick Filters:</span>
            <FeatureInfo
              title="Quick Filters"
              priority="P1"
              description="One-click filters to jump to commonly needed permit views. Each button navigates to the Requests page with pre-applied filters."
              dataSource="Static filter presets → Navigate to /requests with query params"
              importance="Speeds up daily workflow. Agents can quickly access their assigned items, failed automations, or stuck permits."
            />
          </div>
          {quickFilters.map((filter) => (
            <Link key={filter.label} to={filter.href}>
              <Button variant="outline" className="gap-2">
                {filter.label}
                <Badge variant="secondary">{filter.count}</Badge>
              </Button>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* New Permits */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">New Permits</CardTitle>
                  <FeatureInfo
                    title="New Permits List"
                    priority="P0"
                    description="Shows the 5 most recent permit requests with 'new' status. Displays permit ID, type, submission time, and automation failures."
                    dataSource="GET /api/permits?status=new&limit=5&sort=created_at:desc"
                    importance="Primary intake view. Every new request starts here. Click to review details and begin processing."
                  />
                </div>
                <Link to="/queue">
                  <Button variant="ghost" size="sm">
                    View all
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {newPermits.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No new permits in the queue
                  </p>
                ) : (
                  newPermits.slice(0, 5).map((permit) => (
                    <Link
                      key={permit.id}
                      to={`/permits/${permit.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            statusColors[permit.status]
                          )}
                        />
                        <div>
                          <p className="text-sm font-medium">{permit.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {permit.permitTypeName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {permit.automationStatus === "failed" && (
                          <Badge variant="destructive" className="text-xs">
                            <Zap className="mr-1 h-3 w-3" />
                            Failed
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(permit.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <FeatureInfo
                    title="Recent Activity Feed"
                    priority="P2"
                    description="Shows the 10 most recent actions across all permits - status changes, document uploads, comments, assignments, etc."
                    dataSource="GET /api/activity?limit=10&sort=timestamp:desc"
                    importance="Team awareness and audit trail. See what's happening across the system. Useful for handoffs and tracking progress."
                  />
                </div>
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="mt-0.5 rounded-full bg-muted p-1.5">
                      <User className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
