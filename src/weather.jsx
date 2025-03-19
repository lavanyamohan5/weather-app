import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet

// 🛠️ Fix missing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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

  // 📤 Function to share weather updates
  const shareWeather = () => {
    if (!weather) {
      setError("No weather data to share!");
      return;
    }

    const message = `🌤️ Weather Update for ${weather.name}, ${weather.sys.country}:\n
    🌡️ Temperature: ${weather.main.temp}°${unit === "metric" ? "C" : "F"}\n
    ☁️ Condition: ${weather.weather[0].description}\n
    💨 Wind Speed: ${weather.wind.speed} m/s\n
    Shared via My Weather App 🌍`;

    const encodedMessage = encodeURIComponent(message);

    // WhatsApp URL
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;

    // Twitter URL
    const twitterURL = `https://twitter.com/intent/tweet?text=${encodedMessage}`;

    // Instagram (Guides users to post manually)
    const instagramURL = `https://www.instagram.com/`;

    // Open a share prompt
    const userChoice = window.confirm("Share on WhatsApp? Click 'Cancel' for more options.");
    
    if (userChoice) {
      window.open(whatsappURL, "_blank");
    } else {
      const socialChoice = window.prompt("Type 'Twitter' or 'Instagram' to share:");
      if (socialChoice?.toLowerCase() === "twitter") {
        window.open(twitterURL, "_blank");
      } else if (socialChoice?.toLowerCase() === "instagram") {
        window.open(instagramURL, "_blank");
      }
    }
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

          {/* 📤 Share Weather Button */}
          <button
            onClick={shareWeather}
            className="mt-3 bg-purple-500 text-white px-4 py-2 rounded"
          >
            📤 Share Weather
          </button>

          {/* 🗺️ Interactive Map */}
          {weather.coord && (
            <MapContainer
              center={[weather.coord.lat, weather.coord.lon]}
              zoom={10}
              style={{ height: "400px", width: "100%", marginTop: "20px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[weather.coord.lat, weather.coord.lon]}>
                <Popup>
                  {weather.name}, {weather.sys.country} <br />
                  🌡️ {weather.main.temp}°{unit === "metric" ? "C" : "F"}
                </Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
