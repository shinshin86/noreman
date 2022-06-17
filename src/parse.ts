import { CLIOption, ParsedCLI } from "./types";

const parseNoremanCommand = (cmd: string): Array<string> => {
  if (!cmd.startsWith("noreman.")) {
    throw new Error("Invalid noreman command");
  }

  return cmd.split(":");
};

const parseCLI = (argvList: Array<string>): ParsedCLI => {
  const command = argvList[0];
  let runCommand = argvList[1] || "";

  let option: CLIOption = {};

  if (command === "start" && ["-c", "--config"].includes(runCommand)) {
    if (!argvList[2]) {
      throw new Error("Config path must be specified");
    }

    option["configPath"] = argvList[2];
    runCommand = "";
  }

  if (command === "run" && runCommand === "list") {
    option["displayPid"] = ["-p", "--pid"].includes(argvList[2]);
  } else if (command === "run") {
    if (!argvList[2]) {
      throw new Error("Target proc name must be specified");
    }

    switch (runCommand) {
      case "stop":
      case "start":
      case "restart":
        option["targetProcName"] = argvList[2];
        break;
      default:
        throw new Error("Invalid run commmand");
    }
  }

  return { command, runCommand, option };
};

export { parseCLI, parseNoremanCommand };
