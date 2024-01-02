var searchInput = $('#search-text');
var searchBtn = $('#search-btn');
var apiKey = '0ea7d7cb0bccf9d8193db521824c2fad';
var city = searchInput.val();

// This function brings the current weather from the weather API
function getCurrentForecast() {
    var currentForecast = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    $.get(currentForecast)
        .then(function (data) {
            var currentHumidity = data.main.humidity;
            var currentTemperature = data.main.temp;
            var currentWindSpeed = data.wind.speed;
            $('#current-humidity').text("Humidity: " + currentHumidity + " %");
            $('#current-temperature').text("Temperature: " + currentTemperature + " ℉");
            $('#current-windspeed').text("Wind Speed: " + currentWindSpeed + " mph")
        })
}


// This function bring the forecast weather for 5 days from the weather API and then using the for loop we are able to insert each day into a new table.
function getForecast() {
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
    $.get(forecastURL)
        .then(function (data) {
            var blocks = data.list;
            for (var i = 0; i < blocks.length; i++) {
                var blockObj = blocks[i];
                if (blockObj.dt_txt.includes('12:00')) {
                    var date = blockObj.dt_txt
                    var convertDate = dayjs(date).format("MM/DD/YYYY");
                    var humidity = blockObj.main.humidity;
                    var temperature = blockObj.main.temp;
                    var windSpeed = blockObj.wind.speed;
                    $('#date').text("Date: " + convertDate);
                    $('#humidity').text("Humidity: " + humidity + " %");
                    $('#temperature').text("Temperature: " + temperature);
                    $('#wind_speed').text("Wind Speed: " + windSpeed);

                    var newRow = $('<tr class=weatherForecast>');
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

// Function to save the new city searched into the local storage and update the local storage
function saveSearchHistory() {
    var history = getSearchHistory();
    var rawDataHistory = JSON.stringify(history);
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('search-history', rawDataHistory);
    }
}



searchBtn.click(function () {
    city = searchInput.val();
    getCurrentForecast();
    getForecast();
});
