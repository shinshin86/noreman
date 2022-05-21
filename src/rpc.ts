import net from "node:net";
import { EventEmitter } from "node:stream";
import { startProc, stopProc } from "./proc";
import { ProcInfo } from "./types";

const run = (cmd: string, port: number) => {
  const client = net.createConnection({ port }, () => {
    // console.log('Noreman RPC Client: connected to server!');
    client.write(cmd);
  });

  client.on("data", (data) => {
    console.log(data.toString());
    client.end();
  });

  client.on("end", () => {
    // console.log('disconnected from server');
  });
};

const startServer = (port: number, emitter: EventEmitter): net.Server => {
  const procs: Array<ProcInfo> = [];

  const server = net.createServer((c) => {
    console.log("Noreman RPC Server: connected");

    c.on("data", (data) => {
      console.log("rpc server log: ", data.toString());

      const cmdList = data.toString().split(":");

      switch (cmdList[0]) {
        case "noreman.list":
          const procList = procs.map(({ name, status }) => {
            return { name, status };
          });

          if (procList.length) {
            const procNameList = procList.map(({ name, status }) => {
              return status === "running" ? `*${name}` : name;
            }).join("\n");

            c.write(procNameList);
          } else {
            c.write("Not running proc");
          }

          break;
        case "noreman.stop":
          const stopProcName = cmdList[1];
          const stopProcInfo = procs.find((proc) => proc.name === stopProcName);

          if (stopProcInfo) {
            stopProc(stopProcInfo);
            c.write(`Stop successfully: ${stopProcName}`);
          }

          break;
        case "noreman.start":
          const startProcName = cmdList[1];
          const startProcInfo = procs.find((proc) =>
            proc.name === startProcName
          );

          if (startProcInfo) {
            if (startProcInfo.status === "stop") {
              startProc(startProcInfo, emitter);
              c.write(`Start successfully: ${startProcName}`);
            } else {
              c.write(`Error, It is not in a state to start: ${startProcName}`);
            }
          } else {
            c.write("Error: Not found proc");
          }

          break;
        case "noreman.restart":
          const restartProcName = cmdList[1];
          const restartProcInfo = procs.find((proc) =>
            proc.name === restartProcName
          );

          if (restartProcInfo) {
            restartProcInfo?.childProcess?.kill();
            c.write(`Stop successfully: ${restartProcName}`);

            // TODO:
            setTimeout(startProc, 1000, restartProcInfo, emitter);
            c.write(`Start successfully: ${restartProcName}`);
          } else {
            c.write("Error: Not found proc");
          }

          break;
      }
    });

    c.on("end", () => {
      console.log("Noreman RPC Client: disconnected");
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

        console.log(`Noreman RPC Server close: ${signal}`);
      });
    }
  });

  return server;
};

export { run, startServer };
