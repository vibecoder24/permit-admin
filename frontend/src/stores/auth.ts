import { create } from "zustand"
import type { TeamMember, UserRole } from "@/types"
import { teamMembers } from "@/data/mock"

interface AuthState {
  user: TeamMember | null
  isAuthenticated: boolean
  login: (email: string) => boolean
  logout: () => void
  hasPermission: (permission: Permission) => boolean
}

type Permission =
  | "view_requests"
  | "change_status"
  | "change_status_forward_only"
  | "upload_documents"
  | "raise_invoice"
  | "manage_team"
  | "view_analytics"
  | "manage_settings"

const rolePermissions: Record<UserRole, Permission[]> = {
  viewer: ["view_requests", "view_analytics"],
  agent: [
    "view_requests",
    "change_status_forward_only",
    "upload_documents",
    "view_analytics",
  ],
  admin: [
    "view_requests",
    "change_status",
    "upload_documents",
    "raise_invoice",
    "manage_team",
    "view_analytics",
    "manage_settings",
  ],
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: teamMembers[0], // Default to admin for demo
  isAuthenticated: true,

  login: (email: string) => {
    const user = teamMembers.find(
      (tm) => tm.email === email && tm.status === "active"
    )
    if (user) {
      set({ user, isAuthenticated: true })
      return true
    }
    return false
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  hasPermission: (permission: Permission) => {
    const { user } = get()
    if (!user) return false
    return rolePermissions[user.role].includes(permission)
  },
}))
