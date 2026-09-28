import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { ChecklistProvider } from '@/lib/checklist-state'
import { ChecklistPage } from '@/pages/ChecklistPage'
import { CompletePage } from '@/pages/CompletePage'
import { MaintenancePage } from '@/pages/MaintenancePage'
import { WelcomePage } from '@/pages/WelcomePage'

export default function App() {
  return (
    <BrowserRouter>
      <ChecklistProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/complete" element={<CompletePage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </ChecklistProvider>
    </BrowserRouter>
  )
}
