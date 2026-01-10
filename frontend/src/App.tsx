import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout"
import {
  DashboardPage,
  RequestsPage,
  PermitDetailPage,
  ProjectViewPage,
  QueuePage,
  AnalyticsPage,
  TeamPage,
  SettingsPage,
} from "@/pages"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="permits/:permitId" element={<PermitDetailPage />} />
          <Route path="projects" element={<RequestsPage />} />
          <Route path="projects/:projectId" element={<ProjectViewPage />} />
          <Route path="queue" element={<QueuePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
