import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Config } from "./types";

export const readConfig = async (): Promise<Config> => {
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
