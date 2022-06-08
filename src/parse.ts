const parseNoremanCommand = (cmd: string): Array<string> =>
  cmd.toString().split(":");

export { parseNoremanCommand };
