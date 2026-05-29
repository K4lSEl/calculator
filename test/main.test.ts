import { describe, it, expect } from "vitest";
import { getDisplay } from "../src/function";

describe("getDisplay 関数のテスト", () => {
  it("2が表示されているときに3を押すと23になる", () => {
    expect(getDisplay("3", "2")).toBe("23");
  });
});
