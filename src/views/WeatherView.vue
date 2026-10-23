<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const apikey = import.meta.env.VITE_OPENWEATHER_API_KEY

const city = ref('')
const weatherData = ref(null)
const error = ref('')

const temperature = computed(() => {
    return weatherData.value
        ? weatherData.value.main.temp.toFixed(1)
        : null
})

const iconUrl = computed(() => {
    return weatherData.value
        ? `https://openweathermap.org/img/wn/${weatherData.value.weather[0].icon}@2x.png`
        : ''
})

const fetchWeatherData = async (url) => {
    error.value = ''
    weatherData.value = null

    try {
        const response = await axios.get(url)
        weatherData.value = response.data
    } catch (err) {
        error.value = 'Unable to fetch weather. Check the city name and API key.'
        console.error('Error fetching weather:', err)
    }
}

const fetchCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
        error.value = 'Your browser does not support location services.'
        return
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`
            await fetchWeatherData(url)
        },
        () => {
            error.value = 'Unable to get your location. Please allow location access.'
        }
    )
}

const searchByCity = async () => {
    if (!city.value.trim()) {
        error.value = 'Please enter a city name.'
        return
    }

    const cityName = encodeURIComponent(city.value.trim())
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}&units=metric`
    await fetchWeatherData(url)
}

onMounted(() => {
    fetchCurrentLocationWeather()
})
</script>

<template>
    <div class="container mt-4">
        <h1>WEATHER APP</h1>

        <div class="d-flex gap-2 my-3">
            <input v-model="city" type="text" class="form-control" placeholder="Enter city name, e.g. Clayton, AU" />
            <button class="btn btn-primary" @click="searchByCity">
                Search
            </button>
        </div>

        <p v-if="error" class="text-danger">{{ error }}</p>

        <main>
            <div v-if="weatherData">
                <h2>
                    {{ weatherData.name }}, {{ weatherData.sys.country }}
                </h2>

                <img :src="iconUrl" alt="Weather Icon" />
                <p>{{ temperature }} °C</p>
                <p>{{ weatherData.weather[0].description }}</p>
            </div>
        </main>
    </div>
</template>