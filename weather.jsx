import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric"); // Celsius by default
  const API_KEY = "a847ff2a1a5e4a1f0a7d69d5b7bb3fd4"; // Replace with your API key

  // Fetch weather for a specific city
  const fetchWeather = async (city) => {
    if (!city) return;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      setWeather(response.data);
      setError(""); // Clear error if successful
    } catch (error) {
      setError("City not found!");
    }
  };

  // Fetch weather based on user's current location
  const getCurrentLocationWeather = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
          );
          setWeather(response.data);
          setError(""); // Clear error if successful
        } catch (error) {
          setError("Unable to fetch weather for your location.");
        }
      },
      () => {
        setError("Location access denied or unavailable.");
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-blue-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Weather App 🌤️</h1>
      <input
        type="text"
        placeholder="Enter city name..."
        className="p-2 border rounded"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        onClick={() => fetchWeather(city)}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Weather for {city}
      </button>

      <button
        onClick={getCurrentLocationWeather}
        className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
      >
        Use My Current Location
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {weather && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">
            {weather.name}, {weather.sys.country}
          </h2>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="weather icon"
            className="w-16 h-16"
          />
          <p>🌡️ Temperature: {weather.main.temp}°{unit === "metric" ? "C" : "F"}</p>
          <p>☁️ Condition: {weather.weather[0].description}</p>
          <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
