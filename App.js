import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

const API_KEY = "e3321b593d8100ff08ce591ccde0d1b9";

// Fetch current weather
async function fetchCurrentWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // ⭐ RESULT IN CONSOLE ONLY
    console.log("Weather fetched successfully:", data);

    return data;
  } catch (err) {
    console.error("Failed to fetch weather:", err.message);
    throw err;
  }
}

export default function App() {
  const [city, setCity] = useState("Prishtina");

  async function handleSearch() {
    try {
      await fetchCurrentWeather(city);
    } catch (err) {
      console.error("Error:", err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Test (Console Only)</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city..."
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Fetch Weather</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  input: {
    width: "90%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    width: "90%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#007BFF",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
