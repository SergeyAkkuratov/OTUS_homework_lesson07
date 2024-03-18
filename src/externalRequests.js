/* eslint no-console: ["warn", { allow: ["error"] }] */

export async function getWeather(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=862e72718d993f06e2ca165446011711`,
    );
    return response.json();
  } catch {
    return { cod: 500, message: `couldn't get weather info` };
  }
}

export async function getMap(coord) {
  try {
    const response = await fetch(
      `https://static-maps.yandex.ru/v1?ll=${coord.lon},${coord.lat}&size=300,300&z=8&apikey=21ae407c-6788-4393-bbfa-d1cf463287b0`,
    );
    return response.blob();
  } catch (error) {
    return undefined;
  }
}

export async function getInfoByIP() {
  try {
    const response = await fetch(
      `https://ipgeolocation.abstractapi.com/v1/?api_key=763242ab3637495ba08023d1154aa96a`,
    );
    return response.json();
  } catch (error) {
    return { region: undefined };
  }
}
