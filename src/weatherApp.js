/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint no-param-reassign: ["error", { "props": false }] */
// eslint-disable-next-line import/no-self-import
import oopsImg from "./assets/oops.png";
import { getInfoByIP, getMap, getWeather } from "./externalRequests";
import { getHistoryList, setHistorySet } from "./localStorage";

export default async function weatherApp(element) {
  const maxHistorylines = 10;
  const historyList = [];

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
    updateHistoryBlock(event.target.innerHTML);
  }

  function createHistoryParagraph(cityName) {
    const p = document.createElement("p");
    p.id = cityName;
    p.innerHTML = cityName;
    p.addEventListener("click", onclickHistoryLine);
    return p;
  }

  async function updateHistoryBlock(cityName) {
    const historyElement = element.querySelector("#history");
    if (historyList.includes(cityName)) {
      historyList.splice(historyList.indexOf(cityName), 1);
      historyList.unshift(cityName);

      const p = historyElement.querySelector(`[id='${cityName}']`);

      historyElement.removeChild(p);
      historyElement.querySelector("span").insertAdjacentElement("afterend", p);
    } else {
      historyList.unshift(cityName);
      const p = createHistoryParagraph(cityName);

      historyElement.querySelector("span").insertAdjacentElement("afterend", p);

      if (historyList.length > maxHistorylines) {
        historyList.pop();
        historyElement.removeChild(historyElement.lastElementChild);
      }
    }
    setHistorySet(historyList);
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
  const localHistoryList = getHistoryList();
  if (localHistoryList.length > 0) {
    localHistoryList
      .reverse()
      .forEach((cityName) => updateHistoryBlock(cityName));
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
