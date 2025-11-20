const API_KEY = 'e3321b593d8100ff08ce591ccde0d1b9';

async function getWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }
    
    const weatherData = await response.json();
    console.log('Weather data fetched successfully:', JSON.stringify(weatherData, null, 2));
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    throw error;
  }
}

getWeather('Prishtina');
