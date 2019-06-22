/**
 * Types specific to these sample extensions that provide some cool demo functionality
 */
export enum JobCategory {
  Company = 0,
  Role,
}

export interface HistoricJob {
  id: number;
  title: string;
  numOpenings: string;

  // Timestamps
  dateAdded: number;
  firstSubmissionDate: number;
  firstPlacementDate: number;

  // Calculated based on date timestamps
  daysToFirstSuccessfulSubmit: number;
  daysToFirstFill: number;

  // Num placements / Num submissions
  submitToFillRate: number;

  // The bill rate for the job
  billRate: number;
}

export interface Averages {
  // Total jobs in this category
  totalJobs: number;

  // Total jobs with submissions in this category
  jobsSubmitted: number;

  // Total jobs with placements in this category
  jobsFilled: number;

  // Average number of days until the submission that results in the first placement
  daysToFirstSuccessfulSubmit: number;

  // Average number of days until the first placement
  daysToFirstFill: number;

  // Average of all jobs with placements of: (num placements / num submissions)
  submitToFillRate: number;

  // Average of all bill rates for this category
  billRate: number;
}

// Used to capture jobs and their derived average data for a job category
export interface HistoricJobCategory {
  jobs: HistoricJob[];
  averages: Averages;
}

export interface ProbabilityScoreInput {
  numSubmissions: number;
  daysRemaining: number;
  numOpenings: number;
}

export interface ProbabilityScoreOutput {
  averageFillsPerNumOpenings?: number;
  averageSubmitsPerFill?: number;
  submitOpportunity?: number;
  daysRemainingProbability?: number;
  probabilityToClose?: number;
}

export type ProbabilityScore = 'low' | 'medium' | 'high';
