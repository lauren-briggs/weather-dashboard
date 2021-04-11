var searchInput = document.getElementById('searchInput');
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
var city = searchInput.value;

var prevSearches = [];

// get current date
function getDate() {
    //variable holding the current day and date using moment.js
    var currentDay = moment().format("dddd, Do MMMM");
    dateEl.innerHTML = "";
    dateEl.append(currentDay);
    console.log("Today is " + currentDay);
}


// search function
function handleSearch(e) {
    e.preventDefault();
    if (searchInput.value === "") {
        alert("Please enter a city");
    } else {
        //save to local storage
        var city = searchInput.value;
        prevSearches.unshift(city);
        window.localStorage.setItem("City", JSON.stringify(prevSearches));
        console.log("You have saved your search of " + city + " to local storage");
        console.log("Previous searches array: " + prevSearches)

        getAPI();
        getForecast();
    }
};

// make API call
function getAPI() {
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=" + apiKey;

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

        }).catch(function (error) {
            console.log(error);
            return error;
        })
};

//render weather results to screen
function renderWeather(weather) {

    // var searchedCity = searchInput.value;
    cityNameEl.innerHTML = "<h2>" + searchInput.value + "</h2>";
    cityNameEl.setAttribute("style", "text-transform: uppercase;")
    console.log("The city you are searching is " + searchInput.value);

    getDate();

    weatherCondEl.innerHTML = ""
    var weatherIcon = weatherCondEl.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + weather.icon[0] + "@2x.png");

    tempEl.append(weather.main.temp);
    humidityEl.append(weather.main.humidity);
    windSpeedEl.append(weather.wind.speed);
    uvIndexEl.append()
};


//forecast function for API call
function getForecast() {
    var requestURL = "api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}"

    fetch(requestURL)
        .then(function (response) {
            response.json().then(function (data) {
                renderForecast(data);
                console.log(data);
            });
        });

}


// funciton renderForecast(){

// }



searchBtn.addEventListener('click', handleSearch, renderHistory);

function renderHistory() {
    var prevSearchList = JSON.parse(localStorage.getItem("City"));
    document.getElementById('searchHistory').innerHTML = prevSearchList;

}