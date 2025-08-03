import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  summary: string;
  url: string;
  scrapedAt: string;
};


function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    axios.get('/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error('Failed to fetch jobs:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Scraped Job Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default App;
