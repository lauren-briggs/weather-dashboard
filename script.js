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

var forecastHeading = document.getElementById('forecast-heading');
var forecastEl = document.getElementById('forecast-grid-container');

var apiKey = "5d5d1586256ab99773fad7bd1dad7135";
let city

const citySetStorage = {
    city: "Melbourne",
}

window.localStorage.setItem('City', JSON.stringify(citySetStorage));

var prevSearches = JSON.parse(window.localStorage.getItem("City"));


// search function
function handleSearch(e) {
    e.preventDefault();
    if (searchInput.value === "") {
        alert("Please enter a city");
    } else {
        console.log(searchInput.value)
        //save to local storage
        city = searchInput.value.toUpperCase();
        // console.log(prevSearches);
        if (!prevSearches.hasOwnProperty(city)) {
            window.localStorage.setItem("City", JSON.stringify(prevSearches));
            // console.log(prevSearches)
        }
        getLatLon();
        addHistoryButton(city);
    }
};

//render weather results to screen
function renderWeather(data) {
    // var searchedCity = searchInput.value;
    console.log(`RENDERED DATA AND NAME:`)
    console.log(data)
    console.log(`City var: ${city}`);
    cityNameEl.innerHTML = "<h2>" + city + "</h2>";
    cityNameEl.setAttribute("style", "text-transform: uppercase;")
    console.log("Search input: " + searchInput.value);

    //using UNIX code from data to get current date
    var currentDay = moment.utc().format("dddd, Do MMMM");
    dateEl.textContent = "";
    dateEl.append(currentDay);
    // console.log("Today is " + currentDay);

    //getting weather icon
    weatherCondEl.innerHTML = ""
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
    weatherCondEl.appendChild(weatherIcon);

    //temperature, humidity, wind speed and uv index
    tempEl.innerHTML = `Temperature: ${data.current.temp}&#8451;`;
    humidityEl.innerHTML = `Humidity: ${data.current.humidity}%`;
    windSpeedEl.innerHTML = `Wind Speed: ${data.current.wind_speed}`;
    uvIndexEl.innerHTML = `UV Index: ${data.current.uvi}`;

    //setting background colour of uv index depending on integer
    if (data.current.uvi > 5) {
        uvIndexEl.setAttribute("style", "background-color: red;")
    } else if (data.current.uvi <= 5 || data.current.uvi >= 3) {
        uvIndexEl.setAttribute("style", "background-color: orange;")
    } else {
        uvIndexEl.setAttribute("style", "background-color: yellow;")
    };

    city = ""
};

var nameOfCity

//forecast function for API call
function getLatLon() {
    console.log(`city var in latLon: ${city}`);
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`
    fetch(requestURL)
        .then(function (response) {
            response.json().then(function (data) {
                getForecast(data);
                console.log("DATA from APi call to get Lat and Lon below")
                console.log(data);
                nameOfCity = city;
                console.log(`name of city var in latLon response: ${nameOfCity}`);
                renderForecast(data);
                renderWeather(data);
            });
        });
}

//forecast function for API call
function getLatLonFromHistory(cityFromHistory) {
    console.log(`city var in latLon HISTORY: ${city}`);
    console.log(`cityFROM HISTORY var in latLon HISTORY: ${cityFromHistory}`);
    var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityFromHistory}&units=metric&APPID=${apiKey}`
    fetch(requestURL)
        .then(function (response) {
            response.json().then(function (data) {
                getForecast(data);
                console.log("DATA from HISTORY")
                console.log(data);
                city = cityFromHistory;
                console.log(`name of city var in latLon HISTORY response: ${city}`);
                renderForecast(data);
                renderWeather(data);
            });
        });
}

function getForecast(data) {
    const requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${apiKey}`

    fetch(requestURL)
        .then(function (response) {
            if (response === 400) {
                console.log(response);
            } else {
                response.json()
                    .then(function (data) {
                        console.log("DATA from API One call below")
                        console.log(data);
                        renderWeather(data);
                        renderForecast(data);
                    })
            }
        }).catch(function (error) {
            console.log(error);
            return error;
        })

}

//HERE
function renderForecast(data) {
    // console.log("DATA TO BE RENDERED: ", data);
    forecastEl.innerHTML = "";
    forecastHeading.innerHTML = "5 Day Forecast";

    for (var i = 0; i <= 4; i++) {
        let dailyObj = {
            date: data.daily[i].dt,
            icon: data.daily[i].weather[0].icon,
            temp: data.daily[i].temp.day,
            humidity: data.daily[i].humidity
        }
        // console.log("daily object " + [i] + " below");
        // console.log(dailyObj);

        let dynamicForecastEl = document.createElement("div");
        dynamicForecastEl.innerHTML = ""

        let dailyDate = document.createElement("h4");
        let myDate = moment.unix(dailyObj.date).format('dddd, MMMM Do')

        dailyDate.innerHTML = myDate;
        // console.log("myDate: ", myDate);
        dynamicForecastEl.appendChild(dailyDate);


        let dailyIcon = document.createElement("img");
        dailyIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyObj.icon + "@2x.png");
        dynamicForecastEl.appendChild(dailyIcon);

        let dailyTemp = document.createElement("h4");
        dailyTemp.innerHTML = dailyObj.temp + "&#8451;";
        dynamicForecastEl.appendChild(dailyTemp);

        let dailyHumidity = document.createElement("p");
        dailyHumidity.innerHTML = "Humidity: " + dailyObj.humidity + "%";
        dynamicForecastEl.appendChild(dailyHumidity);
        dynamicForecastEl.setAttribute("class", "forecast-grid-item");

        forecastEl.appendChild(dynamicForecastEl);
    }
};

searchBtn.addEventListener('click', handleSearch);

function addHistoryButton(city) {
    let historyBtn = document.getElementById("historyBtn");
    let button = document.createElement("button");
    button.textContent = city;
    historyBtn.appendChild(button);
}



// TO DO: create function to call search from click on history button
// on click of history button

function handleSearchFromHistory(e, cityFromHistory) {
    e.preventDefault();
    // console.log(e.target);
    cityFromHistory = e.target.textContent;
    console.log(`RELOAD STARTED HERE ---- CITY FROM HISTORY: ${cityFromHistory}`);
    getLatLonFromHistory(cityFromHistory);
}

historyBtn.addEventListener("click", handleSearchFromHistory);