import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Inbox,
  BarChart3,
  Users,
  Settings,
  LogOut,
  FileCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { dashboardMetrics } from "@/data/mock"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Requests", href: "/requests", icon: FileText },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  {
    name: "New Permits",
    href: "/queue",
    icon: Inbox,
    badge: dashboardMetrics.newPermits24h,
  },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

const adminNavigation = [
  { name: "Team", href: "/team", icon: Users, permission: "manage_team" as const },
  { name: "Settings", href: "/settings", icon: Settings, permission: "manage_settings" as const },
]

export function Sidebar() {
  const { user, logout, hasPermission } = useAuthStore()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <FileCheck className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">PermitAgent</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
              {item.badge ? (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              ) : null}
            </NavLink>
          ))}
        </div>

        {/* Admin Section */}
        {(hasPermission("manage_team") || hasPermission("manage_settings")) && (
          <div className="pt-4">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Admin
            </p>
            <div className="mt-2 space-y-1">
              {adminNavigation.map(
                (item) =>
                  hasPermission(item.permission) && (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </NavLink>
                  )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar fallback={user?.name || "U"} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
