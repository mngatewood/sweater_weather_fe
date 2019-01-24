// This file is in the entry point in your webpack config.
var locationSearchInput = document.querySelector('.location-search-input')
var locationSearchSubmit = document.querySelector('.location-search-submit')

locationSearchInput.addEventListener('keyup', enableLocationSearchSubmit)

function enableLocationSearchSubmit() {
  if (locationSearchInput.value) {
    locationSearchSubmit.removeAttribute('disabled', true);
    locationSearchSubmit.addEventListener('click', searchLocation)
  } else {
    locationSearchSubmit.setAttribute('disabled', true);
    locationSearchSubmit.removeEventListener('click', searchLocation)
  }
}

function searchLocation() {
  event.preventDefault()
}
