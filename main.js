// ? ================> Global ================>
const apiKey = `key=5f4e6eddec0147a7bac161502241707`;
const baseUrl = `https://api.weatherapi.com/v1/forecast.json`;
const searchLocation = document.querySelector("#findLocation");
const btn = document.querySelector(".findBtn");
const dataContainer = document.querySelector(".weatherCards");

// ! ================> When Start ================>
navigator.geolocation.getCurrentPosition(CurrentLocation);

// * ================> Events  ================>
//events

btn.addEventListener("click", () => {
  getWeather(searchLocation.value);
});
searchLocation.addEventListener("change", () => {
  getWeather(searchLocation.value);
});
searchLocation.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    getWeather(searchLocation.value);
  }
});

// ! ================> Functions  ================>

//get data
async function getWeather(position) {
  try {
    dataContainer.innerHTML = `<div class="loader"></div>`;
    let response = await fetch(`${baseUrl}?${apiKey}&q=${position}&days=3`);
    let data = await response.json();
    let dataArr = data.forecast.forecastday;
    displayCurrentWeather(data, dataArr);
    displayWeatherCards(dataArr);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter a valid location or check your internet",
      color: "#545454",
    });

    searchLocation.value = "";
    dataContainer.innerHTML = "";
  }
}

//display weather Data
function displayCurrentWeather(data, dataArr) {
  document.querySelector("#location").innerHTML = data.location.country;
  document.querySelector(".todayDate").innerHTML = dataArr[0].date;

  document.querySelector(".today-weather").innerHTML = `
    <h1 class="cityName fw-bolder fs-3">${data.location.name}</h1>
    <h2 class="fw-bolder display-4 " id="weatherTemp">${data.current.temp_c}</h2>
    <p id="weatherCondition" class="fw-semibold fs-5">${data.current.condition.text}</p>
    <div class="d-flex align-items-center gap-3">
      <p>
        <img src="./images/wind.png" width="30px" alt="wind-img">
        <span id="windSpeed" class="ms-2 fw-semibold">${data.current.wind_kph}</span>
      </p>
      <p>
        <img src="./images/humidity.png" width="30px" alt="humidity">
        <span id="humidity" class="fw-semibold">${data.current.humidity}%</span>
      </p>
    </div>
  `;
}

function displayWeatherCards(dataArr) {
  let container = ``;

  for (let i in dataArr) {
    const date = new Date(dataArr[i].date);
    const weekDay = date.toLocaleDateString("en-uk", { weekday: "long" });
    container += `
      <div class="today flex-grow-1 m-2">
        <div class="innerCard bg-primary-subtle rounded-3 py-2 px-4">
          <p class="weekDay text-center fw-bolder text-black ">${weekDay}</p>
          <div class="d-flex justify-content-between">
            <div class="text-center">
              <p id="maxTemp" class="temp-type fw-bold m-1">Max Temp</p>
              <p class="">${dataArr[i].day.maxtemp_c}°</p>
            </div>
            <div class="text-center">
              <p id="avgTemp" class="temp-type fw-bold m-1">Avg Temp</p>
              <p class="">${dataArr[i].day.avgtemp_c}°</p>
            </div>
            <div class="text-center m-0 p-0">
              <p id="minTemp" class="temp-type fw-bold m-1">Min Temp</p>
              <p class="">${dataArr[i].day.mintemp_c}°</p>
            </div>
          </div>
          <p class="text-center fw-semibold text-dark-emphasis m-0 p-0">${dataArr[i].day.condition.text}</p>
          <img src="${dataArr[i].day.condition.icon}" width="50px" class="m-auto d-block" alt="">
        </div>
      </div>
    `;
  }

  dataContainer.innerHTML = container;
}

//find current location
function CurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let currentPosition = `${latitude},${longitude}`;
  getWeather(currentPosition);
}
