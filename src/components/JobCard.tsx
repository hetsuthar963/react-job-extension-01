// /* src/components/JobCard.tsx */
// import { ExternalLink, Trash2, RefreshCw } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
// import { Badge } from "../components/ui/badge"
// import { Button } from "../components/ui/button"
// import clsx from "clsx"

// export type Job = {
//   _id: string
//   title: string
//   company: string
//   location: string
//   experience: string
//   summary: string
//   skills: string[]
//   source_url?: string
//   priority: "HIGH" | "MEDIUM" | "LOW"
//   insights?: string
// }

// const PRIORITY_STYLES: Record<Job["priority"], string> = {
//   HIGH:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
//   MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
//   LOW:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
// }

// const PRIORITY_TEXT: Record<Job["priority"], string> = {
//   HIGH:   "🔥 High Priority",
//   MEDIUM: "⚠️  Medium Priority",
//   LOW:    "🟢 Low Priority",
// }

// export default function JobCard({ job }: { job: Job }) {
//   const {
//     title,
//     company,
//     location,
//     summary,
//     insights,
//     skills = [],
//     source_url,
//     priority,
//   } = job

//   /* Helpers --------------------------------------------------------------- */
//   const hasInsights = Boolean(insights?.trim()?.length)

//   const openPost = () => {
//     if (source_url && source_url !== "undefined") window.open(source_url, "_blank")
//   }

//   /* ---------------------------------------------------------------------- */
//   return (
//     <Card className="rounded-2xl border shadow-sm hover:shadow-lg transition flex flex-col gap-4 p-5">
//       {/* --- header ------------------------------------------------------- */}
//       <CardHeader className="p-0 flex items-start justify-between space-y-0">
//         <CardTitle className="text-lg font-semibold line-clamp-2">
//           {title}
//         </CardTitle>

//         <div className="flex gap-1">
//           {source_url && source_url !== "undefined" && (
//             <Button onClick={openPost} variant="ghost" size="icon">
//               <ExternalLink className="w-4 h-4" />
//             </Button>
//           )}
//           <Button variant="ghost" size="icon">
//             <Trash2 className="w-4 h-4" />
//           </Button>
//         </div>
//       </CardHeader>

//       {/* --- meta row ----------------------------------------------------- */}
//       <div className="flex items-center justify-between text-sm text-muted-foreground">
//         <span className="truncate">
//           {company || "Unknown"} • {location || "Not specified"}
//         </span>

//         <span
//           className={clsx(
//             "text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap",
//             PRIORITY_STYLES[priority]
//           )}
//         >
//           {PRIORITY_TEXT[priority]}
//         </span>
//       </div>

//       {/* --- AI Summary --------------------------------------------------- */}
//       <CardContent className="p-0">
//         <div className="bg-blue-50 dark:bg-blue-900/25 text-blue-900 dark:text-blue-200 rounded-md p-3 text-sm leading-snug">
//           <strong>AI Summary:</strong> {summary}
//         </div>

//         {/* --- AI Insights ---------------------------------------------- */}
//         {hasInsights && (
//           <div className="bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-200 rounded-md p-3 text-sm leading-snug mt-3 whitespace-pre-line">
//             <strong>AI Insights:</strong> {insights}
//           </div>
//         )}

//         {/* --- skills --------------------------------------------------- */}
//         {!!skills.length && (
//           <div className="flex flex-wrap gap-2 mt-3">
//             {skills.slice(0, 10).map((skill) => (
//               <Badge
//                 key={skill}
//                 variant="secondary"
//                 className="text-xs px-2 py-0.5"
//               >
//                 {skill}
//               </Badge>
//             ))}
//           </div>
//         )}

//         {/* --- actions -------------------------------------------------- */}
//         <Button
//           variant="outline"
//           className="w-full mt-4 text-sm"
//           onClick={() => {/* TODO: trigger re-analyze */}}
//         >
//           <RefreshCw className="w-4 h-4 mr-2" /> Re-analyze
//         </Button>
//       </CardContent>
//     </Card>
//   )
// }




// /* src/components/JobCard.tsx */
// import { Link } from 'react-router-dom'
// import { ExternalLink, Trash2, RefreshCw } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
// import { Badge } from '../components/ui/badge'
// import { Button } from '../components/ui/button'
// import clsx from 'clsx'
// export type Job = {
//   _id: string
//   title: string
//   company: string
//   location: string
//   experience: string
//   summary: string
//   skills: string[]
//   source_url?: string
//   priority: "HIGH" | "MEDIUM" | "LOW"
//   insights?: string
// }

// const COLOR: Record<Job['priority'], string> = {
//   HIGH  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
//   MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
//   LOW   : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
// }
// const LABEL: Record<Job['priority'], string> = {
//   HIGH  : '🔥 High Priority',
//   MEDIUM: '⚠️ Medium Priority',
//   LOW   : '🟢 Low Priority',
// }

// export default function JobCard({
//   job,
//   onDelete,
//   onReanalyze,
// }: {
//   job: Job
//   onDelete:    (id: string) => void
//   onReanalyze: (id: string) => void
// }) {
//   /* -------------------------------------------------- helpers */
//   const openSource = (e: React.MouseEvent) => {
//     e.stopPropagation()
//     if (job.source_url && job.source_url !== 'undefined')
//       window.open(job.source_url, '_blank')
//   }
//   const del = (e: React.MouseEvent) => { e.stopPropagation(); onDelete(job._id) }
//   const reanalyze = (e: React.MouseEvent) => { e.stopPropagation(); onReanalyze(job._id) }

