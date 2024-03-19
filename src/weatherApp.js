/* eslint-disable no-alert */
/* eslint no-param-reassign: ["error", { "props": false }] */
// eslint-disable-next-line import/no-self-import
import oopsImg from "./assets/oops.png";
import { getInfoByIP, getMap, getWeather } from "./externalRequests";
import { getHistorySet, setHistorySet } from "./localStorage";

export default async function weatherApp(element) {
  const maxHistorylines = 10;
  const historySet = new Set();

  function showWeather(data) {
    const weatherInfo = element.querySelector("#info");
    weatherInfo.innerHTML = `<h1>${data.name}</h1>`;
    weatherInfo.innerHTML += `<h2>Temperature: ${data.main.temp} C</h2>`;
    weatherInfo.innerHTML += `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Couldn't load icon of weather">`;
  }

  function showMap(imgSource) {
    if (imgSource) {
      element.querySelector("#map").src = URL.createObjectURL(imgSource);
    } else {
      element.querySelector("#map").src = oopsImg;
    }
  }

  async function updateWeather(cityName, updateHistoryFlag) {
    const weather = await getWeather(cityName);
    if (weather.cod === 200) {
      // eslint-disable-next-line no-use-before-define
      if (updateHistoryFlag) await updateHistoryBlock(cityName);
      const map = await getMap(weather.coord);
      showMap(map);
      showWeather(weather);
    } else {
      alert(weather.message);
    }
  }

  function onclickHistoryLine(event) {
    updateWeather(event.target.innerHTML, false);
  }

  async function updateHistoryBlock(cityName) {
    if (!historySet.has(cityName)) {
      const historyElement = element.querySelector("#history");
      historySet.add(cityName);
      const p = document.createElement("p");
      p.innerHTML = cityName;
      p.addEventListener("click", onclickHistoryLine);
      historyElement.querySelector("span").insertAdjacentElement("afterend", p);

      if (historyElement.querySelectorAll("p").length > maxHistorylines) {
        historySet.delete(historyElement.lastElementChild.innerHTML);
        historyElement.removeChild(historyElement.lastElementChild);
      }

      setHistorySet(historySet);
    }
  }

  const ipInfo = await getInfoByIP();

  element.innerHTML = `
  <div class="info-block">
    <form id="weatherForm" class="form-block">
        <input id="userInput" class="form-input" placeholder="Type city and press enter" required autofocus>
    </form>
    <div id="weather">
        <img id="map"
            src="${oopsImg}"
            alt="Couldn't get image of map"></img>
    </div>
    <div id="info">
      <span>Wait for city name</span>
    </div>
  </div>
  <div id="history" class="history-block">
    <span>History:</span>
  </div>`;
  if (getHistorySet().size > 0) {
    getHistorySet().forEach((cityName) => updateHistoryBlock(cityName));
  }
  if (ipInfo.region) updateWeather(ipInfo.region);

  element
    .querySelector("#weatherForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      // читаем значение из формы
      const formElement = event.target;
      const inputEl = formElement.querySelector("#userInput");
      const cityName = inputEl.value;
      inputEl.value = "";
      updateWeather(cityName, true);
    });
}
