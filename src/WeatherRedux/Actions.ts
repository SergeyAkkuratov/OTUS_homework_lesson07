import { Action } from "@reduxjs/toolkit";
import { IWeatherData } from "./Types";

export enum ActionTypes {
    LOADING = "LOADING",
    ERROR = "ERROR",
    GET_WEATHER = "GET_WEATHER",
}

export interface WeatherAction extends Action {
    type: ActionTypes;
    payload?: unknown;
}

export function loadingAction(): WeatherAction {
    return {
        type: ActionTypes.LOADING,
    };
}

export function errorAction(error: Error): WeatherAction {
    return {
        type: ActionTypes.ERROR,
        payload: error,
    };
}

export function getWeatherAction(city: IWeatherData): WeatherAction {
    return {
        type: ActionTypes.GET_WEATHER,
        payload: city,
    };
}
