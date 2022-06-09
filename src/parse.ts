const parseNoremanCommand = (cmd: string): Array<string> => {
  if (!cmd.startsWith("noreman.")) {
    throw new Error("Invalid noreman command");
  }

  return cmd.split(":");
};

export { parseNoremanCommand };
