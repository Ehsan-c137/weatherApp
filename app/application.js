"use strict";

const searchBtn = document.querySelector(".search-btn");
const input = document.querySelector(".input");

const clock = document.querySelector(".clock");
const dayDec = document.querySelector(".weather-overall-right_dec");

const locationLabel = document.querySelector(".location");
const weatherIconLabel = document.querySelector(".weather-overall-left-img");
const temperatureLabel = document.querySelector(".temperature");
const humidityLabel = document.querySelector(".humidity-percentage");
const sunriseTimeLabel = document.querySelector(".sunrise-time");
const sunsetTimeLabel = document.querySelector(".sunset-time");

const days = [
   "Sunday",
   "Monday",
   "Tuesday",
   "Wednesday",
   "Thursday",
   "Friday",
   "Saturday",
];
function showDay() {
   const d = new Date();
   let day = days[d.getDay()];
   return day;
}

dayDec.textContent = showDay();

const apiKey = "fdf7cba70862ec4cdb5083aebdd424b7";
function fetchWeather(city) {
   fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
   )
      .then((response) => response.json())
      .then((data) => {
         displayWeather(data);
         //  console.log(data);
      });
}

searchBtn.addEventListener("click", function () {
   if (input.value) {
      fetchWeather(input.value);
   }
});
fetchWeather("london");
function displayWeather(data) {
   const { name } = data;
   const { icon, description } = data.weather[0];
   const { temp, humidity } = data.main;
   const { sunrise, sunset } = data.sys;
   const { lon, lat } = data.coord;

   locationLabel.textContent = name;
   weatherIconLabel.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
   dayDec.textContent = `${showDay()}, ${description}`;
   temperatureLabel.textContent = `${Math.trunc(temp)}°c`;
   humidityLabel.textContent = `${humidity}%`;

   getDailyData(lat, lon);
}

function getDailyData(lat, lon) {
   fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&&units=metric&appid=${apiKey}`
   )
      .then((response) => response.json())
      .then((data) => {
         showUV(data);
         showDailyHumidity(data);
         showLocalTime(data);
         showSetRiseSun(data);
         getChartDays(data);
         console.log(data);
      });
}

function showUV(d) {
   const { uvi } = d.current;
   document.querySelector(".uv-index-number").textContent = `${Math.trunc(
      uvi
   )} of 10`;
}

function showLocalTime(time) {
   const d = new Date();
   const utcOffset = d.getTimezoneOffset();
   // utc offset is in minute
   const utcTime = d.setMinutes(d.getMinutes() + utcOffset);

   const targetTimeOffset = time.timezone_offset / 60;
   d.setMinutes(d.getMinutes() + targetTimeOffset);

   let hour = d.getHours();
   let min = d.getMinutes();
   hour = hour < 10 ? "0" + hour : hour;
   min = min < 10 ? "0" + min : min;

   clock.textContent = setInterval(() => {
      clock.textContent = `${hour}:${min}`;
   }, 60000);
   clock.textContent = `${hour}:${min}`;
}

function showSetRiseSun(time) {
   const sunrise = new Date(time.daily[0].sunrise * 1000);
   const sunset = new Date(time.daily[0].sunset * 1000);
   const option = {
      timeZone: `${time.timezone}`,
      hour: "numeric",
      minute: "numeric",
   };

   sunriseTimeLabel.textContent = sunrise.toLocaleString("en-us", option);
   sunsetTimeLabel.textContent = sunset.toLocaleString("en-us", option);
}
