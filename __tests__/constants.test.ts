import { CMD_SHELL } from "../src/constants";

describe("constants", () => {
  describe("CMD_SHELL", () => {
    test("darwin", () => {
      expect(CMD_SHELL["darwin"]).toBe("/bin/sh -c");
    });

    test("linux", () => {
      expect(CMD_SHELL["linux"]).toBe("/bin/sh -c");
    });

    test("win32", () => {
      expect(CMD_SHELL["win32"]).toBe("cmd /c");
    });

    test("invalid string", () => {
      expect(CMD_SHELL["foo"]).toBeUndefined();
    });
  });
});
