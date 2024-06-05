/* eslint-disable dot-notation */
import fs from "fs";
import Weather from "./WeatherApp";
import * as externalRequests from "./externalRequests";
import { IWeatherData } from "./WeatherRedux/Types";

describe("Weather class cehcks", () => {
    let weather: Weather;
    let rootElement: HTMLDivElement;

    const testWeather: IWeatherData = {
        mapData: new Blob([fs.readFileSync("./src/images/oops.png")]),
        icon: "04d",
        temp: 20.3,
        name: "Moscow",
    };

    beforeEach(() => {
        rootElement = document.createElement("div");
        weather = new Weather(rootElement);
    });

    it("should create correct object of class Weather", () => {
        expect(weather).toBeInstanceOf(Weather);

        expect(weather["rootElement"]).toBe(rootElement);
        expect(rootElement.innerHTML).toBe(weather["mainTemplate"]);
        expect(weather["cityNameField"]).toBeInstanceOf(HTMLInputElement);
        expect(weather["cityNameForm"]).toBeInstanceOf(HTMLFormElement);
        expect(weather["loader"]).toBeInstanceOf(HTMLSpanElement);
        expect(weather["weatherBlock"]).toBeInstanceOf(HTMLDivElement);
        expect(weather["cityMap"]).toBeInstanceOf(HTMLImageElement);
        expect(weather["historyBlock"]).toBeInstanceOf(HTMLDivElement);
    });

    it("should do correct initialisation", () => {
        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.resolve(testWeather));

        weather.init();

        expect(weather["historyBlock"].innerHTML).toContain("<p>Moscow</p>");
    });
});
