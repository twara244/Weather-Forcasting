const cityCoordinates = {};

fetch('city_coordinates.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split('\n');
        for (const row of rows.slice(1)) {
            const [latitude, longitude, city, country] = row.split(',');
            const cityName = city.toLowerCase().trim();
            cityCoordinates[cityName] = { lat: parseFloat(latitude), lon: parseFloat(longitude) };

            // Dynamically add city options to the selector
            const option = document.createElement('option');
            option.value = cityName;
            option.textContent = `${city}, ${country}`;
            citySelector.appendChild(option);
        }
    });

const fetchWeatherButton = document.getElementById('fetchWeather');
const citySelector = document.getElementById('citySelector');
const weatherDisplay = document.getElementById('weatherDisplay');

fetchWeatherButton.addEventListener('click', () => {
    const selectedCity = citySelector.value;
    const coordinates = cityCoordinates[selectedCity];
    if (!coordinates) {
        weatherDisplay.innerHTML = 'Coordinates not available.';
        return;
    }

    const apiUrl = `http://www.7timer.info/bin/api.pl?lon=${coordinates.lon}&lat=${coordinates.lat}&product=civil&output=json`;

    // Make API request
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date();
            const forecastData = data.dataseries;
            
            let weatherHTML = `<h2>${selectedCity.toUpperCase()} Weather Forecast</h2>`;
            weatherHTML += '<div class="weather-cards">';

            for (let index = 0; index < 7; index++) {
                const forecastDate = new Date(currentDate);
                forecastDate.setDate(currentDate.getDate() + index); // Increment date for each forecast

                const dayData = forecastData[index];
                const formattedDate = forecastDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const weatherImage = getWeatherImage(dayData.weather); // Use the updated function

                weatherHTML += `
                    <div class="weather-card">
                        <div class="card-header">${formattedDate}</div>
                        <div class="card-body">
                            <img class="weather-icon" src="${weatherImage}" alt="${dayData.weather}">
                            <div class="temperature">Temperature: ${dayData.temp2m}°C</div>
                        </div>
                    </div>`;
            }

            weatherHTML += '</div>';
            weatherDisplay.innerHTML = weatherHTML;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherDisplay.innerHTML = 'An error occurred while fetching weather data.';
        });
});
function getWeatherImage(weather) {
    // This is a simplified mapping of weather conditions to images
    // Make sure the image paths are correct based on your file structure
    const weatherImages = {
        clear: './images/clear.png',
        pcloudy: './images/pcloudy.png',
        mcloudy: './images/mcloudy.png',
        cloudy: './images/cloudy.png',
        lightrain: './images/lightrain.png',
        rain: './images/rain.png',
        lightsnow: './images/lightsnow.png',
        snow: './images/snow.png'
    };
    

    const lowerCaseWeather = weather.toLowerCase();
    return weatherImages[lowerCaseWeather] || 'images/default.png';
}
function formatWeatherName(weatherType) {
    if (weatherType == "ishower") {
      return "Isolated Showers";
    } else if (weatherType == "lightrain") {
      return "Light Rain";
    } else if (weatherType == "lightsnow") {
      return "Light Snow";
    } else if (weatherType == "mcloudy") {
      return "Medium Cloudy";
    } else if (weatherType == "mcloudy") {
      return "Occasional Showers";
    } else if (weatherType == "ts") {
      return "Thunderstorm";
    } else if (weatherType == "pcloudy") {
      return "Partially Cloudy";
    } else if (weatherType == "rainsnow") {
      return "Rain Snow";
    } else if (weatherType == "tsrain") {
      return "Thunderstorm with Rain";
    } else {
      return weatherType.substring(0, 1).toUpperCase() + weatherType.substring(1);
    }
  }
  