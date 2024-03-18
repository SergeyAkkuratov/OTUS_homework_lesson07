/* eslint-disable no-import-assign */
import fs from "fs";
import { Blob } from "buffer";
import * as mainModule from "./weatherApp";

// Данные для мокирования
const weather = {
  Moscow: {
    coord: {
      lon: 37.6156,
      lat: 55.7522,
    },
    weather: [
      {
        icon: "04d",
      },
    ],
    main: {
      temp: 2,
    },
    id: 524901,
    name: "Moscow",
    cod: 200,
  },
  "Saint Petersburg": {
    coord: {
      lat: 59.8944,
      lon: 30.2642,
    },
    weather: [
      {
        icon: "04n",
      },
    ],
    main: {
      temp: 1,
    },
    id: 498817,
    name: "Saint Petersburg",
    cod: 200,
  },
  Error_city: {
    cod: 404,
    message: "city not found",
  },
};

const ipInfo = {
  region: "Moscow",
};

describe("Weather application tests", () => {
  let el;
  let weatherMock;

  // Вспомогательные функции
  function getWeatherHtmlStrign(cityName) {
    return `<h1>${weather[cityName].name}</h1><h2>Temperature: ${weather[cityName].main.temp} C</h2><img src="http://openweathermap.org/img/wn/${weather[cityName].weather[0].icon}@2x.png" alt="Couldn't load icon of weather">`;
  }

  function specifyCityName(cityName) {
    if (cityName in weather) weatherMock.mockReturnValueOnce(weather[cityName]);
    const input = el.querySelector("#userInput");
    input.value = cityName;
  }

  function submit() {
    el.querySelector("#weatherForm").dispatchEvent(new Event("submit"));
  }

  function getAllHistoryParagraphs() {
    return [...el.querySelector("#history").querySelectorAll("p")].map(
      (element) => element.innerHTML,
    );
  }

  function historyCityNameClick(cityName) {
    if (cityName in weather) weatherMock.mockReturnValueOnce(weather[cityName]);
    [...el.querySelector("#history").querySelectorAll("p")]
      .find((element) => element.innerHTML.trim() === cityName)
      .click();
  }

  beforeEach(() => {
    // Моки
    weatherMock = jest
      .spyOn(mainModule, "getWeather")
      .mockReturnValue(weather.Moscow);
    jest
      .spyOn(mainModule, "getMap")
      .mockReturnValue(
        new Blob([fs.readFileSync("./src/assets/test_blob_map.png")]),
      );
    jest.spyOn(mainModule, "getInfoByIP").mockReturnValue(ipInfo);
    global.URL.createObjectURL = jest.fn(
      () => "blob:http://localhost:8080/dbdb41a6-c771-4692-bdc1-594a6dd28ef5",
    );
    jest.spyOn(window, "alert").mockImplementation(() => {});

    el = document.createElement("div");
    mainModule.weatherApp(el);
  });

  it("User see map on startup", () => {
    const map = el.querySelector("#map");
    expect(map).not.toBe(null);
    expect(map.alt).toBe("Couldn't get image of map");
    expect(map.src).toBe(
      "blob:http://localhost:8080/dbdb41a6-c771-4692-bdc1-594a6dd28ef5",
    );
  });

  it("User see temperature on startup", () => {
    expect(el.querySelector("#info").innerHTML).toBe(
      getWeatherHtmlStrign("Moscow"),
    );
  });

  it("User could specify city name", async () => {
    specifyCityName("Saint Petersburg");
    submit();

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(el.querySelector("#info").innerHTML).toBe(
      getWeatherHtmlStrign("Saint Petersburg"),
    );
  });

  it("Specified cities added to History block", async () => {
    for (let i = 1; i <= 3; i += 1) {
      specifyCityName(`City_${i}`);
      submit();
    }

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(getAllHistoryParagraphs()).toStrictEqual([
      "City_3",
      "City_2",
      "City_1",
    ]);
  });

  it("History block contains only 10 last cities", async () => {
    const citiyNames = [];
    for (let i = 1; i <= 10; i += 1) {
      specifyCityName(`City_${i}`);
      citiyNames.unshift(`City_${i}`);
      submit();
    }

    // Ещё дополнительные города
    specifyCityName(`City_NEW`);
    citiyNames.unshift(`City_NEW`);
    submit();

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(getAllHistoryParagraphs()).toStrictEqual(citiyNames.slice(0, 10));
  });

  it("Show alert if any errors occured", async () => {
    specifyCityName("Error_city");
    submit();

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(window.alert).toBeCalledWith(weather.Error_city.message);
  });

  it("Click on city name in history block show it's weather", async () => {
    specifyCityName("Saint Petersburg");
    submit();

    specifyCityName("Moscow");
    submit();

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(el.querySelector("#info").innerHTML).toBe(
      getWeatherHtmlStrign("Moscow"),
    );

    historyCityNameClick("Saint Petersburg");

    await new Promise(process.nextTick);

    expect(el.querySelector("#info").innerHTML).toBe(
      getWeatherHtmlStrign("Saint Petersburg"),
    );
  });

  it("History block have only one distinct city names", async () => {
    for (let i = 0; i < 5; i += 1) {
      specifyCityName(`DefaultCity`);
      submit();
    }

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(getAllHistoryParagraphs()).toStrictEqual(["DefaultCity"]);
  });
});

describe("Fetch functions tests", () => {
  it("Test getWeather function", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(weather["Saint Petersburg"]),
      }),
    );

    const result = await mainModule.getWeather("DefaultCity");
    expect(result).toBe(weather["Saint Petersburg"]);
  });

  it("Test get ipInfo function", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(ipInfo),
      }),
    );

    const result = await mainModule.getInfoByIP();
    expect(result).toBe(ipInfo);
  });

  it("Test getMap function", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () =>
          Promise.resolve(
            new Blob([fs.readFileSync("./src/assets/test_blob_map.png")]),
          ),
      }),
    );

    const result = await mainModule.getMap(weather.Moscow.coord);
    expect(result).toStrictEqual(
      new Blob([fs.readFileSync("./src/assets/test_blob_map.png")]),
    );
  });
});
