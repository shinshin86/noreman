import { COLOR_RESET, COLORS } from "./constants";
import { ProcInfo } from "./types";

export const displayLog = (proc: ProcInfo, message: string) => {
  const color = COLORS[proc.colorIndex];
  console.log(`${color}${proc.name}:${COLOR_RESET} ${message}`);
};

export const displayProcsWithStatus = (data: string) => {
  const procStatusList = data.split("\n");

  for (const procStatus of procStatusList) {
    const status = procStatus.split(":")[1].trim();

    if (status.startsWith("running")) {
      console.log(`${COLORS[0]}${procStatus}${COLOR_RESET}`);
    } else {
      console.log(`${COLORS[5]}${procStatus}${COLOR_RESET}`);
    }
  }
};

export const displaySuccessfulMessage = (message: string) => {
  console.log(`${COLORS[0]}${message}${COLOR_RESET}`);
};
