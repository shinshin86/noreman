import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { EventEmitter } from "events";
import { run, startServer } from "./rpc";
import { startProcs, stopProcs } from "./proc";
import { Config, ProcInfo } from "./types";
import { COLORS, DEFAULT_RPC_PORT } from "./constants";

const readConfig = async (): Promise<Config> => {
  // TODO: specify config path
  const configJson = ".noreman.json";
  const configJsonPath = path.join(process.cwd(), configJson);

  let config: Config = {
    procfile: "Procfile",
    port: 5000,
    baseDir: ".",
    basePort: 5000,
  };

  if (existsSync(configJsonPath)) {
    const jsonText = await fs.readFile(configJsonPath, "utf8");
    const parsedConfig = JSON.parse(jsonText);

    if (parsedConfig.procfile) {
      config.procfile = parsedConfig.procfile;
    }
    if (parsedConfig.prot) {
      config.port = parsedConfig.port;
    }
    if (parsedConfig.baseDir) {
      config.baseDir = parsedConfig.baseDir;
    }
    if (parsedConfig.procfile) {
      config.basePort = parsedConfig.basePort;
    }
  }

  return config;
};

const readProcfile = async (config: Config): Promise<Array<ProcInfo>> => {
  const procfilePath = path.join(process.cwd(), config.procfile);
  const content = await fs.readFile(procfilePath, "utf8");

  const procs: Array<ProcInfo> = [];

  let index = 0;

  for (const line of content.split("\n")) {
    const tokens = line.split(":");

    if (tokens.length !== 2 || tokens[0].startsWith("#")) {
      continue;
    }

    const key = tokens[0].trim();
    const value = tokens[1].trim();

    const proc: ProcInfo = {
      name: key,
      cmdline: value,
      colorIndex: index,
      setPort: true,
      port: config.basePort + (index * 100),
      status: "stop",
    };

    procs.push(proc);

    // TODO: maxProcNameLength

    index = (index + 1) % COLORS.length;
  }

  if (procs.length === 0) {
    throw new Error("no valid entry");
  }

  return procs;
};

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

(async () => {
  const emitter = new EventEmitter();

  process.once("SIGINT", () => {
    console.warn("Interrupted by user");
    emitter.emit("killall", "SIGINT");
  });

  const command = process.argv.slice(2)[0];
  const runCommand = process.argv.slice(2)[1];

  switch (command) {
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
