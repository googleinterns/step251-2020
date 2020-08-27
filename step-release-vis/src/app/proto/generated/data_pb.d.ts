// package: 
// file: data.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class CandidateInfo extends jspb.Message {
  getCandidate(): string;
  setCandidate(value: string): void;

  getJobCount(): number;
  setJobCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CandidateInfo.AsObject;
  static toObject(includeInstance: boolean, msg: CandidateInfo): CandidateInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CandidateInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CandidateInfo;
  static deserializeBinaryFromReader(message: CandidateInfo, reader: jspb.BinaryReader): CandidateInfo;
}

export namespace CandidateInfo {
  export type AsObject = {
    candidate: string,
    jobCount: number,
  }
}

export class Snapshot extends jspb.Message {
  hasTimestamp(): boolean;
  clearTimestamp(): void;
  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): void;

  clearCandidatesList(): void;
  getCandidatesList(): Array<CandidateInfo>;
  setCandidatesList(value: Array<CandidateInfo>): void;
  addCandidates(value?: CandidateInfo, index?: number): CandidateInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Snapshot.AsObject;
  static toObject(includeInstance: boolean, msg: Snapshot): Snapshot.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Snapshot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Snapshot;
  static deserializeBinaryFromReader(message: Snapshot, reader: jspb.BinaryReader): Snapshot;
}

export namespace Snapshot {
  export type AsObject = {
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    candidatesList: Array<CandidateInfo.AsObject>,
  }
}

export class Env extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearSnapshotsList(): void;
  getSnapshotsList(): Array<Snapshot>;
  setSnapshotsList(value: Array<Snapshot>): void;
  addSnapshots(value?: Snapshot, index?: number): Snapshot;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Env.AsObject;
  static toObject(includeInstance: boolean, msg: Env): Env.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Env, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Env;
  static deserializeBinaryFromReader(message: Env, reader: jspb.BinaryReader): Env;
}

export namespace Env {
  export type AsObject = {
    name: string,
    snapshotsList: Array<Snapshot.AsObject>,
  }
}

export class Project extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  clearEnvsList(): void;
  getEnvsList(): Array<Env>;
  setEnvsList(value: Array<Env>): void;
  addEnvs(value?: Env, index?: number): Env;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Project.AsObject;
  static toObject(includeInstance: boolean, msg: Project): Project.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Project, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Project;
  static deserializeBinaryFromReader(message: Project, reader: jspb.BinaryReader): Project;
}

export namespace Project {
  export type AsObject = {
    name: string,
    envsList: Array<Env.AsObject>,
  }
}

