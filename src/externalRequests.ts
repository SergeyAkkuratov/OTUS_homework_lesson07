import { IWeatherData } from "./WeatherRedux/Types";

export function getMap(lon: number, lat: number): Promise<Blob> {
    return fetch(`https://static-maps.yandex.ru/v1?ll=${lon},${lat}&size=300,300&z=8&apikey=21ae407c-6788-4393-bbfa-d1cf463287b0`).then((response) =>
        response.blob()
    );
}

export async function getWeatherExternal(cityName: string): Promise<IWeatherData> {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=862e72718d993f06e2ca165446011711`)
        .then((response) => response.json())
        .then(async (data) => {
            if (data.cod === 200) {
                return {
                    mapData: await getMap(data.coord.lon, data.coord.lat),
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
