export interface CandidateInfo {
  name: string;
  job_count: number;
}

export interface Shapshot {
  timestamp: number;
  cands_info: CandidateInfo[];
}

export interface Environment {
  environment: string;
  snapshots: Shapshot[];
}
