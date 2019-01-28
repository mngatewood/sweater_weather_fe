export function weatherCleaner(data) {
  let current = data.attributes.current;
  current.date = convertUnixTime(current.time).date;
  current.time = convertUnixTime(current.time).time;
  current.temperature = Math.round(current.temperature);
  current.apparentTemperature = Math.round(current.apparentTemperature);
  current.todayHigh = Math.round(data.attributes.daily[0].temperatureHigh);
  current.todayLow = Math.round(data.attributes.daily[0].temperatureLow);
  current.humidity = (current.humidity * 100).toFixed() + "%";
  current.visibility = current.visibility + " miles";
  current.uvIndex = getUvIndexLevel(current.uvIndex);
  hourlyCleaner(data.attributes.hourly);
  dailyCleaner(data.attributes.daily);
  return data
}

export function favoritesCleaner(data) {
  data.map(function (favorite) {
    let current = favorite.attributes.current_weather;
    current.date = convertUnixTime(current.time).date;
    current.time = convertUnixTime(current.time).time;
    current.temperature = Math.round(current.temperature);
    current.apparentTemperature = Math.round(current.apparentTemperature);
  })
  return data
}

function hourlyCleaner(data) {
  data.forEach(function(hour) {
    hour.hour = convertUnixHours(hour.time);
    hour.temperature = Math.round(hour.temperature);
  })
}

function dailyCleaner(data) {
  data.forEach(function (day) {
    day.day = convertUnixDays(day.time);
    day.temperatureMin = Math.round(day.temperatureMin);
    day.temperatureMax = Math.round(day.temperatureMax);
    day.precipProbability = (day.precipProbability * 100).toFixed() + "%";
  })
}

function convertUnixTime(time) {
  let date = new Date(time * 1000);
  let month = date.toLocaleString('en-us', { month: 'long' });
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  return {
    date: month + " " + date.getDate() + ", " + date.getFullYear(),
    time: convert24HourTime(hours, minutes.substr(-2))
  }
}

function convertUnixHours(time) {
  let date = new Date(time * 1000);
  let hours = date.getHours();
  return convert24HourTime(hours, "").replace(":","");;
}

function convertUnixDays(time) {
  let date = new Date(time * 1000);
  let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekday[date.getDay()];
}

function convert24HourTime(hours, minutes) {
  if (hours == 0) {
    return "12:" + minutes + "AM"
  } else if (hours == 12) {
    return "12:" + minutes + "PM"
  } else if (hours > 12) {
    return (hours - 12) + ":" + minutes + "PM"
  } else {
    return hours + ":" + minutes + "AM"
  }
}

function getUvIndexLevel(uvIndex) {
  switch (true) {
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
