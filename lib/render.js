import {
  fetchWeather,
  fetchFavorites,
  fetchAddFavorite,
  fetchDeleteFavorite
} from "./fetch";
import { enableLocationSearchSubmit, searchLocation } from "./index";

export function renderWeather(data) {
  $("#footer-container").css("max-height", "200px");
  setTimeout(function () {
    $("#app-container").empty();
    renderCurrentConditions(data);
    renderLocationAndDateTime(data);
    updateWeatherClickEvents();
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
        <a href="javascript:void(0)" class="change-location-link">Change Location</a>
        <a href="javascript:void(0)" class="add-favorite-link">Add Favorite</a>
        <a href="javascript:void(0)" class="view-favorites-link">View Favorites</a>
        <a href="javascript:void(0)" class="refresh-weather-link">Refresh Weather</a>
      </div>
    </section>`)
}

function updateWeatherClickEvents() {
  $(".current-conditions").off("click").click(expandCurrentConditions);
  $(".change-location-link").off("click").click(renderChangeLocation);
  $(".add-favorite-link").off("click").click(fetchAddFavorite);
  $(".view-favorites-link").off("click").click(fetchFavorites);
  $(".refresh-weather-link").off("click").click(refreshWeather);
}

function expandCurrentConditions() {
  collapseFooter();
  $("#current-conditions-container").css("max-height", "600px");
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
  collapseCurrentConditions();
  $("#footer-container").css("max-height", "500px");
  $(".location-search-input").keyup(enableLocationSearchSubmit);
  $(".collapse-footer").click(collapseFooter);
  $(".change-location-link").off("click").click(collapseFooter);
  $(".links-container *:not('.change-location-link')").hide();
}

function collapseFooter() {
  $("#footer-container").css("max-height", "200px");
  updateWeatherClickEvents();
  setTimeout(function () {
    $(".expanded-footer-container").remove();
    $("h3.favorites-date-time").remove();
    $(".landing-view-favorites-link").text("View Favorites");
    $(".links-container *").show();
  }, 500)
}

export function renderFavorites(favorites) {
  renderFavoritesContainer();
  if (favorites.length) {
    renderFavoritesTime(favorites[0].attributes.current_weather);
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
  collapseCurrentConditions();
  $("#footer-container").css("max-height", "500px");
  $(".links-container *:not('.view-favorites-link')").hide();
}

function renderFavoritesLocations(favorites) {
  favorites.forEach(function (favorite) {
    $("#favorite-locations").append(
      `<div id="${favorite.id}" class="favorite-location-container">
        <h4 class="favorite-location-location">${favorite.attributes.location}</h4>
        <h4>${favorite.attributes.current_weather.summary}</h4>
        <h4 class="favorite-location-temp">${favorite.attributes.current_weather.temperature}&deg;</h4>
        <h4>Feels like ${favorite.attributes.current_weather.apparentTemperature}&deg;</h4>
        <h4 class="delete-favorite-link">Delete</h4>
      </div>`);
  });
}

function renderFavoritesNone() {
  $("#favorite-locations").append(
    `<h3>You don't have any favorite locations saved.</h3>`
  );
}

function updateFavoritesEventHandlers() {
  $(".collapse-footer").click(collapseFooter);
  $(".view-favorites-link").off("click").click(collapseFooter);
  $(".favorite-location-location").click(function (event) {
    fetchWeather($(this).text())
  });
  $(".delete-favorite-link").click(function (event) {
    let favoriteId = ($(this).parent().attr('id'));
    let location = ($(this).siblings(".favorite-location-location").text());
    fetchDeleteFavorite(favoriteId, location);
  })
}

export function renderDeleteFavorite(favorites, location) {
  $("#favorite-locations").empty();
  $(".favorites-date-time").remove();
  if (favorites.length) {
    renderFavoritesTime(favorites[0].attributes.current_weather);
    renderFavoritesLocations(favorites);
  } else {
    renderFavoritesNone();
  }
  renderDeleteFavoriteConfirmation(location);
  updateFavoritesEventHandlers();
}

function renderDeleteFavoriteConfirmation(location) {
  $("#favorite-locations").prepend(
    `<h4><strong>${location} has been successfully removed from your favorites.</strong></h4>`
  )
}

export function renderAddFavoriteConfirmation(favorite) {
  $("#footer-container").append(
    `<section id="add-favorite-confirmation-container" class="expanded-footer-container">
    <h3>${favorite.attributes.location}<br>has been successfully added as a favorite location.</h3>
    <a href="javascript:void(0)" class="collapse-footer">Close</a>
  </section> `);
  collapseCurrentConditions();
  $("#footer-container").css("max-height", "500px");
  $(".collapse-footer").click(collapseFooter);
  $(".add-favorite-link").off("click").click(collapseFooter);
  $(".links-container *:not('.add-favorite-link')").hide();
}

function refreshWeather() {
  let location = $(".city").text() + ", " + $(".state-country").text();
  fetchWeather(location);
  setTimeout(function () {
    renderRefreshConfirmation(location);
  }, 2000);
}

function renderRefreshConfirmation(location) {
  $("#footer-container").append(
    `<section id="refresh-confirmation-container" class="expanded-footer-container">
      <h3>Weather information has been refreshed for <br>${location}.</h3>
      <a href="javascript:void(0)" class="collapse-footer">Close</a>
    </section> `);
  collapseCurrentConditions();
  $("#footer-container").css("max-height", "500px");
  $(".collapse-footer").click(collapseFooter);
  $(".refresh-weather-link").off("click").click(collapseFooter);
  $(".links-container *:not('.refresh-weather-link')").hide();
}

