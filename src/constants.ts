const APP_INFO = {
  name: "noreman",
  version: "0.0.1",
};

const COLORS = [
  "\u001b[32m", // green
  "\u001b[36m", // cyan
  "\u001b[35m", // magenta
  "\u001b[33m", // yellow
  "\u001b[34m", // blue
  "\u001b[31m", // red
];

const COLOR_RESET = "\u001b[0m";

const DEFAULT_RPC_PORT = 8555;

// TODO: windows
const CMD_SHELL = "/bin/sh -c";

const NOREMAN_COMMAND = {
  LIST: "noreman.list",
  STOP: "noreman.stop",
  START: "noreman.start",
  RESTART: "noreman.restart",
};

export {
  APP_INFO,
  CMD_SHELL,
  COLOR_RESET,
  COLORS,
  DEFAULT_RPC_PORT,
  NOREMAN_COMMAND,
};
