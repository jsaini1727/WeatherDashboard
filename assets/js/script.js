var searchInput = $('#search-text');
var searchBtn = $('#search-btn');
var apiKey = '0ea7d7cb0bccf9d8193db521824c2fad';
var cityDate = $('#city-date-title')
var city = searchInput.val();

// This function brings the current weather from the weather API
function getCurrentForecast() {
    var currentForecast = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    $.get(currentForecast)
        .then(function (data) {

            var icon = data.weather[0].icon;
            var currentDate = data.dt;
            var currentHumidity = data.main.humidity;
            var currentTemperature = data.main.temp;
            var currentWindSpeed = data.wind.speed;

            if (!city == []) {
                cityDate.text(`${city}, ${dayjs.unix(currentDate).format('MMMM, DD, YYYY')}`)
            } else {
                cityDate.text(`Location, ${dayjs.unix(currentDate).format('MMMM, DD, YYYY')}`)
            }
            $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${icon}.png`);
            $('#current-humidity').text("Humidity: " + currentHumidity + " %");
            $('#current-temperature').text("Temperature: " + currentTemperature + " ℉");
            $('#current-windspeed').text("Wind Speed: " + currentWindSpeed + " mph")
        })

}

// This function bring the forecast weather for 5 days from the weather API and then using the for loop we are able to insert each day into a new table.
function getForecast() {
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    var futureForecastContainer = document.querySelector("#forecast");
    if (futureForecastContainer) {
        futureForecastContainer.innerHTML = "";
    }
    $.get(forecastURL)
        .then(function (data) {
            console.log(data);
            var blocks = data.list;
            for (var i = 0; i < blocks.length; i++) {
                var blockObj = blocks[i];
                if (blockObj.dt_txt.includes('12:00')) {
                    var date = blockObj.dt_txt
                    var convertDate = dayjs(date).format("MM/DD/YYYY");
                    var icon = blockObj.weather[0].icon

                    var humidity = blockObj.main.humidity;
                    var temperature = blockObj.main.temp;
                    var windSpeed = blockObj.wind.speed;
                    $('#icon').attr('src', `https://openweathermap.org/img/wn/${icon[i]}.png`);
                    $('#date').text("Date: " + convertDate);
                    $('#humidity').text("Humidity: " + humidity + " %");
                    $('#temperature').text("Temperature: " + temperature);
                    $('#wind_speed').text("Wind Speed: " + windSpeed);

                    var newRow = $('<tr class=weatherForecast>');
                    newRow.append($('<td>').attr('src', `https://openweathermap.org/img/wn/${icon}.png`));
                    newRow.append($('<td>').text("Date: " + convertDate));
                    newRow.append($('<td>').text("Humidity: " + humidity + " %"));
                    newRow.append($('<td>').text("Temperature: " + temperature + " ℉"));
                    newRow.append($('<td>').text("Wind Speed: " + windSpeed + " mph"));

                    $('#forecast').append(newRow);
                }
            }
        });
}

// Function to get the Search History from local storage
function getSearchHistory() {
    var rawDataHistory = localStorage.getItem('search-history');
    var history = JSON.parse(rawDataHistory) || [];
    return history;
}

// Function to save the new city searched into the local storage and update the local storage but saving only once even if there is a difference in the case .
function saveSearchHistory() {
    var history = getSearchHistory();
    var lowerCased = history.map(function (city) {
        return city.toLowerCase();
    })
    if (!lowerCased.includes(city)) {
        history.push(city);
        localStorage.setItem('search-history', JSON.stringify(history));
    }
}
// Function to update the search history with the list using the local storage
function searchHistoryOutput() {
    var citySearched = localStorage.getItem('search-history');
    if (citySearched) {
        var cities = JSON.parse(citySearched);
        var historyOutput = document.querySelector("#history-output");
        cities.forEach(function (citySearched) {
            var button = document.createElement("button");
            button.textContent = citySearched;
            historyOutput.appendChild(button);
        })
    }

}
searchHistoryOutput();


searchBtn.click(function () {
    city = searchInput.val();
    getCurrentForecast();
    getForecast();
    saveSearchHistory();
});

$('#history-output').on('click', 'button', function () {
    city = $(this).text()
    getCurrentForecast();
    getForecast();


});

