/** Canonical `jobs.status` values (TaskPay / PRD). */
export const JOB_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
} as const

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS]

export const JOB_STATUS_LIST: JobStatus[] = [
  JOB_STATUS.OPEN,
  JOB_STATUS.IN_PROGRESS,
  JOB_STATUS.CLOSED,
]
