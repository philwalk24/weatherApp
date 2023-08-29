// API key
var APIkey = '646207e63c5c05bb5a8c04c6ac98c892';

// for storing cities
var searchHistory = [];

// use timezone plugins for day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// these variables are selecting the elements from the HMTL to be used as containers
var pastCities = document.querySelector('#history');
var weatherToday = document.querySelector('#today');
var searchInput = document.querySelector('#search-input');
var forecastContainer = document.querySelector('#forecast');

var searches = document.querySelector('#search-form');


// this will render buttons that will represent past searches that the user 
// has entered
function renderSearchHistory() {
  pastCities.innerHTML = '';
  // Start at end of history array and count down to show the most recent at the top.
  for (var i = searchHistory.length - 1; i >= 0; i--) {

    // creating a button for every city in the search history
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.setAttribute('font-family', 'serif')
    btn.classList.add('history-btn', 'btn-history');

    // `data-search` allows access to city name when click handler is invoked
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    pastCities.append(btn);
  }
}

// this allows the search history to be initialized
function initSearchHistory(){

  // check for search history in local storage
  var storedHis = localStorage.getItem('search-history');
  if(storedHis){
    // if there is something in there, parse the data from JSON to
    // a JavaScript object
    searchHistory = JSON.parse(storedHis);
  }
  // render the searches onto the page
  renderSearchHistory();
}

// this allows us to take a search term the user enters and adds it to
// local storage so the city is remembered
function appendToHistory(search){
  // dont do anything if search bar is empty
  if(searchHistory.indexOf(search) !== -1){
    return;
  }
  // push city to array
  searchHistory.push(search);

  // save the stuff inside searchHistory into local storage
  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  // render the cities/buttons to the page
  renderSearchHistory();
}

// we are getting the current weather from a city called c
// this will use the openweather api to do this
function getCurrentWeather(c,r){


      // get current date
      var date = dayjs().format('M/D/YYYY');
      
      // we will get temperature, humidity, and wind speed from the api
      var t = r.main.temp;
      var h = r.main.humidity;
      var mph = r.wind.speed;

      // the icon that is for displaying the weather icon (cloudy, sunny, etc)
      var iconUrl = `https://openweathermap.org/img/w/${r.weather[0].icon}.png`;
     
      // these are all for creating a card to be on the page that will contain
      // the city's weather at that time
      var weatherCard = document.createElement('div');
      var cardBody = document.createElement('div');
      var heading = document.createElement('h2');
      var icon = document.createElement('img');
      var temperatureElement = document.createElement('p');
      var windSpeed = document.createElement('p');
      var humidityElement = document.createElement('p');

      weatherCard.setAttribute('class','card');
      cardBody.setAttribute('class','card-body');
      weatherCard.append(cardBody);

      // adding classes for text
      heading.setAttribute('class', 'h2 card-title');
      temperatureElement.setAttribute('class', 'card-text');
      windSpeed.setAttribute('class', 'card-text');
      humidityElement.setAttribute('class', 'card-text');

      // date and city name on the heading
      heading.textContent = `${c} (${date})`;
      // put the weather icon
      icon.setAttribute('src',`https://openweathermap.org/img/w/${r.weather[0].icon}.png`);
      icon.setAttribute('class', 'weather-img');

      // add icon to the heading
      heading.append(icon);

      // put all the weather info into there respective text boxes
      temperatureElement.textContent = `Temperature: ${t}`;
      windSpeed.textContent = `Windspeed: ${mph} mph`;
      humidityElement.textContent = `Humidity: ${h} %`;
      cardBody.append(heading,temperatureElement,windSpeed,humidityElement);
      
      weatherToday.innerHTML = '';
      // add everything to the final card
      weatherToday.append(weatherCard);


      
    
    // } catch (error) {
    //   console.error(error);
    // }

}

