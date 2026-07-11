// --- Application State ---
let userSettings = {
  temp_unit: 'C',
  theme: 'dark',
  favorite_city: 'London'
};

// Open-Meteo Weather Codes Mapping
const WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: 'clear' },
  1: { label: 'Mainly Clear', icon: 'partly-cloudy' },
  2: { label: 'Partly Cloudy', icon: 'partly-cloudy' },
  3: { label: 'Overcast', icon: 'cloudy' },
  45: { label: 'Foggy', icon: 'fog' },
  48: { label: 'Depositing Rime Fog', icon: 'fog' },
  51: { label: 'Light Drizzle', icon: 'rain' },
  53: { label: 'Moderate Drizzle', icon: 'rain' },
  55: { label: 'Dense Drizzle', icon: 'rain' },
  61: { label: 'Slight Rain', icon: 'rain' },
  63: { label: 'Moderate Rain', icon: 'rain' },
  65: { label: 'Heavy Rain', icon: 'heavy-rain' },
  71: { label: 'Slight Snowfall', icon: 'snow' },
  73: { label: 'Moderate Snowfall', icon: 'snow' },
  75: { label: 'Heavy Snowfall', icon: 'snow' },
  80: { label: 'Slight Rain Showers', icon: 'rain' },
  81: { label: 'Moderate Rain Showers', icon: 'rain' },
  82: { label: 'Violent Rain Showers', icon: 'heavy-rain' },
  95: { label: 'Thunderstorm', icon: 'thunderstorm' },
  96: { label: 'Thunderstorm with Hail', icon: 'thunderstorm' },
  99: { label: 'Severe Thunderstorm', icon: 'thunderstorm' }
};

// --- DOM Elements ---
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const quickCityBtns = document.querySelectorAll('.quick-city-btn:not(#quick-fav-btn)');
const quickFavBtn = document.getElementById('quick-fav-btn');

const settingsForm = document.getElementById('settings-form');
const themeDarkRadio = document.getElementById('theme-dark');
const themeLightRadio = document.getElementById('theme-light');
const unitCRadio = document.getElementById('unit-c');
const unitFRadio = document.getElementById('unit-f');
const favCityInput = document.getElementById('fav-city-input');
const settingsStatus = document.getElementById('settings-status');

const weatherLoader = document.getElementById('weather-loader');
const weatherError = document.getElementById('weather-error');
const errorMessage = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');
const introCard = document.getElementById('intro-card');

const weatherCity = document.getElementById('weather-city');
const weatherCountry = document.getElementById('weather-country');
const favIndicator = document.getElementById('fav-indicator');
const weatherTemp = document.getElementById('weather-temp');
const weatherDesc = document.getElementById('weather-desc');
const weatherIconContainer = document.getElementById('weather-icon-container');

const metricApparent = document.getElementById('metric-apparent');
const metricHumidity = document.getElementById('metric-humidity');
const metricWind = document.getElementById('metric-wind');
const metricTime = document.getElementById('metric-time');

// --- SVG Icons ---
function getSVGIcon(type, isDay) {
  const color = 'currentColor';
  
  const icons = {
    'clear': isDay 
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b;"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #94a3b8;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    
    'partly-cloudy': isDay
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #38bdf8;"><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M6.34 17.66l-1.41 1.41M2 12h2m16.24-7.07l-1.41 1.41"/><path d="M20 18.5a3 3 0 0 0-3-3h-.79A6 6 0 0 0 5 16a3 3 0 0 0 0 6h15a2.5 2.5 0 0 0 0-5z" fill="rgba(255,255,255,0.1)"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748b;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9zm8 15.5a3 3 0 0 0-3-3h-.79A6 6 0 0 0 5 16a3 3 0 0 0 0 6h15a2.5 2.5 0 0 0 0-5z"/></svg>`,
    
    'cloudy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #94a3b8;"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    
    'fog': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #a1a1aa;"><line x1="5" y1="9" x2="19" y2="9"/><line x1="3" y1="13" x2="21" y2="13"/><line x1="7" y1="17" x2="17" y2="17"/><line x1="10" y1="21" x2="14" y2="21"/></svg>`,
    
    'rain': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #60a5fa;"><line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
    
    'heavy-rain': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6;"><line x1="16" y1="13" x2="14" y2="21"/><line x1="8" y1="13" x2="6" y2="21"/><line x1="12" y1="15" x2="10" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/><path d="M6 14l-2 6M18 14l-2 6" stroke-dasharray="2 2"/></svg>`,
    
    'snow': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #93c5fd;"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/></svg>`,
    
    'thunderstorm': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #eab308;"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 8.58"/><polyline points="13 11 9 17 12 17 11 23 16 15 13 15 14 11"/></svg>`
  };

  return icons[type] || icons['cloudy'];
}

