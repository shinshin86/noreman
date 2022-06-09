import { NOREMAN_COMMAND } from "../src/constants";
import { parseNoremanCommand } from "../src/parse";

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
});
