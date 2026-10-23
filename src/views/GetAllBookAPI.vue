<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const error = ref(null)

const getAllBooksAPI = async () => {
    try {
        const response = await axios.get(
            'https://us-central1-fit5032-ccce7.cloudfunctions.net/getAllBooks'
        )
        jsondata.value = JSON.stringify(response.data, null, 2)
        error.value = null
    } catch (err) {
        error.value = 'Error fetching all books'
        jsondata.value = null
    }
}

onMounted(() => {
    getAllBooksAPI()
})
</script>

<template>
    <p v-if="error">{{ error }}</p>
    <pre v-if="jsondata !== null">{{ jsondata }}</pre>
</template>
