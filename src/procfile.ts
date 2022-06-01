import fs from "fs/promises";
import path from "path";
import { Config, ProcInfo } from "./types";
import { COLORS } from "./constants";

export const readProcfile = async (
  config: Config,
): Promise<Array<ProcInfo>> => {
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
