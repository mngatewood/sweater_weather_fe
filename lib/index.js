import css from "./styles.css";

$(".location-search-input").keyup(enableLocationSearchSubmit)

function enableLocationSearchSubmit() {
  if ($(".location-search-input").val()) {
    $(".location-search-submit").prop("disabled", false);
    $(".location-search-submit").click(searchLocation)
  } else {
    $(".location-search-submit").prop("disabled", true);
    $(".location-search-submit").off("click");
  }
}

function searchLocation() {
  event.preventDefault();
  let location = $(".location-search-input").val();
  fetchWeather(location);
}

// refactor and move to fetch.js

function fetchWeather(location) {
  var params = location.replace(/\s/g, '')
  let url = `https://mngatewood-weather-be.herokuapp.com/api/v1/forecast?location=${params}`
  let request = new XMLHttpRequest();

  request.open("GET", url, false);
  request.onload = function () {
    let response = JSON.parse(request.responseText).data;
    let data = apiCleaner(response);
    renderWeather(data);
  }
  request.send();
}

// move to render.js

function renderWeather(data) {
  $("#landing-page-container").hide();  
  renderCurrentConditions(data);
  renderLocationAndDateTime(data);
}

function renderCurrentConditions(data) {
  let current = data.attributes.current

  $("#app-container").append(
    `<section id="current-conditions-container">
      <h3 class="current-overview">${current.summary}</h3>
      <div id="current-temp-container">
        <h2 class="current-temp">${current.temperature}&deg;</h2>
      </div>
      <h3 class="feels-like">Feels like ${current.apparentTemperature}&deg;</h3>
    </section>`)
}

function renderLocationAndDateTime(data) {
  let attributes = data.attributes

  $("#app-container").append(
    `<section id="location-date-container">
      <div id="location-container">
        <h2 class="city">${attributes.city}</h2>
        <h3 class="state-country">${attributes.state}, ${attributes.country}</h3>
      </div>
      <div id="date-time-container">
        <h3 class="date">${attributes.current.date}</h3>
        <h3 class="time">${attributes.current.time}</h3>
      </div>
    </section>`)
}

// move to apiHelper.js

function apiCleaner(data) {
  let current = data.attributes.current
  current.date = convertUnixTime(current.time).date
  current.time = convertUnixTime(current.time).time
  current.temperature = Math.round(current.temperature)
  current.apparentTemperature = Math.round(current.apparentTemperature)
  return data
}

function convertUnixTime(time) {
  let date = new Date(time * 1000);
  let month = date.toLocaleString('en-us', { month: 'long' });  
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  return {
    date: month + " " + date.getDate() + ", " + date.getFullYear(), 
    time: convert24HourTime(hours, minutes.substr(-2)) }
}

function convert24HourTime(hours, minutes) {
  if(hours > 12) {
    return (hours - 12) + ":" + minutes + "PM"
  } else {
    return hours + ":" + minutes + "AM"
  }
}
