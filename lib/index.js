import css from "./styles.css";
import {
  fetchWeather,
  fetchFavorites,
  fetchAddFavorite,
  fetchDeleteFavorite
} from "./fetch";

$(".location-search-input").keyup(enableLocationSearchSubmit)
$(".view-favorites-link").click(fetchFavorites)

export function enableLocationSearchSubmit() {
  if ($(".location-search-input").val()) {
    $(".location-search-submit").prop("disabled", false);
    document.querySelector(".location-search-submit").addEventListener("click", searchLocation);  
  } else {
    $(".location-search-submit").prop("disabled", true);
    $(".location-search-submit").off("click");
  }
}

export function searchLocation() {
  event.preventDefault();
  let location = $(".location-search-input").val();
  let data = fetchWeather(location);
}
