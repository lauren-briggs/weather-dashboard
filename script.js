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

var forecastEl = document.getElementById('forecast');

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

    console.log("api ONE call")
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
                console.log("APi call to get Lat and Lon below")
                console.log(data);
                renderForecast(data);
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
                        console.log("API One call below")
                        console.log(data);
                        renderWeather(data);

                    })
            }

        }).catch(function (error) {
            console.log(error);
            return error;
        })

}

function renderForecast(data) {

    // let forecast = data.daily[i];

    for (var i = 0; i <= 5; i++) {

        // console.log(forecast);

        let dailyObj = {
            date: data.daily[i].dt,
            icon: data.daily[i].weather.icon,
            temp: data.daily[i].temp,
            humidity: data.daily[i].humidity
        }
        console.log("daily object below");
        console.log(dailyObj);

        let dynamicForecastEl = document.createElement("div");

        let dailyDate = document.createElement("h4");
        dailyDate.textContent = moment.utc(date).format("dddd, Do MMMM");
        dynamicForecastEl.appendChild(dailyDate);

        let dailyIcon = document.createElement("img");
        dailyIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyObj.icon + "@2x.png");
        dynamicForecastEl.appendChild(dailyIcon);

        let dailyTemp = document.createElement("p");
        dailyTemp.textContent = dailyObj.temp;
        dynamicForecastEl.appendChild(dailyTemp);

        let dailyHumidity = document.createElement("p");
        dailyHumidity.textContent = dailyObj.humidity;
        dynamicForecastEl.appendChild(dailyHumidity);
    }
};

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