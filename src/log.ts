import { COLOR_RESET, COLORS } from "./constants";
import { ProcInfo } from "./types";

export const displayLog = (proc: ProcInfo, message: string) => {
  const color = COLORS[proc.colorIndex];
  console.log(`${color}${proc.name}:${COLOR_RESET} ${message}`);
};
