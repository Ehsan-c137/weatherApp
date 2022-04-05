"use strict";

let chartJsWeek = [];
function getChartDays(data) {
   if (chartJsWeek.length > 0) {
      chartJsWeek = [];
      myChart.labels = [];
      myChart.update();
   }
   for (let i = 0; i < 7; i++) {
      let time = new Date(data.daily[i].dt * 1000).toLocaleString("en-us", {
         weekday: "short",
      });
      chartJsWeek.push(time);
   }

   myChart.update();
}

let humidityData = [];
function checkData() {
   if (humidityData.length > 0) {
      humidityData = [];
      myChart.data.datasets[0].data = [];
      myChart.update();
   }
}
function showDailyHumidity(d) {
   checkData();
   for (let i = 0; i < 7; i++) {
      humidityData.push(d.daily[i].humidity);
   }
   myChart.data.datasets[0].data = humidityData;
   myChart.update();
}

const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
   type: "bar",
   data: {
      labels: chartJsWeek,
      datasets: [
         {
            label: "humidity",
            data: [],
            backgroundColor: ["rgba(54, 162, 235, 0.2)"],
            borderColor: ["rgba(54, 162, 235, 1)"],
            borderWidth: 1,
         },
      ],
   },
   options: {
      scales: {
         y: {
            beginAtZero: true,
         },
      },
      responsive: true,
   },
});
