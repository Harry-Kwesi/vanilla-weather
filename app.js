const cityInput = document.getElementById("city");
const searchButton = document.getElementById("search-btn");
const card = document.getElementById("result");

const apiKey = "";
const weatherUrl = "http://dataservice.accuweather.com";

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const getCityData = async (city) => {
  const cityEndpoint = `${weatherUrl}/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;
  const data = await fetchData(cityEndpoint);
  return data[0];
};

const getWeatherData = async (cityKey) => {
  const weatherEndpoint = `${weatherUrl}/currentconditions/v1/${cityKey}?apikey=${apiKey}`;
  const data = await fetchData(weatherEndpoint);
  return data[0];
};

const updateUI = (cityDets, weather) => {
  card.innerHTML = `
    <h2>${cityDets.LocalizedName}</h2>
    <h4 class="weather">${weather.WeatherText}</h4>
    <h1>${weather.Temperature.Metric.Value}&deg;</h1>
  `;
};

const saveCityToLocalStorage = (city) => {
  localStorage.setItem("city", city);
};

const searchCity = async () => {
  const city = cityInput.value.trim();
  saveCityToLocalStorage(city);

  try {
    const cityData = await getCityData(city);
    if (cityData) {
      const weatherData = await getWeatherData(cityData.Key);
      updateUI(cityData, weatherData);
    } else {
      console.error("City not found");
    }
  } catch (error) {
    console.error(error);
  }
};

const savedCity = localStorage.getItem("city");
if (savedCity) {
  cityInput.value = savedCity;
  searchCity();
}

searchButton.addEventListener("click", searchCity);
