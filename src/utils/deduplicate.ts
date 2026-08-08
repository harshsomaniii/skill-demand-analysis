import { JobAd } from '../types';

export function deduplicateJobs(jobs: JobAd[]): JobAd[] {
  const seenKeys = new Set<string>();
  const uniqueList: JobAd[] = [];

  for (const job of jobs) {
    const title = (job.job_title || '').toLowerCase().trim();
    const company = (job.company || '').toLowerCase().trim();
    const key = `${title}|${company}`;

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueList.push(job);
    }
  }

  return uniqueList;
}
