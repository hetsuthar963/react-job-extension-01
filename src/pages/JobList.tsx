// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import JobCard, { type Job } from '../components/JobCard';

// export default function JobList() {
//   const [jobs, setJobs] = useState<Job[]>([]);

//   useEffect(() => {
//     axios.get<Job[]>('/jobs').then(r => setJobs(r.data));
//   }, []);

//   /* ---------- handlers ---------------------------------------------- */
//   const deleteJob = async (id: string) => {
//     await axios.delete(`/jobs/${id}`);
//     setJobs(prev => prev.filter(j => j._id !== id));
//   };

//   const reanalyseJob = async (id: string) => {
//     await axios.post(`/jobs/${id}/reanalyse`);   // stub endpoint
//     const { data } = await axios.get<Job>(`/jobs/${id}`);
//     setJobs(prev => prev.map(j => j._id === id ? data : j));
//   };

//   /* ------------------------------------------------------------------ */
//   return (
//     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
//       {jobs.map(job => (
//         <JobCard
//           key={job._id}
//           job={job}
//           onDelete={deleteJob}
//           onReanalyse={reanalyseJob}
//         />
//       ))}
//     </div>
//   );
// }
// src/pages/JobList.tsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import JobCard, { type Job } from '../components/JobCard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import {
  Button
} from '../components/ui/button';
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import {
  Search,
  Loader2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Pause,
  Play,
  Briefcase,
  AlertTriangle,
  Sparkles,
  Users,
  AlertCircle
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

// View modes for layout toggle
type ViewMode = 'grid' | 'list';

// Priority filter options
const PRIORITY_FILTERS = [
  { value: 'ALL', label: 'All Priorities' },
  { value: 'HIGH', label: '🔥 High Priority' },
  { value: 'MEDIUM', label: '⚠️ Medium Priority' }, // Corrected typo
  { value: 'LOW', label: '🟢 Low Priority' }
] as const;

// Experience level filter options
const EXPERIENCE_FILTERS = [
  { value: 'ALL', label: 'All Experience Levels' },
  { value: 'ENTRY', label: 'Entry Level' },
  { value: 'MID', label: 'Mid Level' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'EXECUTIVE', label: 'Executive' }
] as const;

// Type for Priority Filter Values
type PriorityFilterValue = typeof PRIORITY_FILTERS[number]['value'];
// Type for Experience Filter Values
type ExperienceFilterValue = typeof EXPERIENCE_FILTERS[number]['value'];

// Refresh interval in milliseconds (e.g., 30 seconds)
// Keeping the interval constant as requested
const REFRESH_INTERVAL = 3000;
// Removing the separate retry delay logic for simplicity

export default function JobList() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterValue>('ALL');
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilterValue>('ALL');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Using manualRefresh counter to trigger manual refreshes
  const [manualRefresh, setManualRefresh] = useState(0);
  // Removing retryTimeoutId state

  // --- REVISED fetchData function ---
  // Simplified to ensure setIsRefreshing(false) is always called
  const fetchData = useCallback(async () => {
    // Prevent overlapping requests if one is already in progress
    if (isRefreshing) {
      console.warn("[JobList] Fetch already in progress, skipping...");
      return;
    }

    console.log("[JobList] Starting data fetch...");
    setIsRefreshing(true); // Set loading state immediately
    setError(null); // Clear any previous error for this new attempt

    try {
      const { data } = await axios.get<Job[]>('/jobs');
      console.log("[JobList] Fetch successful, jobs received:", data.length);
      setJobs(data);
      setLastRefresh(new Date());
      // State updates for success happen here
      // setIsRefreshing(false) will be called in the finally block
    } catch (err: any) {
      console.error('[JobList] Error fetching jobs:', err);
      // Show error message for any fetch failure
      setError('Failed to load jobs. Please try again later.');
      // setIsRefreshing(false) will be called in the finally block
    } finally {
      // --- CRITICAL FIX: This guarantees the spinner stops ---
      console.log("[JobList] Fetch attempt finished (success or error), stopping refresh indicator.");
      setIsRefreshing(false);
      // Ensure global loading flag turns off after the first fetch attempt
      if (loading) {
        setLoading(false);
      }
    }
  }, [isRefreshing, loading]); // Dependencies: re-create if these change

  // --- REVISED Auto-refresh useEffect ---
  // Simpler, clearer setup and cleanup
  useEffect(() => {
    console.log("[JobList] Auto-refresh effect running. Enabled:", isAutoRefresh);

    // Do nothing if auto-refresh is explicitly turned off
    if (!isAutoRefresh) {
      console.log("[JobList] Auto-refresh is disabled.");
      return;
    }

    // Fetch data immediately when auto-refresh is enabled or component mounts
    fetchData();

    // Set up the recurring interval
    const intervalId = setInterval(() => {
      console.log("[JobList] Auto-refresh interval triggered.");
      fetchData();
    }, REFRESH_INTERVAL);

    // --- CRITICAL FIX: Cleanup function ---
    // This ensures the interval is ALWAYS cleared when dependencies change or component unmounts
    return () => {
      console.log("[JobList] Cleaning up auto-refresh interval.");
      clearInterval(intervalId);
    };
  }, [isAutoRefresh, fetchData]); // Re-run if isAutoRefresh toggle or fetchData function changes

  // --- REVISED Manual Refresh useEffect ---
  // Uses the manualRefresh counter to trigger a single fetch
  useEffect(() => {
    // Only trigger a fetch if manualRefresh has been incremented (button clicked)
    if (manualRefresh > 0) {
      console.log("[JobList] Manual refresh triggered (counter:", manualRefresh, ").");
      fetchData();
    }
  }, [manualRefresh, fetchData]); // Re-run when manualRefresh counter or fetchData changes

  /* ---------- handlers ---------------------------------------------- */
  const deleteJob = async (id: string) => {
    try {
      await axios.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(job => job._id !== id));
    } catch (err) {
      setError('Failed to delete job');
      console.error('Delete job error:', err);
    }
  };

  const reanalyseJob = async (id: string) => {
    try {
      await axios.post(`/jobs/${id}/reanalyse`);
      const { data } = await axios.get<Job>(`/jobs/${id}`);
      setJobs(prev => prev.map(j => j._id === id ? data : j));
    } catch (err) {
      setError('Failed to re-analyze job. Please try again.');
      console.error('Error re-analyzing job:', err);
    }
  };

  // --- REVISED Manual Refresh Handler ---
  const handleManualRefresh = () => {
    console.log("[JobList] Manual refresh button clicked.");
    // Increment the counter to trigger the useEffect for manual refresh
    setManualRefresh(prev => prev + 1);
  };

  const toggleAutoRefresh = () => {
    const newState = !isAutoRefresh;
    console.log("[JobList] Toggling auto-refresh to:", newState);
    setIsAutoRefresh(newState);
  };

  /* ---------- filtering and sorting --------------------------------- */
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.some(skill =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      const matchesPriority = priorityFilter === 'ALL' || job.priority === priorityFilter;

      const matchesExperience = experienceFilter === 'ALL' ||
        (experienceFilter === 'ENTRY' && job.experience?.includes('Entry')) ||
        (experienceFilter === 'MID' && job.experience?.includes('Mid')) ||
        (experienceFilter === 'SENIOR' && job.experience?.includes('Senior')) ||
        (experienceFilter === 'EXECUTIVE' && job.experience?.includes('Executive'));

      return matchesSearch && matchesPriority && matchesExperience;
    }).sort((a, b) => {
      // Sort by priority (HIGH > MEDIUM > LOW)
      const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3); // Fallback sort
    });
  }, [jobs, searchQuery, priorityFilter, experienceFilter]);

  /* ---------- render ------------------------------------------------- */
  if (error && jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 px-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3">
              <Button onClick={handleManualRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Job Dashboard</h1>
                {isAutoRefresh && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Auto-refresh enabled
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <span>{filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} matching your criteria</span>
                {lastRefresh && (
                  <span className="flex items-center text-xs">
                    • Last updated: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Auto-refresh</span>
                <Switch
                  checked={isAutoRefresh}
                  onCheckedChange={toggleAutoRefresh}
                  aria-label="Toggle auto-refresh"
                />
                {isAutoRefresh ? (
                  <Play className="w-4 h-4 text-green-500" aria-hidden="true" />
                ) : (
                  <Pause className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
          {/* Search and Filters */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search jobs, companies, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PriorityFilterValue)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_FILTERS.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={experienceFilter} onValueChange={(value) => setExperienceFilter(value as ExperienceFilterValue)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_FILTERS.map(filter => (
                      <SelectItem key={filter.value} value={filter.value}>
                        {filter.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "h-11 w-11",
                      viewMode === 'grid' && "bg-accent text-accent-foreground"
                    )}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "h-11 w-11",
                      viewMode === 'list' && "bg-accent text-accent-foreground"
                    )}
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Jobs"
            value={jobs.length.toString()}
            icon={Briefcase}
            trend={jobs.length > 0 ? `+${jobs.length - (jobs.length - filteredJobs.length)} since last update` : ""}
          />
          <StatCard
            title="High Priority"
            value={jobs.filter(j => j.priority === 'HIGH').length.toString()}
            icon={AlertTriangle}
            trendColor={jobs.filter(j => j.priority === 'HIGH').length > 0 ? "text-destructive" : "text-emerald-500"}
            trend={jobs.filter(j => j.priority === 'HIGH').length > 0 ?
              `+${jobs.filter(j => j.priority === 'HIGH').length} new` :
              "No high priority jobs"}
          />
          <StatCard
            title="Pending Analysis"
            value="3"
            icon={Sparkles}
            trend="-1 since yesterday"
          />
          <StatCard
            title="Applications"
            value="12"
            icon={Users}
            trend="+4 this week"
          />
        </div>
        {/* Job Grid */}
        <div className="mb-8">
          <CardHeader className="px-0 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Job Listings
              {isRefreshing && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
              Sorted by priority • {filteredJobs.length} results
            </div>
          </CardHeader>
          {loading && jobs.length === 0 ? (
            <LoadingGrid viewMode={viewMode} />
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              priorityFilter={priorityFilter}
              experienceFilter={experienceFilter}
              // Pass the actual state setters
              setSearchQuery={setSearchQuery}
              setPriorityFilter={setPriorityFilter}
              setExperienceFilter={setExperienceFilter}
            />
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid'
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            )}>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onDelete={deleteJob}
                  // onReanalyse={reanalyseJob}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper Components ---------------------------------------- */
// ... (StatCard, LoadingGrid, EmptyStateProps, EmptyState remain unchanged) ...
// (I'm omitting the unchanged helper components for brevity, assuming they are working correctly)

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendColor?: string;
}

function StatCard({ title, value, icon: Icon, trend, trendColor }: StatCardProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="flex flex-col gap-2 py-6 px-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        </div>
        {trend && (
          <div className={`text-xs mt-2 ${trendColor ?? "text-muted-foreground"}`}>
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface LoadingGridProps {
  viewMode: ViewMode;
}

function LoadingGrid({ viewMode }: LoadingGridProps) {
  // Show skeleton cards based on view mode
  const skeletonCount = viewMode === 'grid' ? 8 : 4;
  return (
    <div className={
      viewMode === 'grid'
        ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "grid-cols-1"
    }>
      {Array.from({ length: skeletonCount }).map((_, idx) => (
        <Skeleton key={idx} className="h-40 rounded-xl" />
      ))}
    </div>
  );
}

// Updated EmptyStateProps with proper types
interface EmptyStateProps {
  searchQuery: string;
  priorityFilter: PriorityFilterValue;
  experienceFilter: ExperienceFilterValue;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (filter: PriorityFilterValue) => void;
  setExperienceFilter: (filter: ExperienceFilterValue) => void;
}

function EmptyState({
  searchQuery,
  priorityFilter,
  experienceFilter,
  setSearchQuery,
  setPriorityFilter,
  setExperienceFilter,
}: EmptyStateProps) {
  const getMessage = () => {
    if (searchQuery) {
      return `No jobs found matching "${searchQuery}". Try a different search term.`;
    }

    if (priorityFilter !== 'ALL' || experienceFilter !== 'ALL') {
      return 'No jobs match your current filters. Try adjusting your filters.';
    }

    return "You haven't added any jobs yet. Start by adding your first job listing!";
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('ALL');
    setExperienceFilter('ALL');
  };

  return (
    <div className="text-center py-12 bg-card rounded-xl border">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {getMessage()}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {(searchQuery || priorityFilter !== 'ALL' || experienceFilter !== 'ALL') && (
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        )}
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Job
        </Button>
      </div>
    </div>
  );
}