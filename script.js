var searchInput = document.getElementById('searchInput');
var city = searchInput.value;
var searchBtn = document.getElementById('searchBtn');

var searchHistoryEl = document.getElementById('searchHistory');

var cityNameEl = document.getElementById('cityName');
var dateEl = document.getElementById('date');
var weatherCondEl = document.getElementById('weatherConditions');

var tempEl = document.getElementById('temp');
var humidityEl = document.getElementById('humidity');
var windSpeedEl = document.getElementById('windSpeed');
var uvIndexEl = document.getElementById('uvIndex');

var foreCastEl = document.getElementById('forecast');

var apiKey = "5d5d1586256ab99773fad7bd1dad7135";

// get current date
function getDate() {
    //variable holding the current day and date using moment.js
    var currentDay = moment().format("dddd, Do MMMM");
    dateEl.append(currentDay);
    console.log("Today is " + currentDay);
}


// search function
function handleSearch(e) {
    e.preventDefault();
    if (searchInput.value === "") {
        alert("Please enter a city");
    } else {
        getAPI();
    }
};

// make API call
function getAPI() {
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + apiKey;

    //fetch request
    fetch(requestURL)
        .then(function (response) {
            if (response === 400) {
                console.log(response);
            } else {
                response.json()
                    .then(function (data) {
                        console.log(data);
                        renderWeather(data, city);
                    })
            }

        })
};

//render weather results to screen
function renderWeather(weather) {

    getDate();

    var currentDay = moment().format("dddd, Do MMMM");
    tempEl.append(currentDay);
    console.log("The temperature is " + currentDay);
};

searchBtn.addEventListener('click', handleSearch);