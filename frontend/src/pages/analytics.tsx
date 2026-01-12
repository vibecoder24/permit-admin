import { useState } from "react"
import {
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  Zap,
  Download,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeatureInfo } from "@/components/ui/feature-info"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { analyticsData } from "@/data/mock"
import { formatCurrency } from "@/lib/utils"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

const statusColors: Record<string, string> = {
  new: "#3B82F6",
  in_review: "#F59E0B",
  submitted_to_jurisdiction: "#8B5CF6",
  pending_payment: "#F97316",
  completed: "#22C55E",
}

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("month")

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Analytics"
        subtitle="Track performance and identify bottlenecks"
        actions={
          <div className="flex items-center gap-2">
            <FeatureInfo
              title="Analytics Page"
              priority="P2"
              description="Business intelligence dashboard showing key metrics, trends, and team performance. Filter by time range to analyze different periods."
              dataSource="GET /api/analytics?range={dateRange} → analyticsData object with aggregated metrics"
              importance="Track business health. Monitor revenue, throughput, bottlenecks, and agent efficiency. Use for reporting and identifying improvement areas."
            />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 90 days</option>
              <option value="year">Last year</option>
            </select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Summary Cards */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold">Key Metrics</h3>
            <FeatureInfo
              title="Key Metrics"
              priority="P2"
              description="5 key performance indicators: Total Revenue (paid invoices), Total Requests, Completion Rate (forms fully submitted), Avg Time to Submit (to jurisdiction), Automation Rate (auto vs manual)."
              dataSource="GET /api/analytics/summary → Aggregated from permits, invoices, and activity data"
              importance="Quick health check of business performance. Green/red indicators show period-over-period change."
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(analyticsData.totalRevenue)}
              </div>
              <p className="text-xs text-green-600">+15% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalRequests}</div>
              <p className="text-xs text-green-600">+8 from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.formCompletionRate}%</div>
              <p className="text-xs text-muted-foreground">Form submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Time to Submit
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.avgTimeToSubmit} days</div>
              <p className="text-xs text-muted-foreground">To jurisdiction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Automation Rate
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyticsData.automationSuccessRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.stuckRequests} stuck requests
              </p>
            </CardContent>
          </Card>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Requests Over Time */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Requests Over Time</CardTitle>
                <FeatureInfo
                  title="Requests Over Time"
                  priority="P2"
                  description="Line chart showing daily permit request submissions over the selected time range. Helps identify trends, seasonality, and growth."
                  dataSource="GET /api/analytics/requests-timeline → requestsOverTime array with date/count"
                  importance="Volume trend analysis. Spot growth patterns, predict capacity needs, identify unusual spikes or drops."
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.requestsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requests by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.requestsByStatus}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="status" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8">
                      {analyticsData.requestsByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={statusColors[entry.status] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          {/* By Jurisdiction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">By Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.requestsByJurisdiction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jurisdiction" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* By Permit Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">By Permit Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.requestsByPermitType}
                      dataKey="count"
                      nameKey="permitType"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                    >
                      {analyticsData.requestsByPermitType.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Agent Performance</CardTitle>
              <FeatureInfo
                title="Agent Performance"
                priority="P2"
                description="Shows each agent's workload and efficiency. Tracks requests handled, average completion time, and an efficiency rating based on speed."
                dataSource="GET /api/analytics/agent-performance → requestsByAgent array with metrics per agent"
                importance="Team management and workload balancing. Identify top performers, training needs, and capacity distribution."
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead className="text-right">Requests Handled</TableHead>
                  <TableHead className="text-right">Avg. Completion Time</TableHead>
                  <TableHead className="text-right">Efficiency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.requestsByAgent.map((agent) => (
                  <TableRow key={agent.agent}>
                    <TableCell className="font-medium">{agent.agent}</TableCell>
                    <TableCell className="text-right">{agent.count}</TableCell>
                    <TableCell className="text-right">
                      {agent.avgTime > 0 ? `${agent.avgTime} days` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {agent.avgTime > 0 ? (
                        <span
                          className={
                            agent.avgTime <= 5
                              ? "text-green-600"
                              : agent.avgTime <= 10
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {agent.avgTime <= 5 ? "Excellent" : agent.avgTime <= 10 ? "Good" : "Needs Improvement"}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
