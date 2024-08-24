// Ensure your script is executed after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Call the main function
    getWeatherData();
});

// Define an async function to handle the entire flow
async function getWeatherData() {
    try {
        // Get user's current position
        const position = await getCurrentPosition();

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Construct the API URL with the latitude and longitude
        const apiKey = '22ed3e756c2042a7832223021242208'; // Replace with your actual API key
        const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3&aqi=no&alerts=no`;

        // Fetch data from the API
        const weatherData = await fetchWeatherData(apiUrl);


        // Store the data in localStorage
        localStorage.setItem('weatherData', JSON.stringify(weatherData));

        console.log("Weather data stored:", weatherData);

        // You can now use weatherData as needed in your extension
        // For example, update UI elements with weather information

    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const storedWeatherData = localStorage.getItem('weatherData');
    if (storedWeatherData) {
        const weatherData = JSON.parse(storedWeatherData);

        // Example: Display location, temperature, and weather condition
        const locationElement = document.getElementById('location');
        const temperatureElement = document.getElementById('temperature');
        const conditionElement = document.getElementById('condition');
        const weatherIconElement = document.getElementById('weather-icon');
        const rainIconElement = document.getElementById('rain-icon');
        const rainChanceofElement = document.getElementById("rainChanceof");


        const locationName = weatherData.location.name + ', ' + weatherData.location.region;
        const temperature = weatherData.current.temp_f + 'F';
        const condition = weatherData.current.condition.text;
        const rainChanceof = weatherData.forecast.forecastday[0].day.daily_will_it_rain;

        locationElement.textContent = locationName;
        rainChanceofElement.textContent = rainChanceof + '%';
        temperatureElement.textContent = `${temperature}`;
        //conditionElement.textContent = ` ${condition}`;


        let iconSrc = '';
        if (condition.includes('Sunny')) {
            iconSrc = 'icons/sunny.png';
        } else if (condition.includes('cloudy')) {
            iconSrc = 'icons/cloudy.png';
        } else if (condition.includes('rain')) {
            iconSrc = 'icons/rainy.png';
        }

        if (iconSrc) {
            weatherIconElement.src = iconSrc;
            weatherIconElement.style.display = 'block';
        } else {
            weatherIconElement.style.display = 'none'; // Hide if no valid icon found
        }
        rainIconElement.src = 'icons/waterdroplet.png';
        rainIconElement.style.display = 'block';

    } else {
        console.log("No weather data found in localStorage.");
    }
});


// Helper function to get current position using Geolocation API
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
        } else {
            navigator.geolocation.getCurrentPosition(resolve, (error) => {
                reject(new Error("Failed to retrieve location. " + error.message));
            });
        }
    });
}

// Helper function to fetch weather data from the API
async function fetchWeatherData(apiUrl) {
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data. Status: ' + response.status);
    }
    const data = await response.json();
    return data;
}
