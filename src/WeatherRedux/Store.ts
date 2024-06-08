import { Dispatch, configureStore } from "@reduxjs/toolkit";
import { initialState } from "./Types";
import rootReducer from "./Reducer";
import { WeatherAction, errorAction, getWeatherAction, loadingAction } from "./Actions";
import { getCityName, getWeatherExternal } from "../externalRequests";

export function getWeatherStore() {
    return configureStore({
        reducer: rootReducer,
        preloadedState: initialState,
    });
}

export function getWeather(cityName?: string) {
    return async (dispatch: Dispatch<WeatherAction>) => {
        dispatch(loadingAction());
        try {
            if (cityName) {
                dispatch(getWeatherAction(await getWeatherExternal(cityName)));
            } else {
                dispatch(getWeatherAction(await getWeatherExternal(await getCityName())));
            }
        } catch (error) {
            dispatch(errorAction(error as Error));
        }
    };
}
