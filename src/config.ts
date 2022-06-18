import fs from "fs/promises";
import { existsSync } from "fs";
import { Config } from "./types";

export const readConfig = async (
  configPath: string,
): Promise<Config> => {
  let config: Config = {
    procfile: "Procfile",
    port: 5000,
    baseDir: ".",
    basePort: 5000,
  };

  if (!configPath || !existsSync(configPath)) {
    throw new Error(
      "Procfile does not exist in the specified path.: " + configPath,
    );
  }

  const jsonText = await fs.readFile(configPath, "utf8");
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

  return config;
};