// this function is for rendering one of the 5 cards that will be shown
// for the 5 day forecast, this will be called 5 times later on
function oneDayCard(weather){
  // the weather icon URL
  var icon = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

  // we get the weather for one day
  var t = weather.main.temp;
  var h = weather.main.humidity;
  var mph = weather.wind.speed;

  // this is building one of the 5 cards that show the 5 day forecast
  // similar to the getCurrentWeather function
  var temperatureElement = document.createElement('p');
  var windSpeed = document.createElement('p');
  var humidityElement = document.createElement('p');
  var column = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');


  // now we add these elements all to the cardBody
  column.append(card);
  card.append(cardBody);

  // putting all the info elements into the div
  cardBody.append(cardTitle,weatherIcon,temperatureElement,windSpeed,humidityElement);


  // now we are stylizing these elements we added so that the page
  // looks good
  column.setAttribute('class', 'col-md');
  // adding custom class for styling
  column.classList.add('five-day-card');
  card.setAttribute('class', 'card bg-primary h-100 text-white');
  cardBody.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-title');
  temperatureElement.setAttribute('class', 'card-text');
  windSpeed.setAttribute('class', 'card-text');
  humidityElement.setAttribute('class', 'card-text');

  // these two statements add the date and the weather icon
  cardTitle.textContent = dayjs(weather.dt_txt).format('M/D/YYYY');
  weatherIcon.setAttribute('src',icon);

  // like the function above, adding the weather info into text
  temperatureElement.textContent = `Temperature: ${t} degrees`;
  windSpeed.textContent = `Windspeed: ${mph} mph`;
  humidityElement.textContent = `Humidity: ${h} %`;
  forecastContainer.append(column);
}

// this is for rendering the 5 day forecase for the selected city
function fiveDays(daily){
   // Create unix timestamps for start and end of 5 day forecast
   var start = dayjs().add(1, 'day').startOf('day').unix();
   var end = dayjs().add(6, 'day').startOf('day').unix();

   // add a header for 5 day title
   var headingCol = document.createElement('div');
   var heading = document.createElement('h4');
   headingCol.setAttribute('class', 'col-12');
   heading.textContent = '5-Day Forecast:';
   headingCol.append(heading);

   forecastContainer.innerHTML = '';
   forecastContainer.append(headingCol);

   for(var z = 0; z<daily.length; z++){

     // First filters through all of the data and returns only data that falls between one day after the current data and up to 5 days later.
     // must be in between the current day and 5 days later
     if (daily[z].dt >= start && daily[z].dt < end) {

      // Then filters through the data and returns only data captured at noon for each day.
      if (daily[z].dt_txt.slice(11, 13) == "12") {
        // render a single card for that specific day
        oneDayCard(daily[z]);
      }
    }
   }
}
// simply calls the functions to get the weather now and 5 day forecast function
function renderStuff(city,data){
  getCurrentWeather(city,data.list[0],data.city.timezone);
  fiveDays(data.list);
}

// now for this function, we want a specific location loc,
// and we will pass in the data using latitude and longitude
// in order to get forecast data
function weatherFetcher(loc){
  // extracting the lat and lon from a given location
  var { lat } = loc;
  var { lon } = loc;
  var cityName = loc.name;
  // passing into the openweathermap api
  var URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIkey}`;
  // sending a GET request to the URL, we will get JSON data back
  fetch(URL)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    // pass the forecast data we recieved in order to getCurrentWeather
    renderStuff(cityName,data);

  })
  // this is to catch any errors
  .catch(function(err){
    console.log(err);
  });
}

// this function is for getting the specific latitude and longitude
// for a searched city and we will pass that into weatherFetcher()
function getCoords(search){
  var URL = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${APIkey}`;
  // send GET request and hopefully get back coordinate data
  // of the city
  fetch(URL)
    .then(function (res) {
      // parse the data
      return res.json();
    })
    .then(function (data) {
      console.log(data)
      if (!data[0]) {
        alert('404: Location not found!');

      } else {
        // now if the location is found, send the coordinates to
        // weatherFetcher to get the specific forecast
        appendToHistory(search);
        weatherFetcher(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}


// this function will just handle what happens when
// the search button is clicked
function submitForm(x){
  // do nothing if search is empty
  if(!searchInput.value){
    return;
  }
  // stop page from clearing
  x.preventDefault();
  // get what the user typed and pass it on to getCoords
  // to get geographical information
  var location = searchInput.value.trim();
  getCoords(location);

  // make it blank again after search is submitted
  searchInput.value = '';
}


// for when one of the search history buttons is clicked
function cityHistory(x){
  // must hit a button in the history only
  if(!x.target.matches('.btn-history')){
    return;
  }

  var button = x.target;
  var search = button.getAttribute('data-search');
  // pass the city from the button to the getCoords()
  getCoords(search);
}
initSearchHistory();

// listens for submit or history buttons
searches.addEventListener('submit', submitForm);
pastCities.addEventListener('click',cityHistory);
