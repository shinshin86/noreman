import { Env, ProcInfo } from "./types";
import { spawn } from "child_process";
import { CMD_SHELL } from "./constants";
import { EventEmitter } from "stream";

const spawnProc = (proc: ProcInfo, emitter: EventEmitter) => {
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
    console.log(`${proc.name}: ${data}`);
  });

  child.stderr?.on("data", (data) => {
    console.log(`${proc.name}: ${data}`);
  });

  child.on("close", (code, signal) => {
    try {
      stopProc(proc, emitter);

      if (code === 0) {
        proc.exitCode = code;
        console.log(`${proc.name}: Exited successfully`);
      } else {
        proc.exitCode = code;
        console.log(`${proc.name}: Exited with exit code ${signal || code}`);
      }
    } catch (err) {
      console.error("Process stop error: ", err);
    }
  });

  emitter.on("killall", (signal) => {
    try {
      child.kill(signal);
    } catch (error) {
      if (error.code === "EPERM") {
        console.error(
          `${proc.name}: Process has become unkillable. return EPERM`,
        );
      }
    }
  });
};

const stopProc = async (proc: ProcInfo) => {
  proc?.childProcess?.kill();
  proc.status = "stop";
};

const startProc = async (proc: ProcInfo, emitter: EventEmitter) => {
  if (proc.cmd) {
    return null;
  }

  spawnProc(proc, emitter);

  return null;
};

const stopProcs = (procs: Array<ProcInfo>) => {
  for (const proc of procs) {
    if (proc.childProcess) {
      console.log("STOP PROC:", proc.name);
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
