function getWeather() {
  const apiKey = '1910545d1ec14995145d64a37e7135a0'; 
  const city = document.getElementById('city').value.trim();

  if (!city) {
    alert('Please enter a city name');
    return;
  }

 const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  // Fetch current weather
  fetch(currentUrl) 
    .then(response => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(data => displayWeather(data))
    .catch(error => {
      alert('Error fetching current weather. Check city name.');
      console.error(error);
    });

  // Fetch forecast
  fetch(forecastUrl)
    .then(response => {
      if (!response.ok) throw new Error('Forecast not found');
      return response.json();
    })
    .then(data => displayHourlyForecast(data.list))
    .catch(error => {
      alert('Error fetching forecast data.');
      console.error(error);
    });
}

function displayWeather(data) {
  const tempDiv = document.getElementById('temp-div');
  const infoDiv = document.getElementById('weather-info');
  const iconImg = document.getElementById('weather-icon');

  // Clear previous
  tempDiv.innerHTML = '';
  infoDiv.innerHTML = '';
  iconImg.style.display = 'none';

  if (data.cod !== 200) {
    infoDiv.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  const city = data.name;
  const temp = Math.round(data.main.temp - 273.15);
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;

  tempDiv.innerHTML = `<p>${temp}°C</p>`;
  infoDiv.innerHTML = `<p><strong>${city}</strong></p><p>${desc}</p>`;
  iconImg.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
  iconImg.alt = desc;
  iconImg.style.display = 'block';
}

function displayHourlyForecast(forecastList) {
  const forecastDiv = document.getElementById('hourly-forecast');
  forecastDiv.innerHTML = '';

  const next8 = forecastList.slice(0, 8); // next 24 hours

  next8.forEach(item => {
    const time = new Date(item.dt * 1000);
    const hour = time.getHours().toString().padStart(2, '0');
    const temp = Math.round(item.main.temp - 273.15);
    const icon = item.weather[0].icon;

    const html = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
        <span>${temp}°C</span>
      </div>
    `;

    forecastDiv.innerHTML += html;
  });
}
