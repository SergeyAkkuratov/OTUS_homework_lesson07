import initFunction from "./index";

describe("Sanity tests", () => {
  it("Check text in console.log", () => {
    expect(initFunction("test text")).toBe("test text");
  });
});
