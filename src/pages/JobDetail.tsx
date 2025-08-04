// /* src/pages/JobDetail.tsx */
// import { useParams, useNavigate } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import {
//   Card, CardContent, CardHeader, CardTitle,
// } from '../components/ui/card'
// import { Button } from '../components/ui/button'
// import { Separator } from '../components/ui/separator'
// import { Badge } from '../components/ui/badge'
// import { ExternalLink, MapPin, Briefcase, Clock, ArrowLeft } from 'lucide-react'

// export default function JobDetail() {
//   const { id } = useParams()
//   const nav      = useNavigate()
//   const [job, setJob] = useState<any>(null)

//   useEffect(() => {
//     axios.get(`/jobs/${id}`)
//       .then(r => setJob(r.data))
//       .catch(() => nav('/'))          // fallback to home if 404
//   }, [id])

//   if (!job) return <p className="p-6 text-muted-foreground">Loading…</p>

//   return (
//     <div className="min-h-screen bg-muted p-6 flex justify-center">
//       <Card className="w-full max-w-3xl">
//         <CardHeader className="relative">
//           <Button
//             size="icon"
//             variant="ghost"
//             className="absolute left-0 top-0"
//             onClick={() => nav(-1)}
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </Button>

//           <CardTitle className="text-2xl font-bold pr-8">{job.title}</CardTitle>

//           <div className="mt-2 text-sm text-muted-foreground space-y-1">
//             <p className="flex items-center gap-2">
//               <Briefcase className="w-4 h-4" /> {job.company || 'Unknown company'}
//             </p>
//             {job.location && (
//               <p className="flex items-center gap-2">
//                 <MapPin className="w-4 h-4" /> {job.location}
//               </p>
//             )}
//             {job.experience && (
//               <p className="flex items-center gap-2">
//                 <Clock className="w-4 h-4" /> {job.experience}
//               </p>
//             )}
//           </div>

//           {job.source_url && (
//             <Button
//               asChild
//               variant="outline"
//               className="mt-4"
//             >
//               <a href={job.source_url} target="_blank" rel="noopener noreferrer">
//                 View Original <ExternalLink className="w-4 h-4 ml-1" />
//               </a>
//             </Button>
//           )}
//         </CardHeader>

//         <Separator />

//         <CardContent className="space-y-5 py-6">
//           {/* Summary --------------------------------------------------- */}
//           <section>
//             <h3 className="font-medium mb-1 text-muted-foreground">AI Summary</h3>
//             <p className="leading-relaxed">{job.summary}</p>
//           </section>

//           {/* Insights -------------------------------------------------- */}
//           {job.insights && (
//             <section>
//               <h3 className="font-medium mb-1 text-muted-foreground">AI Insights</h3>
//               <p className="whitespace-pre-line">{job.insights}</p>
//             </section>
//           )}

//           {/* Skills ---------------------------------------------------- */}
//           {!!job.skills?.length && (
//             <section>
//               <h3 className="font-medium mb-1 text-muted-foreground">Skills</h3>
//               <div className="flex flex-wrap gap-2">
//                 {job.skills.map((s: string) => (
//                   <Badge key={s} variant="secondary">{s}</Badge>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Tags & Priority ------------------------------------------ */}
//           <section className="flex flex-wrap gap-2">
//             {job.priority && (
//               <Badge>{job.priority} PRIORITY</Badge>
//             )}
//             {job.role_tags?.map((t: string) => (
//               <Badge key={t} variant="outline">{t}</Badge>
//             ))}
//           </section>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }





// src/pages/JobDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { ExternalLink, MapPin, Briefcase, Clock, ArrowLeft, Sparkles, ChevronRight, Tag, Star, Trash2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import clsx from 'clsx';

// Priority configuration (consistent with JobCard)
const PRIORITY_CONFIG = {
  HIGH: {
    label: '🔥 High Priority',
    color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800/50'
  },
  MEDIUM: {
    label: '🤝 Medium Priority',
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50'
  },
  LOW: {
    label: '🟢 Low Priority',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/50'
  }
} as const;

