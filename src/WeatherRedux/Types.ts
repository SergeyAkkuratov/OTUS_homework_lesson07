export enum AppStatus {
    READY = "READY",
    LOADING = "LOADING",
    ERROR = "ERROR",
}

export interface IWeatherData {
    lat: number;
    lon: number;
    icon: string;
    temp: number;
    name: string;
}

export interface WeatherState {
    city?: IWeatherData;
    status: AppStatus;
    errors: Error[];
}

export const initialState: WeatherState = {
    city: undefined,
    status: AppStatus.READY,
    errors: [],
};
