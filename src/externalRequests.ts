import { IWeatherData } from "./WeatherRedux/Types";

export async function getWeatherExternal(cityName: string): Promise<IWeatherData> {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=862e72718d993f06e2ca165446011711`)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.cod === 200) {
                return {
                    ...data.coord,
                    icon: data.weather[0].icon,
                    temp: data.main.temp,
                    name: cityName,
                };
            }
            throw Error(`Во время получения информации вожникла ошибка:\n${data.message}`);
        });
}

export function getCityName(): Promise<string> {
    return fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=763242ab3637495ba08023d1154aa96a`)
        .then((response) => response.json())
        .then((data) => data.city);
}
