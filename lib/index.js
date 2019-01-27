import css from "./styles.css";

$(".location-search-input").keyup(enableLocationSearchSubmit)

function enableLocationSearchSubmit() {
  if ($(".location-search-input").val()) {
    $(".location-search-submit").prop("disabled", false);
    // jQuery selector causes propagation issues below, patched with vanilla JS
    // $(".location-search-submit").click(searchLocation)
    document.querySelector(".location-search-submit").addEventListener("click", searchLocation);  
  } else {
    $(".location-search-submit").prop("disabled", true);
    $(".location-search-submit").off("click");
  }
}

function searchLocation() {
  event.preventDefault();
  let location = $(".location-search-input").val();
  let data = fetchWeather(location);
}

// refactor and move to fetch.js

function fetchWeather(location) {
  let params = location.replace(/\s/g, '')
  let url = `https://mngatewood-weather-be.herokuapp.com/api/v1/forecast?location=${params}`

  fetch(url)
    .then(response => response.json())
    .then(json => apiCleaner(json.data))
    .then(weather => renderWeather(weather))
    .catch(error => console.error({ error }));
}

// move to render.js

function renderWeather(data) {
  $("#landing-page-container").hide();  
  renderCurrentConditions(data);
  renderLocationAndDateTime(data);
  $(".current-conditions").hover(expandCurrentConditions, collapseCurrentConditions);
}

function renderCurrentConditions(data) {
  let current = data.attributes.current

  $("#app-container").append(
    `<section id="current-conditions-container">
      <section id="current-conditions-overview-container">
        <h3 class="current-overview">${current.summary}</h3>
        <div id="current-temp-container">
          <h2 class="current-temp">${current.temperature}&deg;</h2>
        </div>
        <h3 class="feels-like">Feels like ${current.apparentTemperature}&deg;</h3>
        <div class="expand-current-conditions">
          <h4 class="current-conditions">Expand Current Conditions</h4>
        </div>
      </section>
      <section id="current-conditions-detail-container">
        <div class="high-low-container">
          <h4 class="high-temp"><strong>High: </strong>${current.todayHigh}</h4>
          <h4 class="low-temp"><strong>Low: </strong>${current.todayLow}</h4>
        </div>
        <h4 class="day-summary"><strong>Today: </strong>${data.attributes.summary}</h4>
        <div class="current-detail-container">
          <h4 class="current-detail-heading"><strong>Humidity:</strong></h4>
          <h4 class="current-detail-value">${current.humidity}</h4>
        </div>
        <div class="current-detail-container">
          <h4 class="current-detail-heading"><strong>Visibility:</strong></h4>
          <h4 class="current-detail-value">${current.visibility}</h4>
        </div>
        <div class="current-detail-container">
          <h4 class="current-detail-heading"><strong>UV Index:</strong></h4>
          <h4 class="current-detail-value">${current.uvIndex}</h4>
        </div>
      </section>
    </section>`)
}

function renderLocationAndDateTime(data) {
  let location = data.attributes

  $("#app-container").append(
    `<section id="location-date-container">
      <div id="location-container">
        <h2 class="city">${location.city}</h2>
        <h3 class="state-country">${location.state}, ${location.country}</h3>
      </div>
      <div id="date-time-container">
        <h3 class="date">${location.current.date}</h3>
        <h3 class="time">${location.current.time}</h3>
      </div>
    </section>`)
}

function expandCurrentConditions() {
  $("#current-conditions-container").height("auto");
  $(".expand-current-conditions").css("background-color", "unset");
  $(".current-conditions").text("Current Conditions");
  $(".current-conditions").css("color", "rgba(19, 47, 71, 1)");
}

function collapseCurrentConditions() {
  $("#current-conditions-container").height("278px");
  $(".expand-current-conditions").css("background-color", "rgba(107, 146, 179, 1)");
  $(".current-conditions").text("Expand Current Conditions");
  $(".current-conditions").css("color", "rgba(242, 243, 247, 1)");
}

// move to apiHelper.js

function apiCleaner(data) {
  let current = data.attributes.current;
  current.date = convertUnixTime(current.time).date;
  current.time = convertUnixTime(current.time).time;
  current.temperature = Math.round(current.temperature);
  current.apparentTemperature = Math.round(current.apparentTemperature);
  current.todayHigh = Math.round(data.attributes.daily[0].temperatureHigh)
  current.todayLow = Math.round(data.attributes.daily[0].temperatureLow)
  current.humidity = (current.humidity * 100) + "%";
  current.visibility = current.visibility + " miles"
  current.uvIndex = getUvIndexLevel(current.uvIndex);
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

function getUvIndexLevel(uvIndex) {
  switch(true) {
    case (uvIndex < 3):
      return uvIndex + " (low)"
    case (uvIndex < 6):
      return uvIndex + " (moderate)"
    case (uvIndex < 8):
      return uvIndex + " (high)"
    case (uvIndex < 11):
      return uvIndex + " (very high)"
    case (uvIndex >= 11):
      return uvIndex + " (extreme)"
  }
}
