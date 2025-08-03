interface Job {
  title?: string;
  company?: string;
  location?: string;
  summary?: string;
  skills?: string[];
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="p-4 bg-white rounded shadow border border-gray-200">
      <h2 className="text-lg font-bold text-blue-600">{job.title || "Untitled"}</h2>
      <p className="text-sm text-gray-600">{job.company || "Unknown Company"}</p>
      <p className="text-sm italic">{job.location || "Location not provided"}</p>
      <p className="text-sm mt-2 text-gray-800">{job.summary}</p>
      <div className="mt-2 text-sm text-indigo-500">
        {job.skills?.join(", ")}
      </div>
    </div>
  );
}

export default JobCard;
