/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-import-assign */
import weatherApp from "./weatherApp";
import exteranlApi from "./externalRequests";
import { weather, ipInfo, testBlob } from "./commonTestData";
import { aboutTemplate, mainTemplate } from "./pageTempaltes";

jest.mock("./externalRequests", () => ({
  getWeather: jest.fn(),
  getMap: jest.fn(),
  getInfoByIP: jest.fn(),
}));

const maxHistorylines = 10;

describe("Weather application tests", () => {
  let el;

  // Вспомогательные функции
  function getWeatherHtmlStrign(cityName) {
    return `<h1>${weather[cityName].name}</h1><h2>Temperature: ${weather[cityName].main.temp} C</h2><img src="http://openweathermap.org/img/wn/${weather[cityName].weather[0].icon}@2x.png" alt="Couldn't load icon of weather">`;
  }

  function specifyCityName(cityName) {
    if (cityName in weather)
      exteranlApi.getWeather.mockReturnValueOnce(weather[cityName]);
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
    if (cityName in weather)
      exteranlApi.getWeather.mockReturnValueOnce(weather[cityName]);
    el.querySelector("#history").querySelector(`[id='${cityName}']`).click();
  }

  beforeEach(() => {
    localStorage.clear();
    // Моки
    exteranlApi.getWeather.mockReturnValue(weather.Moscow);
    exteranlApi.getInfoByIP.mockReturnValue(ipInfo);
    exteranlApi.getMap.mockReturnValue(testBlob);
    global.URL.createObjectURL = jest.fn(
      () => "blob:http://localhost:8080/dbdb41a6-c771-4692-bdc1-594a6dd28ef5",
    );
    jest.spyOn(window, "alert").mockImplementation(() => {});

    // запуск основной функции
    el = document.createElement("div");
    weatherApp(el);
  });

  it("User see map on startup", () => {
    const map = el.querySelector("#map");
    expect(map).not.toBe(null);
    expect(map.alt).toBe("Couldn't get image of map");
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
      "Moscow",
    ]);
  });

  it("History block contains only 10 last cities", async () => {
    const citiyNames = [];
    for (let i = 1; i <= maxHistorylines; i += 1) {
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

    expect(getAllHistoryParagraphs()).toStrictEqual(
      citiyNames.slice(0, maxHistorylines),
    );
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

  it("History block have only distinct city names", async () => {
    for (let i = 0; i < 5; i += 1) {
      specifyCityName(`DefaultCity`);
      submit();
    }

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(getAllHistoryParagraphs()).toStrictEqual(["DefaultCity", "Moscow"]);
  });

  it("History loads from localStorage", async () => {
    specifyCityName(`Moscow`);
    submit();

    weatherApp(el);

    // Надо подождать, когда все асинк функции закончатся, а потом продолжать выполнять синхронный код
    await new Promise(process.nextTick);

    expect(getAllHistoryParagraphs()).toStrictEqual(["Moscow"]);
  });

  it("Shoould open about and main pages when click on link", () => {
    el.querySelector("a").click();
    expect(el.innerHTML).toBe(aboutTemplate);

    el.querySelector("a").click();
    expect(el.innerHTML).toBe(mainTemplate);
  });
});
