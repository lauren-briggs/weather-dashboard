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

var prevSearches = JSON.parse(window.localStorage.getItem("City"));

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
        city = searchInput.value;
        if (!prevSearches.includes(city)) {
            prevSearches.unshift(city);
            window.localStorage.setItem("City", JSON.stringify(prevSearches));
            console.log("You have saved your search of " + city + " to local storage");
            console.log("Previous searches array: " + prevSearches)
        }
        getLatLon();
    }
};

//render weather results to screen
function renderWeather(data) {
    // var searchedCity = searchInput.value;
    cityNameEl.innerHTML = "<h2>" + searchInput.value + "</h2>";
    cityNameEl.setAttribute("style", "text-transform: uppercase;")
    console.log("The city you are searching is " + searchInput.value);

    getDate();

    console.log(data);

    weatherCondEl.innerHTML = ""
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
    weatherCondEl.appendChild(weatherIcon);

    tempEl.innerHTML = data.current.temp;
    humidityEl.innerHTML = data.current.humidity;
    windSpeedEl.innerHTML = data.current.wind_speed;
    uvIndexEl.innerHTML = data.current.uvi;
};





//forecast function for API call
function getLatLon() {
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`

    fetch(requestURL)
        .then(function (response) {
            response.json().then(function (data) {
                getForecast(data);
                console.log(data);
            });
        });
}

function getForecast(data) {
    const requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`

    fetch(requestURL)
        .then(function (response) {
            if (response === 400) {
                console.log(response);
            } else {
                response.json()
                    .then(function (data) {
                        console.log(data);
                        renderWeather(data);

                    })
            }

        }).catch(function (error) {
            console.log(error);
            return error;
        })

}

// funciton renderForecast(){

// }

searchBtn.addEventListener('click', handleSearch, renderHistory);


function addHistoryButton(city) {
    let historyBtn = document.getElementById("historyBtn");
    let button = document.createElement("button");
    button.textContent = city;
    historyBtn.appendChild(button);
}


function renderHistory() {
    var prevSearchList = JSON.parse(localStorage.getItem("City"));
    prevSearches.map(function (e) {
        addHistoryButton(e)
    })
}

renderHistory();