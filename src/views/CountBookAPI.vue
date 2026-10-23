<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const error = ref(null)

const getBookCountAPI = async () => {
    try {
        const response = await axios.get(
            'https://us-central1-fit5032-ccce7.cloudfunctions.net/countBooks'
        )
        jsondata.value = JSON.stringify(response.data, null, 2)
        error.value = null
    } catch (err) {
        error.value = 'Error fetching book count'
        jsondata.value = null
    }
}

onMounted(() => {
    getBookCountAPI()
})
</script>

<template>
    <p v-if="error">{{ error }}</p>
    <pre v-if="jsondata !== null">{{ jsondata }}</pre>
</template>