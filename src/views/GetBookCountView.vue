<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const error = ref(null)

const functionUrl = 'https://us-central1-fit5032-ccce7.cloudfunctions.net/countBooks'

const getBookCount = async () => {
    count.value = null
    error.value = null

    if (!functionUrl) {
        error.value = 'Cloud Function URL has not been configured yet.'
        return
    }

    try {
        const response = await axios.get(functionUrl)
        count.value = response.data.count
    } catch (err) {
        error.value = 'Error fetching book count'
    }
}
</script>

<template>
    <div class="container mt-4">
        <h1>Book Counter</h1>

        <button class="btn btn-primary" @click="getBookCount">
            Get Book Count
        </button>

        <p v-if="count !== null" class="mt-3">
            Total number of books: {{ count }}
        </p>

        <p v-if="error" class="text-danger mt-3">
            {{ error }}
        </p>
    </div>
</template>

