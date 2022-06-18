import path from "path";
import { EventEmitter } from "events";
import { run, startServer } from "./rpc";
import { startProcs, stopProcs } from "./proc";
import { Config, ProcInfo } from "./types";
import {
  APP_INFO,
  DEFAULT_RPC_PORT,
  NOREMAN_COMMAND,
  NOREMAN_LIST_OPTIONS,
} from "./constants";
import { readConfig } from "./config";
import { readProcfile } from "./procfile";
import { parseCLI } from "./parse";

const start = async (
  emitter: EventEmitter,
  configPath: string | undefined,
): Promise<void> => {
  let config: Config;

  try {
    config = await readConfig(
      configPath || path.join(process.cwd(), "Procfile"),
    );
    process.chdir(path.join(process.cwd(), config.baseDir));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

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

  try {
    const { command, runCommand, option } = parseCLI(process.argv.slice(2));

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
        const configFilePath: string | undefined = option["configPath"] &&
          path.join(process.cwd(), option["configPath"]);
        await start(emitter, configFilePath);
        break;
      case "run":
        switch (runCommand) {
          case "list":
            run(
              `${NOREMAN_COMMAND.LIST}${
                option["displayPid"] ? `:${NOREMAN_LIST_OPTIONS.PID}` : ""
              }`,
              DEFAULT_RPC_PORT,
            );
            break;
          case "stop":
            run(
              `${NOREMAN_COMMAND.STOP}:${option["targetProcName"]}`,
              DEFAULT_RPC_PORT,
            );
            break;
          case "start":
            run(
              `${NOREMAN_COMMAND.START}:${option["targetProcName"]}`,
              DEFAULT_RPC_PORT,
            );
            break;
          case "restart":
            run(
              `${NOREMAN_COMMAND.RESTART}:${option["targetProcName"]}`,
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
  } catch (error) {
    console.error(error);
  }
})();
