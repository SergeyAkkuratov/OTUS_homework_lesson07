import Weather from "./WeatherApp";
import { getWeatherStore } from "./WeatherRedux/Store";
import "./style.css";

const rootElement = document.querySelector(".main")! as HTMLElement;
const weather = new Weather(getWeatherStore(), rootElement);
weather.init();
