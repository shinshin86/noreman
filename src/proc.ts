import { Env, ProcInfo } from "./types";
import { spawn } from "child_process";
import { CMD_SHELL } from "./constants";
import { displayLog } from "./log";
import { EventEmitter } from "stream";

const stopProc = async (proc: ProcInfo) => {
  proc?.childProcess?.kill();
  proc.status = "stop";
};

const startProc = async (proc: ProcInfo, emitter: EventEmitter) => {
  if (proc.cmd) {
    return null;
  }

  const cmd = `${CMD_SHELL} "${proc.cmdline}"`;

  const env: Env = {};
  if (proc.setPort) {
    env["PORT"] = proc.port.toString();
  }

  const child = spawn(cmd, { shell: true, env: { ...process.env, ...env } });
  proc.childProcess = child;
  emitter.emit("registerproc", proc);
  proc.status = "running";

  child.stdout?.on("data", (data) => {
    displayLog(proc, data);
  });

  child.stderr?.on("data", (data) => {
    displayLog(proc, data);
  });

  child.on("close", (code, signal) => {
    try {
      stopProc(proc);

      if (code === 0) {
        proc.exitCode = code;
        displayLog(proc, "Exited successfully");
      } else {
        if (code) proc.exitCode = code;
        displayLog(proc, `Exited with exit code ${signal || code}`);
      }
    } catch (err) {
      displayLog(proc, "Process stop error");
      console.error(err);
    }
  });

  emitter.on("killall", (signal) => {
    try {
      child.kill(signal);
    } catch (err) {
      console.error(`${proc.name}: Process has become unkillable`);
      console.error(err);
    }
  });
};

const stopProcs = (procs: Array<ProcInfo>) => {
  for (const proc of procs) {
    if (proc.childProcess) {
      displayLog(proc, "Stop proc");
      stopProc(proc);
    }
  }
};

const startProcs = (
  procs: Array<ProcInfo>,
  emitter: EventEmitter,
) => {
  for (const proc of procs) {
    startProc(proc, emitter);
  }
};

export { startProc, startProcs, stopProc, stopProcs };
