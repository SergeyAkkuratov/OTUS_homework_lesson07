/* eslint-disable no-import-assign */
import fs from "fs";
import { Blob } from "buffer";
import * as mainModule from "./weatherApp";

describe("Weather application tests", () => {
  const weatherMoscow = {
    coord: {
      lon: 37.6156,
      lat: 55.7522,
    },
    weather: [
      {
        icon: "04d",
      },
    ],
    base: "stations",
    main: {
      temp: -0.09,
    },
    id: 524901,
    name: "Moscow",
    cod: 200,
  };

  const ipInfo = {
    region: "Moscow",
  };

  jest.spyOn(mainModule, "getWeather").mockReturnValue(weatherMoscow);
  jest
    .spyOn(mainModule, "getMap")
    .mockReturnValue(
      new Blob([fs.readFileSync("./src/assets/test_blob_map.png")]),
    );
  jest.spyOn(mainModule, "getInfoByIP").mockReturnValue(ipInfo);
  global.URL.createObjectURL = jest.fn(
    () => "blob:http://localhost:8080/dbdb41a6-c771-4692-bdc1-594a6dd28ef5",
  );

  let el;
  beforeEach(() => {
    el = document.createElement("div");
    mainModule.weatherApp(el);
  });

  it("User see map on startup", async () => {
    const map = el.querySelector("#map");
    expect(map).not.toBe(null);
    expect(map.alt).toBe("Couldn't get image of map");
    expect(map.src).toBe(
      "blob:http://localhost:8080/dbdb41a6-c771-4692-bdc1-594a6dd28ef5",
    );
  });

  it("User see temperature on startup", async () => {
    const info = el.querySelector("#info");
    expect(info).not.toBe(null);

    const cityNameEl = info.querySelector("h1");
    expect(cityNameEl).not.toBe(null);
    expect(cityNameEl.innerHTML).toBe("Moscow");

    const tempEl = info.querySelector("h2");
    expect(tempEl).not.toBe(null);
    expect(tempEl.innerHTML).toBe(`Temperature: ${weatherMoscow.main.temp} C`);

    const iconEl = info.querySelector("img");
    expect(iconEl.alt).toBe("Couldn't load icon of weather");
    expect(iconEl.src).toBe(
      `http://openweathermap.org/img/wn/${weatherMoscow.weather[0].icon}@2x.png`,
    );
  });
});
