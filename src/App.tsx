import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { ChecklistProvider } from '@/lib/checklist-state'
import { ChecklistPage } from '@/pages/ChecklistPage'
import { CompletePage } from '@/pages/CompletePage'
import { MaintenancePage } from '@/pages/MaintenancePage'
import { MeasurePage } from '@/pages/MeasurePage'
import { NudgesPage } from '@/pages/NudgesPage'
import { WriteUpPage } from '@/pages/WriteUpPage'

export default function App() {
  return (
    <BrowserRouter>
      <ChecklistProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<CompletePage />} />
            <Route path="/complete" element={<Navigate to="/" replace />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/nudges" element={<NudgesPage />} />
            <Route path="/measure" element={<MeasurePage />} />
            <Route path="/write-up" element={<WriteUpPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </ChecklistProvider>
    </BrowserRouter>
  )
}
