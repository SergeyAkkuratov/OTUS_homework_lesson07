/* eslint-disable dot-notation */
import { EnhancedStore, StoreEnhancer, ThunkDispatch, Tuple, UnknownAction, Unsubscribe } from "@reduxjs/toolkit";
import Weather from "./WeatherApp";
import * as externalRequests from "./externalRequests";
import { AppStatus, IWeatherData, WeatherState } from "./WeatherRedux/Types";
import { getWeatherStore } from "./WeatherRedux/Store";
import { WeatherAction } from "./WeatherRedux/Actions";

describe("Weather class cehcks", () => {
    let weather: Weather;
    let rootElement: HTMLDivElement;

    const testWeather: IWeatherData = {
        lat: 55.7522,
        lon: 37.6156,
        icon: "04d",
        temp: 20.3,
        name: "Moscow",
    };

    function weatherIsLoaded(
        store: EnhancedStore<
            WeatherState,
            WeatherAction,
            Tuple<[StoreEnhancer<{ dispatch: ThunkDispatch<WeatherState, undefined, UnknownAction> }>, StoreEnhancer]>
        >
    ) {
        return new Promise<void>((resolve) => {
            let unsubscribe: Unsubscribe;
            const isLoaded = () => {
                if (store.getState()?.status === AppStatus.READY) {
                    resolve();
                    unsubscribe?.();
                }
            };
            unsubscribe = store.subscribe(isLoaded);
            isLoaded();
        });
    }

    beforeEach(() => {
        rootElement = document.createElement("div");
        weather = new Weather(getWeatherStore(), rootElement);
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

    it("should do correct initialisation", async () => {
        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.resolve(testWeather));
        jest.spyOn(externalRequests, "getCityName").mockReturnValueOnce(Promise.resolve(testWeather.name));

        weather.init();

        await weatherIsLoaded(weather["store"]);

        expect(weather["historyBlock"].innerHTML).toContain("Moscow");
    });
});
