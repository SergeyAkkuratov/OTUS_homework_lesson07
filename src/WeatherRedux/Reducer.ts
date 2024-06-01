import { ActionTypes, WeatherAction } from "./Actions";
import { AppStatus, IWeatherData, WeatherState, initialState } from "./Types";

// eslint-disable-next-line default-param-last
export default function rootReducer(state: WeatherState = initialState, action: WeatherAction): WeatherState {
    switch (action.type) {
        case ActionTypes.LOADING:
            return { ...state, status: AppStatus.LOADING };
        case ActionTypes.ERROR: {
            const newErrors = structuredClone(state.errors);
            newErrors.push(action.payload as Error);
            return { ...state, status: AppStatus.ERROR, errors: newErrors };
        }
        case ActionTypes.GET_WEATHER:
            return { ...state, status: AppStatus.READY, city: action.payload as IWeatherData };
        default:
            return state;
    }
}
