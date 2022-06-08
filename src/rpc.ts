import { displayProcsWithStatus, displaySuccessfulMessage } from "./display";
import net from "node:net";
import { EventEmitter } from "node:stream";
import { startProc, stopProc } from "./proc";
import { ProcInfo } from "./types";
import { NOREMAN_COMMAND } from "./constants";
import { parseNoremanCommand } from "./parse";

const run = (cmd: string, port: number) => {
  const client = net.createConnection({ port }, () => {
    // console.log('Noreman RPC Client: connected to server!');
    client.write(cmd);
  });

  client.on("data", (data) => {
    const parsedCmd = parseNoremanCommand(cmd);

    switch (parsedCmd[0]) {
      case NOREMAN_COMMAND.LIST:
        displayProcsWithStatus(data.toString());
        break;
      case NOREMAN_COMMAND.STOP:
      case NOREMAN_COMMAND.START:
      case NOREMAN_COMMAND.RESTART:
        displaySuccessfulMessage(data.toString());
        break;
      default:
        throw new Error("Invalid noreman command: " + cmd);
    }

    client.end();
  });

  client.on("end", () => {
    // console.log('disconnected from server');
  });
};

const getProcsWithStatus = (procs: Array<ProcInfo>): string | undefined => {
  const procList = procs.map(({ name, status }) => {
    return { name, status };
  });

  if (procList.length === 0) {
    return;
  }

  return procList.map(({ name, status }) => {
    return `${name}: ${status}`;
  }).join("\n");
};

const getProc = (
  name: string,
  procs: Array<ProcInfo>,
): ProcInfo | undefined => {
  const procName = name;
  const procInfo = procs.find((proc) => proc.name === procName);
  return procInfo || undefined;
};

const startServer = (port: number, emitter: EventEmitter): net.Server => {
  const procs: Array<ProcInfo> = [];

  const server = net.createServer((c) => {
    // console.log("Noreman RPC Server: connected");

    c.on("data", (data) => {
      // console.log("rpc server log: ", data.toString());

      const cmdList = parseNoremanCommand(data.toString());

      switch (cmdList[0]) {
        case NOREMAN_COMMAND.LIST:
          const procName = getProcsWithStatus(procs);

          if (procName) {
            c.write(procName);
          } else {
            c.write("Not running proc");
          }

          break;
        case NOREMAN_COMMAND.STOP:
          const stopProcInfo = getProc(cmdList[1], procs);

          if (stopProcInfo) {
            stopProc(stopProcInfo);
            c.write(`Stop successfully: ${stopProcInfo.name}`);
          }

          break;
        case NOREMAN_COMMAND.START:
          const startProcInfo = getProc(cmdList[1], procs);

          if (startProcInfo) {
            if (startProcInfo.status === "stop") {
              startProc(startProcInfo, emitter);
              c.write(`Start successfully: ${startProcInfo.name}`);
            } else {
              c.write(
                `Error, It is not in a state to start: ${startProcInfo.name}`,
              );
            }
          } else {
            c.write("Error: Not found proc");
          }

          break;
        case NOREMAN_COMMAND.RESTART:
          const restartProcInfo = getProc(cmdList[1], procs);

          if (restartProcInfo) {
            restartProcInfo?.childProcess?.kill();
            c.write(`Stop successfully: ${restartProcInfo.name}`);

            // TODO:
            setTimeout(startProc, 1000, restartProcInfo, emitter);
            c.write(`Start successfully: ${restartProcInfo.name}`);
          } else {
            c.write("Error: Not found proc");
          }

          break;
      }
    });

    c.on("end", () => {
      // console.log("Noreman RPC Client: disconnected");
    });
  });

  server.on("error", (err) => {
    throw err;
  });

  server.listen(port, () => {
    console.log("server bound");
  });

  emitter.on("registerproc", (proc: ProcInfo) => {
    const existsProcIndex = procs.findIndex((p) => p.name === proc.name);

    if (existsProcIndex === -1) {
      procs.push(proc);
    } else {
      procs[existsProcIndex] = proc;
    }
  });

  emitter.on("killall", function (signal) {
    if (server.listening) {
      server.close((e) => {
        if (e) console.error(e);

        // console.log(`Noreman RPC Server close: ${signal}`);
      });
    }
  });

  return server;
};

export { run, startServer };
