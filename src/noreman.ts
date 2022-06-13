import path from "path";
import { EventEmitter } from "events";
import { run, startServer } from "./rpc";
import { startProcs, stopProcs } from "./proc";
import { ProcInfo } from "./types";
import { APP_INFO, DEFAULT_RPC_PORT, NOREMAN_COMMAND } from "./constants";
import { readConfig } from "./config";
import { readProcfile } from "./procfile";

const start = async (
  emitter: EventEmitter,
  configPath: string | undefined,
): Promise<void> => {
  const config = await readConfig(configPath);
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

  // TODO: parse command and option
  const command = process.argv.slice(2)[0];
  const runCommand = process.argv.slice(2)[1];

  const option: any = {};
  let configJsonPath;

  if (
    process.argv.slice(2).length >= 3 &&
    ["-c", "--config"].includes(process.argv.slice(2)[1])
  ) {
    option["configPath"] = process.argv.slice(2)[2];
  }

  if (Object.keys(option).length === 1 && option["configPath"]) {
    const configFilePath = option["configPath"];
    configJsonPath = path.join(process.cwd(), configFilePath);
  }

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
      await start(emitter, configJsonPath);
      break;
    case "run":
      switch (runCommand) {
        case "list":
          run(NOREMAN_COMMAND.LIST, DEFAULT_RPC_PORT);
          break;
        case "stop":
          const stopProcName = process.argv.slice(2)[2];
          run(`${NOREMAN_COMMAND.STOP}:${stopProcName}`, DEFAULT_RPC_PORT);
          break;
        case "start":
          const startProcName = process.argv.slice(2)[2];
          run(`${NOREMAN_COMMAND.START}:${startProcName}`, DEFAULT_RPC_PORT);
          break;
        case "restart":
          const restartProcName = process.argv.slice(2)[2];
          run(
            `${NOREMAN_COMMAND.RESTART}:${restartProcName}`,
            DEFAULT_RPC_PORT,
          );
          break;
        default:
          throw new Error("Invalid run commmand");
      }
      break;
    default:
      console.log("error");
  }
})();
