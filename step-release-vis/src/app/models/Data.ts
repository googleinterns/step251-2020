export interface CandidateInfo {
  name: string;
  job_count: number;
}

export interface Snapshot {
  timestamp: number;
  cands_info: CandidateInfo[];
}

export interface Environment {
  environment: string;
  snapshots: Snapshot[];
}
