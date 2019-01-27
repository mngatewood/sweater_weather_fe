import css from "./styles.css";

$(".location-search-input").keyup(enableLocationSearchSubmit)
$(".view-favorites-link").click(viewFavorites)

function enableLocationSearchSubmit() {
  if ($(".location-search-input").val()) {
    $(".location-search-submit").prop("disabled", false);
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

function viewFavorites() {
  let apiKey = window.localStorage.getItem("apiKey");
  fetchFavorites(apiKey)
}

// refactor and move to fetch.js

function fetchWeather(location) {
  let params = location.replace(/\s/g, '')
  let url = `https://mngatewood-weather-be.herokuapp.com/api/v1/forecast?location=${params}`

  fetch(url)
    .then(response => response.json())
    .then(json => weatherCleaner(json.data))
    .then(weather => renderWeather(weather))
    .catch(error => console.error({ error }));
}

function fetchFavorites(apiKey) {
  let url = `https://mngatewood-weather-be.herokuapp.com/api/v1/favorites?api_key=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(json => favoritesCleaner(json.data))
    .then(favorites => renderFavorites(favorites))
    .catch(error => console.error({ error }));
}

// move to render.js

function renderWeather(data) {
  $("#footer-container").css("max-height", "200px");
  setTimeout(function() {
    $("#app-container").empty();
    renderCurrentConditions(data);
    renderLocationAndDateTime(data);
    $(".current-conditions").click(expandCurrentConditions);
    $(".change-location").click(renderChangeLocation);
    $(".view-favorites-link").click(viewFavorites);
  }, 500)
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
    `<section id="footer-container">
      <div id="location-date-container">
        <div id="location-container">
          <h2 class="city">${location.city}</h2>
          <h3 class="state-country">${location.state}, ${location.country}</h3>
        </div>
        <div id="date-time-container">
          <h3 class="date">${location.current.date}</h3>
          <h3 class="time">${location.current.time}</h3>
        </div>
      </div>
      <div class="links-container">
        <a href="javascript:void(0)" class="change-location">Change Location</a>
        <a href="#">Add Favorite</a>
        <a href="javascript:void(0)" class="view-favorites-link">View Favorites</a>
        <a href="#">Refresh</a>
      </div>
    </section>`)
}

function expandCurrentConditions() {
  $("#current-conditions-container").css("max-height","600px");
  $(".expand-current-conditions").css("background-color", "unset");
  $(".current-conditions").off("click").click(collapseCurrentConditions);
  $(".current-conditions").text("Collapse Current Conditions");
  $(".current-conditions").css("color", "rgba(19, 47, 71, 1)");
}

function collapseCurrentConditions() {
  $("#current-conditions-container").css("max-height", "278px");
  $(".current-conditions").off("click").click(expandCurrentConditions);
  setTimeout(function () {
    $(".expand-current-conditions").css("background-color", "rgba(107, 146, 179, 1)");
    $(".current-conditions").text("Expand Current Conditions");
    $(".current-conditions").css("color", "rgba(242, 243, 247, 1)");
  }, 500)
}

function renderChangeLocation() {
  $("#footer-container").append(
    `<section id="change-location-container" class="expanded-footer-container">
      <form class="location-search-form">
        <input class="location-search-input" type="text" placeholder="Search for a location" aria-label="input for search location">
        <input class="location-search-submit" type="submit" disabled>
      </form>
      <a href="javascript:void(0)" class="collapse-footer">Close</a>
    </section> `);
  $("#footer-container").css("max-height", "500px");
  $(".location-search-input").keyup(enableLocationSearchSubmit);
  $(".collapse-footer").click(collapseChangeLocation);
  $(".change-location").off("click").click(collapseChangeLocation);
  $(".links-container *:not('.change-location')").hide();
}

function collapseChangeLocation() {
  collapseFooter();
  $(".change-location").off("click").click(renderChangeLocation);
  setTimeout(function() {
    $(".links-container *").show();
  }, 500);
}

function collapseFooter() {
  $("#footer-container").css("max-height", "200px");
  setTimeout(function() {
    $(".expanded-footer-container").remove();
  }, 500)  
}

function renderFavorites(favorites) {
  renderFavoritesTime(favorites[0].attributes.current_weather);
  renderFavoritesContainer();
  if(favorites.length) {
    renderFavoritesLocations(favorites);
  } else {
    renderFavoritesNone();
  }
  updateFavoritesEventHandlers();
}

function renderFavoritesTime(currentWeather) {
  $(".landing-view-favorites-link").text("Favorites");
  $(".view-favorites-container").append(
    `<h3 class="favorites-date-time">${currentWeather.date}, ${currentWeather.time}</h3>`)
}

function renderFavoritesContainer() {
  $("#footer-container").append(
    `<section id="favorites-container" class="expanded-footer-container">
      <div id="favorite-locations"></div>
      <a href="javascript:void(0)" class="collapse-footer">Close</a>
    </section`)
  $("#footer-container").css("max-height", "500px");
  $(".links-container *:not('.view-favorites-link')").hide();
}

function renderFavoritesLocations(favorites) {
  favorites.forEach(function (favorite) {
    $("#favorite-locations").append(
      `<div class="favorite-location-container">
        <h4 id="favorite-${favorite.attributes.location}" 
          class="favorite-location-location">${favorite.attributes.location}</h4>
        <h4>${favorite.attributes.current_weather.summary}</h4>
        <h4 class="favorite-location-temp">${favorite.attributes.current_weather.temperature}&deg;</h4>
        <h4>Feels like ${favorite.attributes.current_weather.apparentTemperature}&deg;</h4>
      </div>`);
  });
}

function renderFavoritesNone() {
  $("#footer-container").append(
    `<h2>You don't have any favorite locations saved.</h2>`
  );
}

function updateFavoritesEventHandlers() {
  $(".collapse-footer").click(collapseFavorites);
  $(".view-favorites-link").off("click").click(collapseFavorites);
  $(".favorite-location-location").click(function (event) {
    fetchWeather($(this).text())
  });
}

function collapseFavorites() {
  collapseFooter();
  setTimeout(function() {
    $("h3.favorites-date-time").remove();
    $(".landing-view-favorites-link").text("View Favorites");
    $(".view-favorites-link").off("click").click(viewFavorites);
    $(".links-container *").show();
  }, 500)
}

// move to apiHelper.js

function weatherCleaner(data) {
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

function favoritesCleaner(data) {
  data.map(function (favorite) {
    let current = favorite.attributes.current_weather;
    current.date = convertUnixTime(current.time).date;
    current.time = convertUnixTime(current.time).time;
    current.temperature = Math.round(current.temperature);
    current.apparentTemperature = Math.round(current.apparentTemperature);
  })
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
