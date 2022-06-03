import path from "path";
import { EventEmitter } from "events";
import { run, startServer } from "./rpc";
import { startProcs, stopProcs } from "./proc";
import { ProcInfo } from "./types";
import { APP_INFO, DEFAULT_RPC_PORT } from "./constants";
import { readConfig } from "./config";
import { readProcfile } from "./procfile";

const start = async (emitter: EventEmitter): Promise<void> => {
  const config = await readConfig();
  process.chdir(path.join(process.cwd(), config.baseDir));

  const procs: Array<ProcInfo> = await readProcfile(config);

  try {
    startServer(DEFAULT_RPC_PORT, emitter);

    startProcs(procs, emitter);
  } catch (err) {
    console.error(err);

    stopProcs(procs);
  }
};

const displayVersion = () => {
  console.log(APP_INFO.version);
};

const displayHelp = () => {
  console.log(`See the README for this project.
URL: https://github.com/shinshin86/noreman`);
};

(async () => {
  const emitter = new EventEmitter();

  process.once("SIGINT", () => {
    console.warn("Interrupted by user");
    emitter.emit("killall", "SIGINT");
  });

  const command = process.argv.slice(2)[0];
  const runCommand = process.argv.slice(2)[1];

  switch (command) {
    case "-v":
    case "--version":
    case "version":
      displayVersion();
      break;
    case "-h":
    case "--help":
    case "help":
      displayHelp();
      break;
    case "start":
      await start(emitter);
      break;
    case "run":
      switch (runCommand) {
        case "list":
          run("noreman.list", DEFAULT_RPC_PORT);
          break;
        case "stop":
          const stopProcName = process.argv.slice(2)[2];
          run(`noreman.stop:${stopProcName}`, DEFAULT_RPC_PORT);
          break;
        case "start":
          const startProcName = process.argv.slice(2)[2];
          run(`noreman.start:${startProcName}`, DEFAULT_RPC_PORT);
          break;
        case "restart":
          const restartProcName = process.argv.slice(2)[2];
          run(`noreman.restart:${restartProcName}`, DEFAULT_RPC_PORT);
          break;
        default:
          throw new Error("Invalid run commmand");
      }
      break;
    default:
      console.log("error");
  }
})();
