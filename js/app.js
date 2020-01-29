//select elements --- выбор элементов
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");


//App data --- данные приложения
const weather = {};

weather.temperature = {
    unit: "celsius"
}

//App consts --- константы приложения
const KELVIN = 273;
//API key --- ключ АПИ
const key = "9fed38740084743c099fc1a20052ebfe";

//check if browser supports geolocation --- проверить поддерживание браузером геолокации 
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition( setPosition, showError );
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser Doesn't Support Geolocation</p>";
}

//set user's position --- установить позицию пользователя
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

//show error when there is an issue with geolocation service --- показать ошибку при возникновении проблем со службой геолокации
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

//get weather from API provider --- получить погоду от провайдера АПИ
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    console.log(api);

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;        
        })
        .then( function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

//display weather to UI --- показать погоду в пользовательском интерфейсе
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value} ° <span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;    
}

//C to F conversion --- преобразвать С к F
function celsiusToFahrenheit(temperature){
    return(temperature * 9/5) + 32;
}

//when the user clicks on the temperature element --- когда пользователь кликает на элемен темп-ры
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
        if(weather.temperature.unit == "celsius"){
            let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
            fahrenheit = Math.floor(fahrenheit);

            tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;
            weather.temperature.unit = "fahrenheit";
        }else{
            tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
            weather.temperature.unit = "celsius";
        }
});


//https://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22
