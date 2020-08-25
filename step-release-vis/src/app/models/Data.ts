export interface CandidateInfo {
  candidate: string;
  jobCount: number;
}

export interface Snapshot {
  timestamp: number;
  candsInfo: CandidateInfo[];
}

export interface Environment {
  environment: string;
  snapshots: Snapshot[];
}
