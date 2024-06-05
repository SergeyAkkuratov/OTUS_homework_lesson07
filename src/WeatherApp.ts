import { EnhancedStore, StoreEnhancer, ThunkDispatch, Tuple, UnknownAction } from "@reduxjs/toolkit";
import oopsImg from "./images/oops.png";
import { selectCityData, selectLastError } from "./WeatherRedux/Selectors";
import { getWeather } from "./WeatherRedux/Store";
import { AppStatus, WeatherState } from "./WeatherRedux/Types";
import { WeatherAction } from "./WeatherRedux/Actions";

export default class Weather {
    private readonly mainTemplate: string = `
        <div class="info-block">
            <form id="weatherForm" class="city-name-form">
                <input class="city-name-input" placeholder="Type city and press enter" required="" autofocus="">
            </form>
            <div id="map">
                <img id="cityMap" src="${oopsImg}" alt="Couldn't get image of map">
            </div>
            <div id="info">
                <span>Wait for city name</span>
            </div>
        </div>
        <div id="history" class="history-block">
            <span>History:</span>
        </div>
        <span class="loader"></span>
    `;

    private readonly maxHistorylines: number = 10;

    private readonly store: EnhancedStore<
        WeatherState,
        WeatherAction,
        Tuple<
            [
                StoreEnhancer<{
                    dispatch: ThunkDispatch<WeatherState, undefined, UnknownAction>;
                }>,
                StoreEnhancer,
            ]
        >
    >;

    private readonly rootElement: HTMLElement;

    private readonly historyList: string[] = [];

    private readonly cityNameField: HTMLInputElement;

    private readonly cityNameForm: HTMLFormElement;

    private readonly weatherBlock: HTMLDivElement;

    private readonly historyBlock: HTMLDivElement;

    private readonly cityMap: HTMLImageElement;

    private readonly loader: HTMLSpanElement;

    constructor(store: EnhancedStore<WeatherState, WeatherAction>, rootElement: HTMLElement) {
        this.store = store;
        this.rootElement = rootElement;
        this.rootElement.innerHTML = this.mainTemplate;

        this.cityNameField = this.rootElement.querySelector(".city-name-input")!;
        this.cityNameForm = this.rootElement.querySelector(".city-name-form")!;
        this.loader = this.rootElement.querySelector(".loader")!;
        this.weatherBlock = this.rootElement.querySelector("#info")!;
        this.cityMap = this.rootElement.querySelector("#cityMap")!;
        this.historyBlock = this.rootElement.querySelector("#history")!;
    }

    init(): void {
        // subscribe for redux state
        this.store.subscribe(this.render.bind(this));

        // subscribe for submit event
        this.cityNameForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.store.dispatch(getWeather(this.cityNameField.value));
            this.cityNameField.value = "";
        });

        // loading history
        this.historyList.concat(localStorage.getItem("history")?.split(";") ?? []);
        this.historyList.reverse().forEach((cityName) => this.updateHistoryBlock(cityName));

        // get weather by IP
        this.store.dispatch(getWeather());
    }

    private async render(): Promise<void> {
        const state = this.store.getState();
        switch (state.status) {
            case AppStatus.ERROR: {
                this.loader.style.display = "none";
                this.showErrorMessage(selectLastError(state).message);
                break;
            }
            case AppStatus.LOADING: {
                this.loader.style.display = "table";
                break;
            }
            case AppStatus.READY: {
                this.loader.style.display = "none";
                const weather = selectCityData(state);
                if (weather) {
                    await this.updateHistoryBlock(weather.name);
                    this.cityMap.src = `https://static-maps.yandex.ru/v1?ll=${weather.lon},${weather.lat}&size=300,300&z=8&apikey=21ae407c-6788-4393-bbfa-d1cf463287b0`;
                    this.weatherBlock.innerHTML = `
                        <h1>${weather.name}</h1>
                        <h2>Temperature: ${weather.temp} C</h2>
                        <img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="Couldn't load icon of weather">
                    `;
                } else {
                    this.showErrorMessage("Непрдивиденная ошибка - нет данных с городе!");
                }
                break;
            }
            default:
                break;
        }
    }

    private async updateHistoryBlock(cityName: string): Promise<void> {
        if (this.historyList.includes(cityName)) {
            this.historyList.splice(this.historyList.indexOf(cityName), 1);
        }

        this.historyList.unshift(cityName);
        const p = this.historyBlock.querySelector(`[id='${cityName}']`);

        if (p) {
            this.historyBlock.removeChild(p);
            this.historyBlock.querySelector("span")!.insertAdjacentElement("afterend", p);
        } else {
            const newHistoryLine = document.createElement("p");
            newHistoryLine.id = cityName;
            newHistoryLine.innerHTML = cityName;
            newHistoryLine.addEventListener("click", () => this.store.dispatch(getWeather(cityName)));
            this.historyBlock.querySelector("span")!.insertAdjacentElement("afterend", newHistoryLine);
        }

        if (this.historyList.length > this.maxHistorylines) {
            this.historyList.pop();
            this.historyBlock.removeChild(this.historyBlock.lastElementChild!);
        }
        localStorage.setItem("history", this.historyList.join(";"));
    }

    // eslint-disable-next-line class-methods-use-this
    private showErrorMessage(message: string) {
        // eslint-disable-next-line no-alert
        alert(message);
    }
}
