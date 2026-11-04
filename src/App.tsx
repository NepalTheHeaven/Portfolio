import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteShell } from './components/SiteShell'
import { MainFlowPage } from './pages/MainFlowPage'
import { WorkDetailPage } from './pages/WorkDetailPage'
import { AppDetailPage } from './pages/AppDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route element={<SiteShell />}>
          <Route index element={<MainFlowPage />} />
          <Route path="work" element={<MainFlowPage />} />
          <Route path="work/:slug" element={<WorkDetailPage />} />
          <Route path="apps" element={<MainFlowPage />} />
          <Route path="apps/:slug" element={<AppDetailPage />} />
          <Route path="story" element={<MainFlowPage />} />
          <Route path="contact" element={<MainFlowPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