export default function JobDetail() {
  const { id } = useParams<{ id: string }>(); // Type safety
  const nav = useNavigate();
  type Priority = keyof typeof PRIORITY_CONFIG;
  interface JobType {
    _id: string; // Add _id for consistency if needed
    title: string;
    company: string;
    location?: string;
    experience?: string;
    source_url?: string;
    summary: string;
    insights?: string;
    skills?: string[];
    priority: Priority;
    role_tags?: string[];
    [key: string]: any;
  }
  const [job, setJob] = useState<JobType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state on ID change or initial load
    setJob(null);
    setError(null);
    setLoading(true);

    const fetchData = async () => {
      if (!id) {
        setError('Invalid job ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<JobType>(`/jobs/${id}`);
        setJob(response.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching job:', err);
        // Check if it's a 404 (Not Found) error
        if (err.response?.status === 404) {
            setError('Job not found. It may have been deleted.');
        } else {
             setError('Failed to load job details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Re-run effect if ID changes

  const deleteJob = async () => {
    if (!id) return;

    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await axios.delete(`/jobs/${id}`);
      // Navigate back to the job list after successful deletion
      nav('/'); // Or nav(-1) to go back, but '/' is more reliable
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job. Please try again.');
      // Optionally, you could reload the job data here if deletion failed on the server
      // but succeeded locally, though that's unlikely with your current backend.
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-muted flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Job Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => nav(-1)}> {/* Go back */}
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button onClick={() => nav('/')}> {/* Go to dashboard */}
                <Briefcase className="w-4 h-4 mr-2" />
                Job Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted p-6">
        <Card className="w-full max-w-3xl mx-auto">
          {/* ... (Skeleton loading code remains the same) ... */}
          <CardHeader className="space-y-4">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-4" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-12 w-48 mt-2" />
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6 py-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-16" />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Skeleton className="h-8 w-24" />
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This check is technically redundant now due to loading/error states,
  // but good for type safety
  if (!job) {
    return null;
  }

  const { label, color } = PRIORITY_CONFIG[job.priority];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-accent/50 transition-colors group"
          onClick={() => nav(-1)} // Go back
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Jobs
        </Button>
        <Card className="overflow-hidden border-none shadow-2xl transition-all duration-300 hover:shadow-3xl">
          {/* ... (Rest of your UI code remains largely the same) ... */}
          {/* Header with gradient accent */}
          <div className={clsx(
            "h-2 w-full",
            job.priority === 'HIGH' ? "bg-gradient-to-r from-rose-500 to-rose-600" :
              job.priority === 'MEDIUM' ? "bg-gradient-to-r from-amber-500 to-amber-600" :
                "bg-gradient-to-r from-emerald-500 to-emerald-600"
          )} />
          <CardHeader className="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={clsx(
                    "p-2 rounded-xl",
                    job.priority === 'HIGH' ? "bg-rose-100 dark:bg-rose-900/30" :
                      job.priority === 'MEDIUM' ? "bg-amber-100 dark:bg-amber-900/30" :
                        "bg-emerald-100 dark:bg-emerald-900/30"
                  )}>
                    <Briefcase className={clsx(
                      "w-6 h-6",
                      job.priority === 'HIGH' ? "text-rose-600" :
                        job.priority === 'MEDIUM' ? "text-amber-600" :
                          "text-emerald-600"
                    )} />
                  </div>
                  <Badge className={clsx(color, "text-sm px-3 py-1.5 font-medium tracking-tight")}>
                    {label}
                  </Badge>
                </div>
                <CardTitle className="text-3xl font-bold leading-tight mb-2 group">
                  {job.title}
                  <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </span>
                </CardTitle>
                <p className="text-xl font-medium text-muted-foreground">{job.company}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {job.source_url && (
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto group"
                  >
                    <a
                      href={job.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View original job posting at ${job.company}`}
                    >
                      View Original
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={deleteJob} // Add delete button in detail view
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </Button>
              </div>
            </div>
            {/* Metadata section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
              <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-medium">{job.location || 'Remote'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Experience</p>
                  <p className="font-medium">{job.experience || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Posted</p>
                  <p className="font-medium">Just now</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator className="mx-6" />
          <CardContent className="p-6 space-y-7">
            {/* AI Summary */}
            <section>
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center">
                    AI Summary
                    <Star className="w-4 h-4 text-yellow-400 ml-2 fill-yellow-400" />
                  </h2>
                  <p className="text-muted-foreground mt-1">Our AI analyzed this job description to highlight key requirements</p>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-5 shadow-sm hover:shadow transition-shadow">
                <p className="text-lg leading-relaxed text-foreground">{job.summary}</p>
              </div>
            </section>
            {/* AI Insights */}
            {job.insights && (
              <section>
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Insights</h2>
                    <p className="text-muted-foreground mt-1">Additional observations from our analysis</p>
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-5">
                  <p className="leading-relaxed whitespace-pre-line">{job.insights}</p>
                </div>
              </section>
            )}
            {/* Skills */}
            {!!job.skills?.length && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold flex items-center">Required Skills</h2>
                    <p className="text-muted-foreground mt-1">Key competencies needed for this role</p>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1.5">
                    {job.skills.length} skills
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.skills.map((skill: string, index: number) => (
                    <div
                      key={skill}
                      className={clsx(
                        "flex items-center p-3 rounded-lg border transition-all",
                        "hover:border-primary hover:bg-primary/5 group"
                      )}
                    >
                      <div className={clsx(
                        "w-2 h-2 rounded-full mr-3",
                        index === 0 ? "bg-rose-500" :
                          index === 1 ? "bg-amber-500" :
                            "bg-emerald-500"
                      )} />
                      <span className="font-medium group-hover:text-primary transition-colors">{skill}</span>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </section>
            )}
            {/* Tags */}
            {(job.role_tags && job.role_tags.length > 0) && (
              <section className="pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {job.role_tags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-sm px-3 py-1.5 border-primary/20 hover:bg-primary/5 transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
