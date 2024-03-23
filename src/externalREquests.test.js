import { getInfoByIP, getMap, getWeather } from "./externalRequests";
import { weather, ipInfo, testBlob } from "./commonTestData";

describe("External API request tests", () => {
  it("Test getWeather function", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(weather["Saint Petersburg"]),
      }),
    );

    const result = await getWeather("DefaultCity");
    expect(result).toBe(weather["Saint Petersburg"]);
  });

  it("Test get ipInfo function", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(ipInfo),
      }),
    );

    const result = await getInfoByIP();
    expect(result).toBe(ipInfo);
  });

  it("Test getMap function", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () => Promise.resolve(testBlob),
      }),
    );

    const result = await getMap(weather.Moscow.coord);
    expect(result).toStrictEqual(testBlob);
  });

  it("Test getWeather function", async () => {
    global.fetch = jest.fn(() => Promise.reject());

    const result = await getWeather("DefaultCity");
    expect(result).toStrictEqual({
      cod: 500,
      message: "couldn't get weather info",
    });
  });

  it("Test get ipInfo function", async () => {
    global.fetch = jest.fn(() => Promise.reject());

    const result = await getInfoByIP();
    expect(result).toStrictEqual({ region: undefined });
  });

  it("Test getMap function", async () => {
    global.fetch = jest.fn(() => Promise.reject());

    const result = await getMap(weather.Moscow.coord);
    expect(result).toStrictEqual(undefined);
  });
});
