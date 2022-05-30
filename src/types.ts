import { ChildProcessWithoutNullStreams } from "child_process";

// Noreman is RPC Server
type Noreman = {
  message: string;
  port: number;
};

type Config = {
  procfile: string;
  port: number;
  baseDir: string;
  basePort: number;
};

type ProcInfo = {
  name: string;
  cmdline: string;
  port: number;
  setPort: boolean;
  colorIndex: number;
  cmd?: string;
  childProcess?: ChildProcessWithoutNullStreams;
  status: "running" | "stop";
  exitCode?: number;
};

type Env = {
  PORT?: string;
};

export type { Config, Env, Noreman, ProcInfo };