// --- Controller Logic ---

// Fetch user settings from SQL backend database
async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    if (response.ok) {
      userSettings = await response.ok ? await response.json() : userSettings;
      applyTheme(userSettings.theme);
      updateSettingsUI();
      
      // Update the ⭐ Favorite City shortcut badge on search dashboard
      if (userSettings.favorite_city) {
        quickFavBtn.textContent = `⭐ ${userSettings.favorite_city}`;
        quickFavBtn.style.display = 'inline-block';
        
        // Auto-search the favorite city on initial load
        fetchWeather(userSettings.favorite_city);
      } else {
        quickFavBtn.style.display = 'none';
        introCard.style.display = 'flex';
      }
    }
  } catch (error) {
    console.error('Error loading settings from database:', error);
    // Fallback: If DB server is starting/down, just display intro screen
    introCard.style.display = 'flex';
  }
}

// Apply selected theme (Light/Dark) by writing to the root HTML attribute
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// Sync preferences into settings inputs
function updateSettingsUI() {
  if (userSettings.theme === 'dark') {
    themeDarkRadio.checked = true;
  } else {
    themeLightRadio.checked = true;
  }

  if (userSettings.temp_unit === 'F') {
    unitFRadio.checked = true;
  } else {
    unitCRadio.checked = true;
  }

  favCityInput.value = userSettings.favorite_city || '';
}

// Save settings to backend SQL DB
async function saveSettings(e) {
  e.preventDefault();
  
  const selectedUnit = document.querySelector('input[name="temp_unit"]:checked').value;
  const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
  const inputtedFavCity = favCityInput.value.trim();

  const bodyData = {
    temp_unit: selectedUnit,
    theme: selectedTheme,
    favorite_city: inputtedFavCity
  };

  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (response.ok) {
      userSettings = { ...bodyData };
      applyTheme(userSettings.theme);
      
      // Update favorite city badge
      if (userSettings.favorite_city) {
        quickFavBtn.textContent = `⭐ ${userSettings.favorite_city}`;
        quickFavBtn.style.display = 'inline-block';
      } else {
        quickFavBtn.style.display = 'none';
      }

      showStatusMessage('Settings saved to SQLite Database!', 'success');
      
      // If we currently have a weather display or searched city, re-fetch to reflect new unit
      const currentCity = weatherCity.textContent;
      if (weatherCard.style.display === 'flex' && currentCity) {
        fetchWeather(currentCity);
      }
    } else {
      showStatusMessage('Failed to save settings.', 'error');
    }
  } catch (error) {
    console.error('Error saving settings to backend:', error);
    showStatusMessage('Could not connect to server database.', 'error');
  }
}

function showStatusMessage(text, type) {
  settingsStatus.textContent = text;
  settingsStatus.className = `status-msg status-${type}`;
  
  setTimeout(() => {
    settingsStatus.style.display = 'none';
  }, 3500);
}

