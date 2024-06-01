import Weather from "./WeatherApp";
import "./style.css";

const rootElement = document.querySelector(".main")! as HTMLElement;
const weather = new Weather(rootElement);
weather.init();
