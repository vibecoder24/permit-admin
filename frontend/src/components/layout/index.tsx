import { Outlet } from "react-router-dom"
import { Sidebar } from "./sidebar"

export function Layout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export { Sidebar } from "./sidebar"
export { Header } from "./header"
