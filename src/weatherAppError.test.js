/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-import-assign */
import weatherApp from "./weatherApp";
import exteranlApi from "./externalRequests";
import { weather, ipInfo, testBlob } from "./commonTestData";

jest.mock("./externalRequests", () => ({
  getWeather: jest.fn(),
  getMap: jest.fn(),
  getInfoByIP: jest.fn(),
}));

describe("Weather application tests", () => {
  it("Error with getMap", async () => {
    // Моки
    exteranlApi.getWeather.mockReturnValue(weather.Moscow);
    exteranlApi.getInfoByIP.mockReturnValue(ipInfo);
    exteranlApi.getMap.mockReturnValue(undefined);
    global.URL.createObjectURL = jest.fn(
      () => "blob:http://localhost:8080/dbdb41a6-c771-4692-bdc1-594a6dd28ef5",
    );
    jest.spyOn(window, "alert").mockImplementation(() => {});

    // запуск основной функции
    const el = document.createElement("div");
    weatherApp(el);

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    const map = el.querySelector("#map");
    expect(map).not.toBe(null);
    expect(map.alt).toBe("Couldn't get image of map");
    expect(map.src).toBe("http://localhost/");
  });

  it("Error with getInfoByIP", async () => {
    // Моки
    exteranlApi.getWeather.mockReturnValue(weather.Moscow);
    exteranlApi.getInfoByIP.mockReturnValue({ region: undefined });
    exteranlApi.getMap.mockReturnValue(testBlob);
    global.URL.createObjectURL = jest.fn(
      () => "blob:http://localhost:8080/dbdb41a6-c771-4692-bdc1-594a6dd28ef5",
    );
    jest.spyOn(window, "alert").mockImplementation(() => {});

    // запуск основной функции
    const el = document.createElement("div");
    weatherApp(el);

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(el.querySelector("#info").innerHTML.trim()).toBe(
      "<span>Wait for city name</span>",
    );
  });

  it("Error with getWeather", async () => {
    // Моки
    exteranlApi.getWeather.mockReturnValue({
      cod: 500,
      message: `couldn't get weather info`,
    });
    exteranlApi.getInfoByIP.mockReturnValue({ region: undefined });
    exteranlApi.getMap.mockReturnValue(testBlob);
    global.URL.createObjectURL = jest.fn(
      () => "blob:http://localhost:8080/dbdb41a6-c771-4692-bdc1-594a6dd28ef5",
    );
    jest.spyOn(window, "alert").mockImplementation(() => {});

    // запуск основной функции
    const el = document.createElement("div");
    weatherApp(el);

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(el.querySelector("#info").innerHTML.trim()).toBe(
      "<span>Wait for city name</span>",
    );
  });
});
