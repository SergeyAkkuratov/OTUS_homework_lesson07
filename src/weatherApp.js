/* eslint-disable no-alert */
/* eslint no-param-reassign: ["error", { "props": false }] */
// eslint-disable-next-line import/no-self-import
import * as mainModule from "./weatherApp";
import oopsImg from "./assets/oops.png";

export async function getWeather(cityName) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=862e72718d993f06e2ca165446011711`,
  );
  return response.json();
}

export async function getMap(coord) {
  const response = await fetch(
    `https://static-maps.yandex.ru/v1?ll=${coord.lon},${coord.lat}&size=300,300&z=8&apikey=21ae407c-6788-4393-bbfa-d1cf463287b0`,
  );
  return response.blob();
}

export async function getInfoByIP() {
  const response = await fetch(
    `https://ipgeolocation.abstractapi.com/v1/?api_key=763242ab3637495ba08023d1154aa96a`,
  );
  return response.json();
}

export async function weatherApp(element) {
  const maxHistorylines = 10;
  const historyList = new Set();

  function showWeather(data) {
    const weatherInfo = element.querySelector("#info");
    weatherInfo.innerHTML = `<h1>${data.name}</h1>`;
    weatherInfo.innerHTML += `<h2>Temperature: ${data.main.temp} C</h2>`;
    weatherInfo.innerHTML += `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Couldn't load icon of weather">`;
  }

  function showMap(imgSource) {
    element.querySelector("#map").src = URL.createObjectURL(imgSource);
  }

  async function updateWeather(cityName, updateHistoryFlag) {
    const weather = await mainModule.getWeather(cityName);
    if (weather.cod === 200) {
      // eslint-disable-next-line no-use-before-define
      if (updateHistoryFlag) await updateHistoryBlock(cityName);
      const map = await mainModule.getMap(weather.coord);
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
    const historyElement = element.querySelector("#history");
    if (!historyList.has(cityName)) {
      historyList.add(cityName);
      const p = document.createElement("p");
      p.innerHTML = cityName;
      p.addEventListener("click", onclickHistoryLine);
      historyElement.querySelector("span").insertAdjacentElement("afterend", p);

      if (historyElement.querySelectorAll("p").length > maxHistorylines) {
        historyList.delete(historyElement.lastElementChild.innerHTML);
        historyElement.removeChild(historyElement.lastElementChild);
      }
    }
  }

  const ipInfo = await mainModule.getInfoByIP();

  element.innerHTML = `
  <div class="info-block">
    <form id="weatherForm" class="form-block">
        <input id="userInput" placeholder="Type city and press enter" required autofocus>
        <button id="bGetWeather">Get weather</button>
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

  updateWeather(ipInfo.region);

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
