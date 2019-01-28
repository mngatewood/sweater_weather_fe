import { weatherCleaner, favoritesCleaner } from "./apiHelper"
import { renderWeather, 
         renderFavorites, 
         renderAddFavoriteConfirmation, 
         renderDeleteFavorite } from "./render"

export function fetchWeather(location) {
  let params = location.replace(/\s/g, '')
  let url = `https://mngatewood-weather-be.herokuapp.com/api/v1/forecast?location=${params}`

  fetch(url)
    .then(response => response.json())
    .then(json => weatherCleaner(json.data))
    .then(weather => renderWeather(weather))
    .catch(error => console.error({ error }));
}

export function fetchFavorites() {
  let apiKey = window.localStorage.getItem("apiKey");
  let url = `https://mngatewood-weather-be.herokuapp.com/api/v1/favorites?api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(json => favoritesCleaner(json.data))
    .then(favorites => renderFavorites(favorites))
    .catch(error => console.error({ error }));
}

export function fetchAddFavorite() {
  let location = $(".city").text() + ", " + $(".state-country").text();
  let apiKey = window.localStorage.getItem("apiKey");
  let url = `https://mngatewood-weather-be.herokuapp.com/api/v1/favorites`;
  let body = {
    location: location,
    api_key: apiKey
  }

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(favorite => renderAddFavoriteConfirmation(favorite.data))
    .catch(error => console.error({ error }));
}

export function fetchDeleteFavorite(favoriteId, location) {
  let apiKey = window.localStorage.getItem("apiKey");
  let url = `https://mngatewood-weather-be.herokuapp.com/api/v1/favorites`;
  let body = {
    id: favoriteId,
    api_key: apiKey
  }

  fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(json => favoritesCleaner(json.data))
    .then(favorites => renderDeleteFavorite(favorites, location))
    .catch(error => console.error({ error }));
}