//   /* -------------------------------------------------- view */
//   return (
//     <Link to={`/jobs/${job._id}`} className="block">
//       <Card className="rounded-2xl border shadow-sm hover:shadow-lg transition flex flex-col gap-4 p-5">
//         {/*header*/}
//         <CardHeader className="p-0 flex justify-between items-start relative z-10">
//           <CardTitle className="text-lg font-semibold line-clamp-2">
//             {job.title}
//           </CardTitle>

//           <div className="flex gap-1">
//             {job.source_url && job.source_url !== 'undefined' && (
//               <Button onClick={openSource} variant="ghost" size="icon">
//                 <ExternalLink className="w-4 h-4" />
//               </Button>
//             )}
//             <Button onClick={del} variant="ghost" size="icon">
//               <Trash2 className="w-4 h-4" />
//             </Button>
//           </div>
//         </CardHeader>

//         {/*meta*/}
//         <div className="flex justify-between text-sm text-muted-foreground relative z-10">
//           <span className="truncate max-w-[65%]">
//             {job.company || 'Unknown'} • {job.location || 'N/A'}
//           </span>
//           <span className={clsx(
//             'text-xs font-medium px-2 py-0.5 rounded-full',
//             COLOR[job.priority]
//           )}>
//             {LABEL[job.priority]}
//           </span>
//         </div>

//         {/*body*/}
//         <CardContent className="relative z-10 p-0 flex flex-col gap-3">
//           <div className="bg-blue-50 dark:bg-blue-900/25 text-blue-900 dark:text-blue-200 rounded-md p-3 text-sm">
//             <strong>AI Summary:</strong> {job.summary}
//           </div>

//           {!!job.insights?.trim() && (
//             <div className="bg-green-50 dark:bg-green-900/25 text-green-900 dark:text-green-200 rounded-md p-3 text-sm whitespace-pre-line">
//               <strong>AI Insights:</strong> {job.insights}
//             </div>
//           )}

//           {!!job.skills.length && (
//             <div className="flex flex-wrap gap-2">
//               {job.skills.slice(0, 10).map((s) => (
//                 <Badge key={s} variant="secondary" className="text-xs px-2 py-0.5">{s}</Badge>
//               ))}
//             </div>
//           )}

//           <Button variant="outline" className="mt-3 text-sm w-full" onClick={reanalyze}>
//             <RefreshCw className="w-4 h-4 mr-2" /> Re-analyze
//           </Button>
//         </CardContent>
//       </Card>
//     </Link>
//   )
// }

// src/components/JobCard.tsx
import { ExternalLink, Trash2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  summary: string;
  insights?: string;
  skills: string[];
  source_url: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
};

type Props = {
  job: Job;
  onDelete: (id: string) => void;
  onReanalyse: (id: string) => void;
};

/* ---------- helpers --------------------------------------------------- */
const COLOR: Record<Job['priority'], string> = {
  HIGH: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};
const LABEL: Record<Job['priority'], string> = {
  HIGH: '🔥 High Priority',
  MEDIUM: '⚠️ Medium Priority',
  LOW: '🟢 Low Priority',
};

export default function JobCard({ job, onDelete, onReanalyse }: Props) {
  const { _id, title, company, location, summary, insights, skills, source_url, priority } = job;

  /* ---------- inner helpers ----------------------------------------- */
  const openSource = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    window.open(source_url, '_blank', 'noopener,noreferrer');
  };

  const del = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior if needed
    e.stopPropagation(); // MOST IMPORTANT: Prevents the Link click from firing
    if (window.confirm('Are you sure you want to delete this job?')) {
      onDelete(_id); // Call the delete handler passed from JobList
    }
  };

  // Optional: Re-enable if you want the re-analyze button
  // const reanalyse = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onReanalyse(_id);
  // };

  function truncateText(text: string, maxLength: number): string {
    if (!text) return '';

    if (text.length <= maxLength) return text;

    let truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex > 0) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }

    return truncated + '...';
  }

  /* ---------- render ------------------------------------------------- */
  return (
    <Link
      to={`/jobs/${_id}`} // This handles navigation to the detail page
      className="block"
      onClick={(e) => {
        // Optional: Add logic here if needed before navigation
        // e.preventDefault(); // Uncomment to prevent navigation for testing
      }}
    >
      <Card className="rounded-2xl border shadow-sm hover:shadow-lg transition flex flex-col gap-4 p-5">
        {/* header */}
        <CardHeader className="p-0 flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {title}
          </CardTitle>

          <div className="flex gap-1">
            <Button onClick={openSource} variant="ghost" size="icon" aria-label="Open source">
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button onClick={del} variant="ghost" size="icon" aria-label="Delete job">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* meta row */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="truncate">
            {company} • {location}
          </span>
          <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', COLOR[priority])}>
            {LABEL[priority]}
          </span>
        </div>

        {/* content */}
        <CardContent className="p-0 flex flex-col gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/25 text-blue-900 dark:text-blue-200 rounded-md p-3 text-sm">
            <strong>AI Summary:</strong> {truncateText(summary, 200)}
          </div>

          {insights && (
            <div className="bg-green-50 dark:bg-green-900/25 text-green-900 dark:text-green-200 rounded-md p-3 text-sm whitespace-pre-line">
              <strong>AI Insights:</strong> {truncateText(insights, 200)}
            </div>
          )}

          {!!skills.length && (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map(s => (
                <Badge key={s} variant="secondary" className="text-xs px-2 py-0.5">
                  {s}
                </Badge>
              ))}
            </div>
          )}

          {/* Re-enable if needed */}
          {/* <Button variant="outline" className="mt-3 text-sm w-full" onClick={reanalyse}>
            <RefreshCw className="w-4 h-4 mr-2" /> Re-analyse
          </Button> */}
        </CardContent>
      </Card>
    </Link>
  );
}
