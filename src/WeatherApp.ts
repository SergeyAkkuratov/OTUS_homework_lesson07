import oopsImg from "./images/oops.png";
import { selectCityData, selectLastError } from "./WeatherRedux/Selectors";
import { getWeather, weatherStore } from "./WeatherRedux/Store";
import { AppStatus } from "./WeatherRedux/Types";

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

    private readonly rootElement: HTMLElement;

    private readonly historyList: string[] = [];

    private readonly cityNameField: HTMLInputElement;

    private readonly cityNameForm: HTMLFormElement;

    private readonly weatherBlock: HTMLDivElement;

    private readonly historyBlock: HTMLDivElement;

    private readonly cityMap: HTMLImageElement;

    private readonly loader: HTMLSpanElement;

    constructor(rootElement: HTMLElement) {
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
        weatherStore.subscribe(this.render.bind(this));

        // subscribe for submit event
        this.cityNameForm.addEventListener("submit", (event) => {
            event.preventDefault();
            weatherStore.dispatch(getWeather(this.cityNameField.value));
            this.cityNameField.value = "";
        });

        // loading history
        this.historyList.concat(localStorage.getItem("history")?.split(";") ?? []);
        this.historyList.reverse().forEach((cityName) => this.updateHistoryBlock(cityName));

        // get weather by IP
        weatherStore.dispatch(getWeather());
    }

    private async render(): Promise<void> {
        const state = weatherStore.getState();
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
                    this.cityMap.src = weather.mapData ? URL.createObjectURL(weather.mapData) : oopsImg;
                    this.weatherBlock.innerHTML = `
                        <h1>${weather.name}</h1>
                        <h2>Temperature: ${weather.temp} C</h2>
                        <img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="Couldn't load icon of weather">
                    `;
                } else {
                    this.showErrorMessage("Непрдивиденная ошибка - нет данных о городе!");
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
            newHistoryLine.addEventListener("click", () => weatherStore.dispatch(getWeather(cityName)));
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
