/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint no-param-reassign: ["error", { "props": false }] */
// eslint-disable-next-line import/no-self-import
import Router from "sa-router-spa";
import oopsImg from "./assets/oops.png";
import { getInfoByIP, getMap, getWeather } from "./externalRequests";
import { getHistoryList, setHistorySet } from "./localStorage";
import { mainTemplate, aboutTemplate } from "./pageTempaltes";

export default async function weatherApp(rootElement) {
  const maxHistorylines = 10;
  const historyList = [];
  const router = new Router("history");

  function showWeather(data) {
    const weatherInfo = rootElement.querySelector("#info");
    weatherInfo.innerHTML = `<h1>${data.name}</h1>`;
    weatherInfo.innerHTML += `<h2>Temperature: ${data.main.temp} C</h2>`;
    weatherInfo.innerHTML += `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Couldn't load icon of weather">`;
  }

  function showMap(imgSource) {
    if (imgSource) {
      rootElement.querySelector("#map").src = URL.createObjectURL(imgSource);
    } else {
      rootElement.querySelector("#map").src = oopsImg;
    }
  }

  async function updateWeather(cityNameParam) {
    const cityName = decodeURIComponent(cityNameParam);
    const weather = await getWeather(cityName);
    if (weather.cod === 200) {
      await updateHistoryBlock(cityName);
      const map = await getMap(weather.coord);
      showMap(map);
      showWeather(weather);
    } else {
      alert(weather.message);
    }
  }

  function onclickHistoryLine(event) {
    router.navigate(`/weather/${event.target.innerHTML}`);
  }

  function createHistoryParagraph(cityName) {
    const p = document.createElement("p");
    p.id = cityName;
    p.innerHTML = cityName;
    p.addEventListener("click", onclickHistoryLine);
    return p;
  }

  async function updateHistoryBlock(cityName) {
    const historyElement = rootElement.querySelector("#history");

    if (historyList.includes(cityName)) {
      historyList.splice(historyList.indexOf(cityName), 1);
    }

    historyList.unshift(cityName);
    let p = historyElement.querySelector(`[id='${cityName}']`);

    if (p) {
      historyElement.removeChild(p);
      historyElement.querySelector("span").insertAdjacentElement("afterend", p);
    } else {
      p = createHistoryParagraph(cityName);
      historyElement.querySelector("span").insertAdjacentElement("afterend", p);
    }

    if (historyList.length > maxHistorylines) {
      historyList.pop();
      historyElement.removeChild(historyElement.lastElementChild);
    }
    setHistorySet(historyList);
  }

  function loadHistory() {
    const localHistoryList = getHistoryList();
    if (localHistoryList.length > 0) {
      localHistoryList
        .reverse()
        .forEach((cityName) => updateHistoryBlock(cityName));
    }
  }

  const ipInfo = await getInfoByIP();

  rootElement.innerHTML = mainTemplate;

  rootElement
    .querySelector("#weatherForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      // читаем значение из формы
      const formElement = event.target;
      const inputEl = formElement.querySelector("#userInput");
      const cityName = inputEl.value;
      inputEl.value = "";
      router.navigate(`/weather/${cityName}`);
    });

  rootElement.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      event.preventDefault();
      // eslint-disable-next-line no-undef
      router.navigate(PREFIX + event.target.href);
    }
  });

  router.addRoute({
    path: /^\/weather\/(?<cityName>.+)$/,
    onEnter: async (params) => {
      updateWeather(params.cityName);
    },
  });

  router.addRoute({
    path: "/about",
    onEnter: () => {
      rootElement.innerHTML = aboutTemplate;
    },
  });

  router.addRoute({
    path: "/",
    onEnter: () => {
      rootElement.innerHTML = mainTemplate;
      loadHistory();
    },
  });

  loadHistory();
  if (ipInfo.city) router.navigate(`/weather/${ipInfo.city}`);
}
