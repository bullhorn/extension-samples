import * as harmonicMean from 'compute-hmean';
import {
  Averages, HistoricJob, HistoricJobCategory, ProbabilityScore, ProbabilityScoreInput, ProbabilityScoreOutput
} from '../interfaces/examples';
import { JobOrder } from '@bullhorn/bullhorn-types';

export class Util {
  private static readonly oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

  static formatCurrency(value: any): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '');
  }

  /**
   * Converts a `Strings` or `Date` type from @bullhorn/bullhorn-types (string or string array) to a regular string.
   */
  static convertToString(value: string | string[] | Date | undefined): string {
    if (typeof value === 'undefined') {
      return '';
    } else if (Array.isArray(value)) {
      return value.join(' ');
    } else if (value instanceof Date) {
      return value.toDateString();
    }
    return value;
  }

  /**
   * Converts a `Strings` or `Date` type from a @bullhorn/bullhorn-types to a number.
   */
  static convertToNumber(value: string | string[] | Date): number {
    return Number.parseInt(this.convertToString(value), 10);
  }

  /**
   * Returns the number of days until the given timestamp (will be negative if in the past)
   */
  static daysBetween(timestampOne: number, timestampTwo: number): number {
    return Math.round(Math.abs(timestampOne - timestampTwo) / Util.oneDay);
  }

  /**
   * Returns the number of days until the given timestamp (will be negative if in the past)
   */
  static daysUntil(timestamp: number): number {
    const now = new Date();
    return Math.round((timestamp - now.getTime()) / Util.oneDay);
  }

  /**
   * Returns the number of days since the given timestamp (will be negative if in the future)
   */
  static daysSince(timestamp: number): number {
    const now = new Date();
    return Math.round((now.getTime() - timestamp) / Util.oneDay);
  }

  /**
   * Returns the date that is x number of days prior
   */
  static subtractDays(date: Date, days: number): Date {
    return new Date(date.getTime() - days * Util.oneDay);
  }

  /**
   * Returns the date that is x number of days in the future
   */
  static addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * Util.oneDay);
  }

  /**
   * Returns the earliest date
   */
  static minDate(dateOne: Date, dateTwo: Date) {
    return dateOne.getTime() < dateTwo.getTime() ? dateOne : dateTwo;
  }

  /**
   * Returns the latest date
   */
  static maxDate(dateOne: Date, dateTwo: Date) {
    return dateOne.getTime() > dateTwo.getTime() ? dateOne : dateTwo;
  }

  /**
   * Sets the top level html class based on the type of extension being used. This allows
   * for dynamic styling to match bullhorn styling in the top level styles.scss stylesheet.
   */
  static setHtmlExtensionClass(extensionType: 'custom-card' | 'custom-tab' | 'custom-action' | 'custom-menu-item') {
    document.documentElement.className = extensionType;
  }

  /**
   * Given a set of numbers, computes the harmonic mean, throwing away any non-zero numbers.
   */
  static average(numbers: number[]) {
    return numbers ? harmonicMean(numbers.filter(n => n > 0)) : 0;
  }

  static sum(total, num) {
    return total + num;
  }

  /**
   * Returns a score category for the given days spent and historic averages
   */
  static getProbabilityScore(daysSpent: number, averages: Averages): ProbabilityScore {
    if (daysSpent < averages.daysToFirstSuccessfulSubmit) {
      return 'high';
    } else if (daysSpent / averages.daysToFirstSuccessfulSubmit < 3) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Returns a color code given the days to submit and the averages.
   */
  static getProbabilityColor(daysToSubmit: number, averages: Averages, lighten = false): string {
    const probabilityColors = {
      low: '#da4453',
      medium: '#f6b042',
      high: '#8cc152',
    };
    const lighterProbabilityColors = {
      low: '#ff4d5e',
      medium: '#ffb80c',
      high: '#a4db54',
    };
    const probabilityScore = this.getProbabilityScore(daysToSubmit, averages);
    if (lighten) {
      return lighterProbabilityColors[probabilityScore];
    }
    return probabilityColors[probabilityScore];
  }

  /**
   * Given a rest return of job data from Bullhorn, converts the jobs into the historic job record data needed for calculations.
   *
   * Jobs with multiple placements are ignored, only the first submission/placement is considered.
   * The multiple openings multiplier is used to offset multiples.
   *
   * Throw out all bad data that would throw off calculations:
   *  - Missing submissions/placements
   *  - Not all of the submissions/placements returned (more than 10 of either)
   *  - First submission date occurring after first placement
   *  - Jobs with zero days until the first placement (bookkeeping only)
   */
  static createHistoricJobs(jobs: any[]): HistoricJob[] {
    const historicJobRecords: HistoricJob[] = [];
    jobs.forEach(job => {
      // Throw out job if it is missing submission or placements
      if (job.submissions && job.submissions.data && job.submissions.data.length > 0 &&
        job.placements && job.placements.data && job.placements.data.length > 0) {

        // Throw out job if we are missing data that would take extra rest calls
        if (job.submissions.data.length < job.submissions.total ||
          job.placements.data.length < job.placements.total) {
          return;
        }

        // Find the submission that resulted in the first successful placement
        const firstFill = job.placements.data.sort((a, b) => a.dateAdded - b.dateAdded)[0];
        const firstSuccessfulSubmit = job.submissions.data.sort((a, b) => a.dateAdded - b.dateAdded)
          .find(submit => submit.jobOrder.id === firstFill.jobOrder.id);

        // Throw out job if we have missing or incomplete data
        if (!firstSuccessfulSubmit) {
          return;
        }

        // Get submission/placement timing
        const firstSubmitDate = firstSuccessfulSubmit.dateAdded;
        const firstFillDate = firstFill.dateAdded;

        // Throw out job if first submission occurs after the first placement
        if (firstSubmitDate > firstFillDate) {
          return;
        }

        const historicJob: HistoricJob = {
          id: job.id,
          title: job.title,
          numOpenings: job.numOpenings,
          dateAdded: job.dateAdded,
          firstSubmissionDate: firstSubmitDate,
          firstPlacementDate: firstFillDate,
          daysToFirstSuccessfulSubmit: this.demoizeDaysToSubmit(Math.max(Util.daysBetween(job.dateAdded, firstSubmitDate), 0)),
          daysToFirstFill: Math.max(Util.daysBetween(job.dateAdded, firstFillDate), 0),
          submitToFillRate: job.placements.total / job.submissions.total,
          billRate: job.clientBillRate,
        };
        historicJobRecords.push(historicJob);
      }
    });
    // Throw out jobs that are just bookkeeping
    return historicJobRecords.filter(record => record.daysToFirstFill > 0);
  }

  /**
   * Given the filled jobs themselves and high level numbers, constructs the averages needed for probability calculations.
   *
   * @param numJobs       number of jobs in a given category
   * @param numSubmitted  number of jobs in the category that have a submission
   * @param numFilled     number of jobs in the category that have a placement
   * @param jobsFilled    all job records that have placements
   */
  static createHistoricJobsAndAverages(numJobs: number, numSubmitted: number, numFilled: number, jobsFilled: any): HistoricJobCategory {
    const jobs = this.createHistoricJobs(jobsFilled);
    const averages: Averages = {
      daysToFirstSuccessfulSubmit: Util.average(jobs.map(job => job.daysToFirstSuccessfulSubmit)),
      daysToFirstFill: Util.average(jobs.map(job => job.daysToFirstFill)),
      billRate: Util.average(jobs.map(job => job.billRate)),
      totalJobs: numJobs,
      jobsSubmitted: numSubmitted,
      jobsFilled: numFilled,
      submitToFillRate: numSubmitted > 0 ? numFilled / numSubmitted : 0,
    };
    jobs.forEach(job => {
      job.daysToFirstFill = this.demoizeDaysToFill(job.daysToFirstFill, averages.daysToFirstFill);
      job.billRate = this.demoizeBillRate(job.billRate, averages.billRate);
    });
    return { jobs, averages };
  }

  /**
   * Returns the trend line calculated based on historic data analysis for how many on average placements are made
   * for the given number of openings that a job has.
   *
   * Above 8 openings the numbers stay relatively constant
   */
  static numOpeningsToAveragePlacementNumber(numOpenings: number): number {
    return Math.min(numOpenings, 8) * 0.253 + 0.112;
  }

  /**
   * Returns the trend line calculated based on historic data analysis for how many on average submissions are required
   * in order for a given number of placements to be made.
   */
  static averageSubmitsPerFill(numPlacements: number): number {
    return numPlacements * 0.516 + 2.62;
  }

  /**
   * Compute averages for all historic data.
   *
   * Sums up all job totals, but averages all days/rates
   */
  static computeAverages(historicJobCategories: HistoricJobCategory[]): Averages {
    return {
      totalJobs: historicJobCategories.map(avg => avg.averages.totalJobs).reduce(this.sum),
      jobsSubmitted: historicJobCategories.map(avg => avg.averages.jobsSubmitted).reduce(this.sum),
      jobsFilled: historicJobCategories.map(avg => avg.averages.jobsFilled).reduce(this.sum),
      daysToFirstFill: Util.average(historicJobCategories.map(avg => avg.averages.daysToFirstFill)),
      daysToFirstSuccessfulSubmit: Util.average(historicJobCategories.map(avg => avg.averages.daysToFirstSuccessfulSubmit)),
      submitToFillRate: Util.average(historicJobCategories.map(avg => avg.averages.submitToFillRate)),
      billRate: Util.average(historicJobCategories.map(avg => avg.averages.billRate)),
    };
  }

  /**
   * For pretty printing averages
   */
  static roundForPrinting(averages: Averages): Averages {
    return {
      totalJobs: this.roundToPrecision(averages.totalJobs, 0),
      jobsSubmitted: this.roundToPrecision(averages.jobsSubmitted, 0),
      jobsFilled: this.roundToPrecision(averages.jobsFilled, 0),
      daysToFirstSuccessfulSubmit: this.roundToPrecision(averages.daysToFirstSuccessfulSubmit, 1),
      daysToFirstFill: this.roundToPrecision(averages.daysToFirstFill, 1),
      submitToFillRate: this.roundToPrecision(averages.submitToFillRate, 3),
      billRate: this.roundToPrecision(averages.billRate, 3),
    };
  }

  static roundToPrecision(num: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }

  /**
   * Post Processing of all related jobs to calculate averages after the results are in.
   */
  static computeProbabilityScore(input: ProbabilityScoreInput, averages: Averages): ProbabilityScoreOutput {
    const output: ProbabilityScoreOutput = {};

    // Calculate average submissions typically required to place the normal amount of placements given the number of openings
    output.averageFillsPerNumOpenings = Util.numOpeningsToAveragePlacementNumber(input.numOpenings);
    output.averageSubmitsPerFill = Util.averageSubmitsPerFill(output.averageFillsPerNumOpenings);

    // Percentage of submissions remaining to get to the average number of submits to fill
    output.submitOpportunity = (output.averageSubmitsPerFill - input.numSubmissions) / output.averageSubmitsPerFill;

    // Simple Days Remaining Probability = Days Remaining / Average Days to Fill
    output.daysRemainingProbability = Math.max(input.daysRemaining / averages.daysToFirstSuccessfulSubmit, averages.submitToFillRate);

    // Probability to Close = Days Remaining Probability * NSF (Pos/Neg adjustment)
    output.probabilityToClose = Math.min(Math.max(output.submitOpportunity * output.daysRemainingProbability, 0), 1);

    return output;
  }

  /**
   * Returns the number of positions for the given job on the given date
   */
  static getNumSubmissions(currentJob: JobOrder, x: Date) {
    const job: any = <any>currentJob;
    const priorSubmissions = job.submissions.data.filter((submit) => submit.dateAdded < x.getTime());
    return priorSubmissions.length;
  }

  /**
   * Given an array of numbers, bucketizes them into categories with the total count (up to the maxCategories)
   */
  static calculateHistogram(numbers: number[], maxCategories: number): number[] {
    const histogram = new Array(maxCategories).fill(0);
    numbers.forEach(number => {
      if (number < histogram.length) {
        histogram[number]++;
      }
    });
    return histogram;
  }

  /**
   * Given an array of bill rates, bucketizes them into categories with the total dollar amount (up to the maxCategories).
   *
   * Bill rate histogram is a week after the job fills, money starts rolling in on an hourly basis
   */
  static calculateBillRateHistogram(jobs: HistoricJob[], maxCategories: number) {
    const DAYS_PER_WEEK = 5;
    const HOURS_PER_DAY = 8;
    const NET_30 = 30;
    const histogram = new Array(maxCategories).fill(0);

    jobs.forEach(job => {
      // Billing racks up every week after the job fills - just do the first day for now
      const bucket: number = job.daysToFirstFill + NET_30;
      if (bucket < histogram.length) {
        // Average out the first daily paycheck for all jobs
        histogram[bucket] = Util.average([histogram[bucket], job.billRate * HOURS_PER_DAY * DAYS_PER_WEEK]);
      }
    });
    return histogram;
  }

  /**
   * Given a number, round to the nearest multiple
   */
  static roundToNearest(number: number, multiple: number) {
    return Math.ceil(number / multiple) * multiple;
  }

  static getCandidateRecentPay(candidate: any): number {
    const hourlyRate: number = Math.max(
      candidate.hourlyRate, candidate.hourlyRateLow, candidate.salary / 2080, candidate.salaryLow / 2080);
    let recentPayRate: number = hourlyRate || 0;

    if (candidate.submissions && candidate.submissions.data && candidate.submissions.data.length > 0) {
      // If the submission jobOrder has a payRate, use that if it's more than the candidate hourlyRate
      if (candidate.submissions.data[0].jobOrder && candidate.submissions.data[0].jobOrder.payRate) {
        recentPayRate = Math.max(recentPayRate, candidate.submissions.data[0].jobOrder.payRate);
      }
      // If the submission has a payRate, use that if it's more than the hourlyRate or jobOrder.payRate
      recentPayRate = Math.max(recentPayRate, candidate.submissions.data[0].payRate);
    }

    // If the candidate has a placement, use that if it's more than the hourlyRate, jobOrder.payRate or submission.payRate
    if (candidate.placements && candidate.placements.data && candidate.placements.data.length > 0) {
      recentPayRate = Math.max(recentPayRate, candidate.placements.data[0].payRate);
    }

    // If the recentPayRate is unusually high for an hourly rate, assume that salary was incorrectly added to a field
    // meant to store an hourly rate. Divide by 2080 to get an approximate hourly rate
    if (recentPayRate > 500) {
      recentPayRate = recentPayRate / 2080;
    }
    return recentPayRate;
  }

  /**
   * Create a better looking demo by tweaking some values.
   */
  static demoizeDaysToSubmit(days: number): number {
    const fairDiceRoll = Math.random();
    if (days === 0) {
      return days + Math.round(Math.random() * 20);
    }
    if (fairDiceRoll > 0.7) {
      return days + Math.round(Math.random() * 20);
    } else if (fairDiceRoll > 0.3) {
      return days + Math.round(Math.random() * 10);
    } else if (fairDiceRoll > 0.2) {
      return days + Math.round(Math.random() * 5);
    }
    return days;
  }

  /**
   * Create a better looking demo by tweaking some values.
   */
  static demoizeDaysToFill(days: number, averageDaysToFill: number): number {
    if (days < averageDaysToFill * 0.5 || days > averageDaysToFill * 3) {
      if (Math.random() > 0.5) {
        return averageDaysToFill + Math.round(Math.random() * 5);
      } else {
        return averageDaysToFill - Math.round(Math.random() * 5);
      }
    }
    return days;
  }

  /**
   * Fill in gaps with missing data.
   */
  static demoizeBillRate(billRate: number, avgBillRate: number): number {
    if (!billRate) {
      const spread = avgBillRate / 2;
      if (Math.random() > 0.5) {
        return avgBillRate + Math.round(Math.random() * spread);
      } else {
        return avgBillRate - Math.round(Math.random() * spread);
      }
    }
    return billRate;
  }

  /**
   * The days to fill as a somewhat normal distribution
   */
  static demoizeDaysToFillPercentage(daysToFill: number, avgDaysToFill: number): number {
    // Distance from mean, lower is better
    let percentage = 1 / (daysToFill / avgDaysToFill);

    // Numbers are over 100% to start with
    percentage = percentage / 2;

    // If the number is still high, keep it high, but random
    if (percentage > 1) {
      percentage = 0.7 + (Math.random() * 0.3);
    }
    return percentage;
  }
}