// Fetch Weather from Open-Meteo API
async function fetchWeather(cityName) {
  if (!cityName) return;

  // Show loading spinner, hide other display cards
  introCard.style.display = 'none';
  weatherError.style.display = 'none';
  weatherCard.style.display = 'none';
  weatherLoader.style.display = 'flex';

  try {
    // Step 1: Geocoding - Search city coordinates using Open-Meteo Geocoding API
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geocodeUrl);
    
    if (!geoResponse.ok) {
      throw new Error('Geocoding request failed');
    }

    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
      showError('City not found. Please verify spelling.');
      return;
    }

    const cityDetails = geoData.results[0];
    const { latitude, longitude, name, country, admin1 } = cityDetails;

    // Step 2: Forecast - Query Open-Meteo weather forecast for coordinates
    const unitParam = userSettings.temp_unit === 'F' ? '&temperature_unit=fahrenheit' : '';
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto${unitParam}`;
    
    const weatherResponse = await fetch(forecastUrl);
    if (!weatherResponse.ok) {
      throw new Error('Weather API request failed');
    }

    const weatherData = await weatherResponse.json();
    displayWeatherData(name, country || admin1 || '', weatherData.current);
    
  } catch (error) {
    console.error('Error fetching weather:', error);
    showError('Could not fetch weather data. Check your connection and try again.');
  }
}

// Display retrieved metrics on the main card dashboard
function displayWeatherData(cityName, countryName, currentData) {
  // Hide loader
  weatherLoader.style.display = 'none';

  // 1. Text values
  weatherCity.textContent = cityName;
  weatherCountry.textContent = countryName;

  // Show favorite icon if this searched city matches our DB favorite
  if (userSettings.favorite_city && cityName.toLowerCase() === userSettings.favorite_city.toLowerCase()) {
    favIndicator.style.display = 'inline-block';
  } else {
    favIndicator.style.display = 'none';
  }

  // 2. Metrics & Units
  const unitSuffix = userSettings.temp_unit === 'F' ? '°F' : '°C';
  weatherTemp.textContent = `${Math.round(currentData.temperature_2m)}${unitSuffix}`;
  metricApparent.textContent = `${Math.round(currentData.apparent_temperature)}${unitSuffix}`;
  metricHumidity.textContent = `${currentData.relative_humidity_2m}%`;
  
  // Convert wind speed format if Fahrenheit is used
  const windSuffix = userSettings.temp_unit === 'F' ? 'mph' : 'km/h';
  const windVal = userSettings.temp_unit === 'F' 
    ? Math.round(currentData.wind_speed_10m * 0.621371) // Convert km/h to mph
    : Math.round(currentData.wind_speed_10m);
  metricWind.textContent = `${windVal} ${windSuffix}`;

  // Time formatter based on timezone location
  const dateOpts = { hour: '2-digit', minute: '2-digit', hour12: true };
  metricTime.textContent = new Date().toLocaleTimeString('en-US', dateOpts);

  // 3. Weather Icon & Description mapping
  const weatherCodeInfo = WEATHER_CODES[currentData.weather_code] || { label: 'Unspecified', icon: 'cloudy' };
  weatherDesc.textContent = weatherCodeInfo.label;
  
  // Inject the dynamically generated SVG icon into weather card
  weatherIconContainer.innerHTML = getSVGIcon(weatherCodeInfo.icon, currentData.is_day === 1);

  // Display the card
  weatherCard.style.display = 'flex';
}

function showError(msg) {
  weatherLoader.style.display = 'none';
  errorMessage.textContent = msg;
  weatherError.style.display = 'flex';
}

// --- Event Listeners ---

// Handle manual search form submit
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchVal = cityInput.value.trim();
  if (searchVal) {
    fetchWeather(searchVal);
  }
});

// Handle Quick Links (London, New York, Tokyo)
quickCityBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const cityName = btn.textContent;
    cityInput.value = cityName;
    fetchWeather(cityName);
  });
});

// Handle Quick link for SQLite favorite city
quickFavBtn.addEventListener('click', () => {
  if (userSettings.favorite_city) {
    cityInput.value = userSettings.favorite_city;
    fetchWeather(userSettings.favorite_city);
  }
});

// Handle saving Settings
settingsForm.addEventListener('submit', saveSettings);

// Settings Toggle Panel Animation (expand/collapse)
const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const settingsCard = document.getElementById('settings-card');

settingsToggleBtn.addEventListener('click', () => {
  settingsCard.classList.toggle('collapsed');
  // Scroll to settings if it's mobile layout
  if (window.innerWidth <= 768) {
    settingsCard.scrollIntoView({ behavior: 'smooth' });
  }
});

// Initialize app settings and automatic favorite city weather fetch on page load
window.addEventListener('DOMContentLoaded', loadSettings);
