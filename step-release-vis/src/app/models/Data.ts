import {
  Env as EnvProto,
  Snapshot as SnapshotProto,
  CandidateInfo as CandidateInfoProto,
} from '../proto/generated/data_pb';

export type Environment = EnvProto.AsObject;
export type CandidateInfo = CandidateInfoProto.AsObject;
export type Snapshot = SnapshotProto.AsObject;
export interface Timestamp {
  seconds: number;
  nanos?: number;
}
