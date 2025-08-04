// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import JobCard from '../components/JobCard'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Home from '../pages/Home'
// import JobDetail from '../pages/JobDetail'

// type Job = {
//   _id: string
//   title: string
//   company: string
//   location: string
//   experience: string
//   skills: string[]
//   summary: string
//   url: string
//   scrapedAt: string
// }

// export default function App() {
//   const [jobs, setJobs] = useState<Job[]>([])

//   useEffect(() => {
//     axios.get('/jobs')
//       .then((res) => setJobs(res.data))
//       .catch((err) => console.error('Failed to fetch jobs:', err))
//   }, [])

//   return (
//     <div className="min-h-screen bg-muted p-6">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <header className='text-center'>
//           <h1 className="text-3xl font-bold">📋 Scraped Job Posts</h1>
//           <p className="text-muted-foreground text-sm">
//             Latest jobs scraped via Chrome extension. Click any card to view full post.
//           </p>
//         </header>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {jobs.map((job) => (
//             <JobCard key={job._id} job={job} />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }






/* src/pages/Home.tsx */
import axios from 'axios'
import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard'

type Job = {
  _id: string
  title: string
  company: string
  location: string
  experience: string
  skills: string[]
  summary: string
  url: string
  scrapedAt: string
  source_url: string
  priority: number
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])

  // load once ------------------------------------------------------------
  useEffect(() => { axios.get('/jobs').then(r => setJobs(r.data)) }, [])

  // delete ---------------------------------------------------------------
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/jobs/${id}`)
      setJobs(prev => prev.filter(j => j._id !== id))
    } catch (err) { console.error(err) }
  }

  // re-analyze placeholder ----------------------------------------------
  const handleReanalyze = (id: string) => {
    /* TODO: call /scrape or another endpoint */
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 p-6">
      {jobs.map(j => (
       <JobCard
        key={j._id}
        job={j}
        onDelete={handleDelete}         // calls DELETE /jobs/:id and updates state
        onReanalyze={handleReanalyze}   // implement per your logic
        />
      ))}
    </div>
  )
}
