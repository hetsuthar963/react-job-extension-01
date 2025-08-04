/* src/App.tsx */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import JobDetail from './pages/JobDetail'
import JobList from './pages/JobList'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"         element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
      </Routes>
    </Router>
  )
}
