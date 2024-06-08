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

    const weatherMoscow: IWeatherData = {
        lat: 55.7522,
        lon: 37.6156,
        icon: "04d",
        temp: 20.3,
        name: "Moscow",
    };

    const weatherSPB: IWeatherData = {
        lat: 30,
        lon: 20,
        icon: "06c",
        temp: 10,
        name: "SPB",
    };

    function weatherIsLoaded(
        store: EnhancedStore<
            WeatherState,
            WeatherAction,
            Tuple<[StoreEnhancer<{ dispatch: ThunkDispatch<WeatherState, undefined, UnknownAction> }>, StoreEnhancer]>
        >,
        status: AppStatus
    ) {
        return new Promise<void>((resolve) => {
            let unsubscribe: Unsubscribe;
            const isLoaded = () => {
                if (store.getState()?.status === status) {
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
        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.resolve(weatherMoscow));
        jest.spyOn(externalRequests, "getCityName").mockReturnValueOnce(Promise.resolve(weatherMoscow.name));
        for(let i=1; i<11;i+=1){
            weather["historyList"].push(`City${i}`);
        }
        weather.init();

        await weatherIsLoaded(weather["store"], AppStatus.READY);

        expect(weather["historyBlock"].innerHTML).toContain("Moscow");
        expect(weather["historyBlock"].innerHTML).toContain("City1");
        expect(weather["historyBlock"].innerHTML).toContain("City2");
        expect(weather["historyBlock"].innerHTML).toContain("City3");
        expect(weather["historyBlock"].innerHTML).not.toContain("City10");
    });

    it("should show weather on submit", async () => {
        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.resolve(weatherMoscow));
        jest.spyOn(externalRequests, "getCityName").mockReturnValueOnce(Promise.resolve(weatherMoscow.name));
        weather.init();
        
        await weatherIsLoaded(weather["store"], AppStatus.READY);

        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.resolve(weatherSPB));
        
        weather["cityNameField"].value = "SPB";
        weather["cityNameForm"].dispatchEvent(new Event("submit"));

        await weatherIsLoaded(weather["store"], AppStatus.LOADING);
        await weatherIsLoaded(weather["store"], AppStatus.READY);

        expect(weather["historyBlock"].innerHTML).toContain("Moscow");
        expect(weather["historyBlock"].innerHTML).toContain("SPB");
        expect(weather["cityNameField"].value).toContain("");
    });

    it("should correct show errors", async () => {
        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.reject(Error("TEST ERROR")));
        jest.spyOn(externalRequests, "getCityName").mockReturnValueOnce(Promise.resolve(weatherMoscow.name));
        jest.spyOn(window, 'alert').mockImplementation(() => {});

        weather.init();

        await weatherIsLoaded(weather["store"], AppStatus.ERROR);

        expect(window.alert).toHaveBeenCalledWith("TEST ERROR");
    });

    it("should last city on top", async () => {
        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.resolve(weatherMoscow));
        jest.spyOn(externalRequests, "getCityName").mockReturnValueOnce(Promise.resolve(weatherMoscow.name));
        weather.init();
        
        await weatherIsLoaded(weather["store"], AppStatus.READY);

        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.resolve(weatherSPB));
        
        weather["cityNameField"].value = "SPB";
        weather["cityNameForm"].dispatchEvent(new Event("submit"));

        await weatherIsLoaded(weather["store"], AppStatus.LOADING);
        await weatherIsLoaded(weather["store"], AppStatus.READY);

        jest.spyOn(externalRequests, "getWeatherExternal").mockReturnValueOnce(Promise.resolve(weatherMoscow));

        weather["historyBlock"].querySelector("p")?.dispatchEvent(new Event("click"));

        await weatherIsLoaded(weather["store"], AppStatus.LOADING);
        await weatherIsLoaded(weather["store"], AppStatus.READY);

        expect(weather["historyBlock"].innerHTML.trim()).toBe("<span>History:</span><p id=\"Moscow\">Moscow</p><p id=\"SPB\">SPB</p>");
    });
});
