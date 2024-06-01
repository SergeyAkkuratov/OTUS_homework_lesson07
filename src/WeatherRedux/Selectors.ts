import { IWeatherData, WeatherState } from "./Types";

export function selectCityData(state: WeatherState): IWeatherData {
    return state.city!;
}

export function selectLastError(state: WeatherState): Error {
    return state.errors.at(-1)!;
}
