export enum AppStatus {
    READY,
    LOADING,
    ERROR,
}

export interface IWeatherData {
    mapData?: Blob;
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
