import { useState } from "react"
import {
  UserPlus,
  MoreHorizontal,
  Mail,
  Shield,
  Clock,
  Check,
  X,
} from "lucide-react"
import { Header } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { teamMembers } from "@/data/mock"
import { formatDate, formatDateTime } from "@/lib/utils"
import type { UserRole, TeamMemberStatus } from "@/types"

const roleConfig: Record<UserRole, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  admin: { label: "Admin", variant: "default" },
  agent: { label: "Agent", variant: "secondary" },
  viewer: { label: "Viewer", variant: "outline" },
}

const statusConfig: Record<TeamMemberStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" }> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "outline" },
  pending: { label: "Pending", variant: "warning" },
}

const roleOptions = [
  { value: "viewer", label: "Viewer" },
  { value: "agent", label: "Agent" },
  { value: "admin", label: "Admin" },
]

export function TeamPage() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("agent")
  const [filterRole, setFilterRole] = useState("")

  const filteredMembers = teamMembers.filter(
    (member) => !filterRole || member.role === filterRole
  )

  const handleInvite = () => {
    // In a real app, this would make an API call
    console.log("Inviting", inviteEmail, "as", inviteRole)
    setShowInvite(false)
    setInviteEmail("")
    setInviteRole("agent")
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Team Management"
        subtitle="Manage team members and access"
        actions={
          <div className="flex items-center gap-2">
            <FeatureInfo
              title="Team Management"
              priority="P2"
              description="Manage team member access, roles, and status. Invite new members, change roles, and deactivate users. Admin-only feature."
              dataSource="GET /api/team → teamMembers array. POST /api/team/invite for new members."
              importance="Access control. Ensure right people have right access. Deactivate when someone leaves, promote to admin for senior staff."
            />
          <Dialog open={showInvite} onOpenChange={setShowInvite}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    options={roleOptions}
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {inviteRole === "viewer" && "Can view requests and analytics only"}
                    {inviteRole === "agent" && "Can view, update status, and upload documents"}
                    {inviteRole === "admin" && "Full access including invoicing and team management"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInvite(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite} disabled={!inviteEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Filters */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filter by role:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              <option value="">All Roles</option>
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Team Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar fallback={member.name} size="sm" />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleConfig[member.role].variant}>
                      <Shield className="mr-1 h-3 w-3" />
                      {roleConfig[member.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[member.status].variant}>
                      {statusConfig[member.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.lastActiveAt ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(member.lastActiveAt)}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(member.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {member.status === "active" ? (
                          <DropdownMenuItem className="text-destructive">
                            <X className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : member.status === "inactive" ? (
                          <DropdownMenuItem>
                            <Check className="mr-2 h-4 w-4" />
                            Reactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Resend Invite
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Role Permissions Reference */}
        <Card className="mt-6">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-medium">Role Permissions</h3>
              <FeatureInfo
                title="Role Permissions"
                priority="P3"
                description="Reference table showing what each role can do. Viewer: read-only. Agent: can process permits. Admin: full access including billing and team management."
                dataSource="Static permission matrix → Enforced via hasPermission() in useAuthStore"
                importance="Understand access levels before assigning roles. Principle of least privilege - give users minimum access needed for their job."
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead className="text-center">Viewer</TableHead>
                  <TableHead className="text-center">Agent</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>View Requests</TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Change Status</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    <X className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-yellow-600">
                    Forward Only
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Upload Documents</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    <X className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Raise Invoice</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    <X className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    <X className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Manage Team</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    <X className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    <X className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>View Analytics</TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center text-green-600">
                    <Check className="h-4 w-4 mx-auto" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
