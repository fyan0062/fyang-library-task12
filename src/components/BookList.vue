<script setup>
import { ref, onMounted } from 'vue'
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocsFromServer,
} from 'firebase/firestore'
import db from '../firebase/init.js'

const books = ref([])
const loading = ref(false)
const errorMessage = ref('')

const fetchBooks = async () => {
    if (loading.value) return

    loading.value = true
    errorMessage.value = ''

    try {
        const booksQuery = query(
            collection(db, 'books'),
            where('isbn', '>', 1000),
            orderBy('isbn', 'desc'),
            limit(3),
        )

        const snapshot = await getDocsFromServer(booksQuery)

        books.value = snapshot.docs.map((document) => ({
            ...document.data(),
            id: document.id,
        }))
    } catch (error) {
        books.value = []
        console.error('Error fetching books:', error.code)
        errorMessage.value =
            'Unable to load books. Please check permissions and connection.'
    } finally {
        loading.value = false
    }
}

onMounted(fetchBooks)
</script>

<template>
    <section class="mt-5 border-top pt-4">
        <h2 class="h4 mb-3">Books with ISBN &gt; 1000</h2>

        <p class="text-muted">
            Sorted by ISBN descending · Maximum 3 results
        </p>

        <button class="btn btn-outline-primary mb-3" :disabled="loading" @click="fetchBooks">
            {{ loading ? 'Loading...' : 'Refresh Books' }}
        </button>

        <p v-if="loading">Loading books...</p>

        <div v-else-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
        </div>

        <p v-else-if="books.length === 0">
            No books match this query.
        </p>

        <ul v-else class="list-group">
            <li v-for="book in books" :key="book.id" class="list-group-item">
                {{ book.name }} (ISBN: {{ book.isbn }})
            </li>
        </ul>
    </section>
</template>