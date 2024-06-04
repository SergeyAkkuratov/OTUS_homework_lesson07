import oopsImg from "./assets/oops.png";

export const mainTemplate = `
<div>
<div class="info-block">
  <form id="weatherForm" class="form-block">
      <input id="userInput" class="form-input" placeholder="Type city and press enter" required="" autofocus="">
  </form>
  <div id="weather">
      <img id="map" src="${oopsImg}" alt="Couldn't get image of map">
  </div>
  <div id="info">
    <span>Wait for city name</span>
  </div>
</div>
<div id="history" class="history-block">
  <span>History:</span>
</div>
</div>
<div class="bottom">
  <a href="/about">About</a>
</div>
`;

export const aboutTemplate = `
<div align="center">
<h3>Приложение "Прогноз погоды"</h3>
<p>
    Выполнение домашнего задания для лекции "Современный инструментарий при разработке клиентских (и не только
    приложений)"
</p>

<h2>О проекте</h2>
<p>Приложение "Прогноз погоды" это Web приложение разработанное на языке JavaScript. Оно предназначено для
    просмотра текущей погоды в конкретном городе.</p>
<p>Приложение показывает текущую температуру в градусах цельсия и общее состоянии погоды, обозначенное иконкой.</p>
<p>Так же приложение отображает компактную картинку с картой выбранного города.</p>
<a href="/">Main</a>
</div>
`;
