import { NOREMAN_COMMAND } from "../src/constants";
import { parseCLI, parseNoremanCommand } from "../src/parse";

describe("parse", () => {
  describe("parseNoremanCommand", () => {
    test("parse command(list)", () => {
      const parsedCmd = parseNoremanCommand(NOREMAN_COMMAND.LIST);
      expect(parsedCmd[0]).toBe("noreman.list");
      expect(parsedCmd[1]).toBeUndefined();
    });

    test("parse command(stop)", () => {
      const testProcName = "test1";
      const parsedCmd = parseNoremanCommand(
        `${NOREMAN_COMMAND.STOP}:${testProcName}`,
      );
      expect(parsedCmd[0]).toBe("noreman.stop");
      expect(parsedCmd[1]).toBe("test1");
    });

    test("parse command(start)", () => {
      const testProcName = "test1";
      const parsedCmd = parseNoremanCommand(
        `${NOREMAN_COMMAND.START}:${testProcName}`,
      );
      expect(parsedCmd[0]).toBe("noreman.start");
      expect(parsedCmd[1]).toBe("test1");
    });

    test("parse command(restart)", () => {
      const testProcName = "test1";
      const parsedCmd = parseNoremanCommand(
        `${NOREMAN_COMMAND.RESTART}:${testProcName}`,
      );
      expect(parsedCmd[0]).toBe("noreman.restart");
      expect(parsedCmd[1]).toBe("test1");
    });

    test("Invalid command", () => {
      expect(() => parseNoremanCommand("foo")).toThrowError(
        "Invalid noreman command",
      );
    });
  });

  describe("parseCLI", () => {
    test("start", () => {
      const result = parseCLI(["start"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(0);

      expect(result.command).toBe("start");
      expect(result.runCommand).toBe("");
    });

    test("start -c .noreman.json", () => {
      const result = parseCLI(["start", "-c", ".noreman.json"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("configPath" in result.option).toBeTruthy();

      expect(result.command).toBe("start");
      expect(result.runCommand).toBe("");
      expect(result.option.configPath).toBe(".noreman.json");
    });

    test("start -c", () => {
      expect(() => parseCLI(["start", "-c"])).toThrowError(
        "Config path must be specified",
      );
    });

    test("run list", () => {
      const result = parseCLI(["run", "list"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("displayPid" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("list");
      expect(result.option.displayPid).toBeFalsy();
    });

    test("run list -p", () => {
      const result = parseCLI(["run", "list", "-p"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("displayPid" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("list");
      expect(result.option.displayPid).toBeTruthy();
    });

    test("run list --pid", () => {
      const result = parseCLI(["run", "list", "--pid"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("displayPid" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("list");
      expect(result.option.displayPid).toBeTruthy();
    });

    test("run list --pid foo(Unnecessary trailing options are ignored)", () => {
      const result = parseCLI(["run", "list", "--pid", "foo"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("displayPid" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("list");
      expect(result.option.displayPid).toBeTruthy();
    });

    test("run list -pid(Invalid option)", () => {
      const result = parseCLI(["run", "list", "-pid"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("displayPid" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("list");
      expect(result.option.displayPid).toBeFalsy();
    });

    test("run list foo(Invalid option)", () => {
      const result = parseCLI(["run", "list", "foo"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("displayPid" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("list");
      expect(result.option.displayPid).toBeFalsy();
    });

    test("run stop proc1", () => {
      const result = parseCLI(["run", "stop", "proc1"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("targetProcName" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("stop");
      expect(result.option.targetProcName).toBe("proc1");
    });

    test("run start proc1", () => {
      const result = parseCLI(["run", "start", "proc1"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("targetProcName" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("start");
      expect(result.option.targetProcName).toBe("proc1");
    });

    test("run restart proc1", () => {
      const result = parseCLI(["run", "restart", "proc1"]);
      expect("command" in result).toBeTruthy();
      expect("runCommand" in result).toBeTruthy();
      expect("option" in result).toBeTruthy();
      expect(Object.keys(result.option).length).toBe(1);
      expect("targetProcName" in result.option).toBeTruthy();

      expect(result.command).toBe("run");
      expect(result.runCommand).toBe("restart");
      expect(result.option.targetProcName).toBe("proc1");
    });

    test("run foo proc1", () => {
      expect(() => parseCLI(["run", "foo", "proc1"])).toThrowError(
        "Invalid run commmand",
      );
    });

    test("run start", () => {
      expect(() => parseCLI(["run", "start"])).toThrowError(
        "Target proc name must be specified",
      );
    });
  });
});
