import {
  Env as EnvProto,
  Snapshot as SnapshotProto,
  CandidateInfo as CandidateInfoProto,
  Project as ProjectProto,
  CandidateMetadata as CandidateMetadataProto,
} from '../proto/generated/data_pb';
import {google_protobuf_timestamp_pb} from 'google-protobuf/google/protobuf/timestamp_pb';

export type Environment = EnvProto.AsObject;
export type CandidateInfo = CandidateInfoProto.AsObject;
export type Snapshot = SnapshotProto.AsObject;
export type Project = ProjectProto.AsObject;
export type CandidateMetadata = CandidateMetadataProto.AsObject;
export type Timestamp = google_protobuf_timestamp_pb.Timestamp.AsObject;
