import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

const API_KEY = "e3321b593d8100ff08ce591ccde0d1b9";

// Fetch current weather
async function fetchCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Current weather error");
  return await response.json();
}

// Fetch 5-day forecast
async function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Forecast error");
  return await response.json();
}

export default function App() {
  const [city, setCity] = useState("Prishtina");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); // store filtered forecast

  useEffect(() => {
    loadWeather();
  }, []);

  async function loadWeather() {
    try {
      const w = await fetchCurrentWeather(city);
      const f = await fetchForecast(city);

      setWeather(w);

      // Extract ONE forecast per day — choose entries at "12:00:00"
      const daily = f.list.filter(item => item.dt_txt.includes("12:00:00"));
      setForecast(daily);

    } catch (err) {
      console.log("Error loading weather:", err.message);
      setWeather(null);
      setForecast([]);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Weather App</Text>

      {/* Search input */}
      <TextInput
        style={styles.input}
        placeholder="Search city..."
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.button} onPress={loadWeather}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Current Weather Card */}
      {weather && (
        <View style={styles.card}>
          <Text style={styles.city}>{weather.name}</Text>

          <Image
            style={styles.icon}
            source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png` }}
          />

          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>

          <Text style={styles.desc}>
            {weather.weather[0].description}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Humidity: {weather.main.humidity}%</Text>
            <Text style={styles.infoText}>Wind: {weather.wind.speed} m/s</Text>
          </View>
        </View>
      )}

      {/* ---------------------- */}
      {/*  5-DAY FORECAST LIST   */}
      {/* ---------------------- */}
      {forecast.length > 0 && (
        <>
          <Text style={styles.forecastTitle}>5-Day Forecast</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastList}>
            {forecast.map((day, index) => {
              const date = new Date(day.dt_txt);
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
              const monthDay = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });

              return (
                <View key={index} style={styles.forecastCard}>
                  <Text style={styles.forecastDate}>{dayName}</Text>
                  <Text style={styles.forecastDateSmall}>{monthDay}</Text>

                  <Image
                    style={styles.forecastIcon}
                    source={{
                      uri: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
                    }}
                  />

                  <Text style={styles.forecastTemp}>{Math.round(day.main.temp)}°C</Text>
                  <Text style={styles.forecastDesc}>{day.weather[0].description}</Text>
                </View>
              );
            })}
          </ScrollView>
        </>
      )}

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#0a3d62",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    width: "90%",
    padding: 14,
    backgroundColor: "#1e90ff",
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  card: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 25,
  },
  city: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
  },
  icon: {
    width: 150,
    height: 150,
  },
  temp: {
    fontSize: 55,
    color: "#fff",
    fontWeight: "700",
  },
  desc: {
    fontSize: 20,
    color: "#dfe6e9",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  infoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },

  /* FORECAST STYLING */
  forecastTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    width: "90%",
  },
  forecastList: {
    width: "100%",
    paddingLeft: 15,
  },
  forecastCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 120,
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  forecastDate: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  forecastDateSmall: {
    color: "#eee",
    marginBottom: 5,
    fontSize: 14,
  },
  forecastIcon: {
    width: 60,
    height: 60,
  },
  forecastTemp: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 5,
  },
  forecastDesc: {
    color: "#ddd",
    fontSize: 14,
    textTransform: "capitalize",
    textAlign: "center",
    marginTop: 4,
  },
});
