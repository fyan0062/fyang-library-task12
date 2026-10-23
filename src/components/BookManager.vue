<script setup>
import { ref, onMounted } from 'vue'
import {
    collection,
    doc,
    getDocsFromServer,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore'
import db from '../firebase/init.js'
import { firebaseUser, firebaseRole, roleLoading } from '../firebaseAuth'

const books = ref([])
const loading = ref(false)
const busy = ref(false)
const editingId = ref(null)
const editIsbn = ref('')
const editName = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const checkAdmin = () => {
    if (roleLoading.value || !firebaseUser.value ||
        firebaseRole.value !== 'admin') {
        errorMessage.value = 'Only administrators can manage books.'
        return false
    }
    return true
}

const fetchBooks = async () => {
    if (loading.value || !checkAdmin()) return

    loading.value = true
    errorMessage.value = ''

    try {
        const snapshot = await getDocsFromServer(collection(db, 'books'))

        books.value = snapshot.docs.map((document) => ({
            ...document.data(),
            id: document.id,
        })).sort((a, b) => a.isbn - b.isbn)
    } catch (error) {
        books.value = []
        console.error('Error loading books:', error.code)
        errorMessage.value = 'Unable to refresh the book list.'
    } finally {
        loading.value = false
    }
}

const startEdit = (book) => {
    if (busy.value || loading.value || !checkAdmin()) return

    successMessage.value = ''
    errorMessage.value = ''
    editingId.value = book.id
    editIsbn.value = String(book.isbn)
    editName.value = book.name
}

const saveBook = async () => {
    if (busy.value || loading.value || !editingId.value ||
        !checkAdmin()) return

    successMessage.value = ''
    errorMessage.value = ''

    const isbnText = String(editIsbn.value).trim()
    const isbnNumber = Number(isbnText)
    const bookName = editName.value.trim()

    if (!/^[0-9]+$/.test(isbnText) ||
        !Number.isSafeInteger(isbnNumber) || isbnNumber <= 0) {
        errorMessage.value = 'Please enter a valid positive ISBN number.'
        return
    }

    if (!bookName || bookName.length > 200) {
        errorMessage.value = 'Book name is required (maximum 200 characters).'
        return
    }

    const bookId = editingId.value
    busy.value = true

    try {
        await updateDoc(doc(db, 'books', bookId), {
            isbn: isbnNumber,
            name: bookName,
        })

        successMessage.value =
            `Book updated successfully! Name: ${bookName}; ` +
            `ISBN: ${isbnNumber}; Document ID: ${bookId}`

        editingId.value = null
        await fetchBooks()
    } catch (error) {
        console.error('Error updating book:', error.code)
        errorMessage.value = 'Unable to update the book.'
    } finally {
        busy.value = false
    }
}

const deleteBook = async (book) => {
    if (busy.value || loading.value || !checkAdmin()) return

    const confirmed = window.confirm(
        `Delete "${book.name}" (ISBN: ${book.isbn})?\n` +
        'This cannot be undone from this page.',
    )
    if (!confirmed) return

    successMessage.value = ''
    errorMessage.value = ''
    busy.value = true

    try {
        await deleteDoc(doc(db, 'books', book.id))

        successMessage.value =
            `Book deleted successfully! Name: ${book.name}; ` +
            `ISBN: ${book.isbn}; Document ID: ${book.id}`

        if (editingId.value === book.id) editingId.value = null
        await fetchBooks()
    } catch (error) {
        console.error('Error deleting book:', error.code)
        errorMessage.value = 'Unable to delete the book.'
    } finally {
        busy.value = false
    }
}

onMounted(fetchBooks)
</script>

<template>
    <section class="mt-5 border-top pt-4">
        <h2 class="h4 mb-3">Admin Book Management</h2>
        <p class="text-muted">All books · Edit or delete a record</p>

        <div v-if="successMessage" class="alert alert-success text-break">
            {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
        </div>

        <button type="button" class="btn btn-outline-primary mb-3" :disabled="loading || busy || editingId !== null"
            @click="fetchBooks">
            {{ loading ? 'Loading...' : 'Refresh All Books' }}
        </button>

        <p v-if="loading">Loading books...</p>
        <p v-else-if="!errorMessage && books.length === 0">No books found.</p>

        <div v-for="book in books" :key="book.id" class="card mb-3">
            <div class="card-body">
                <p class="small text-muted text-break">
                    Document ID: {{ book.id }}
                </p>

                <form v-if="editingId === book.id" @submit.prevent="saveBook">
                    <label :for="'edit-isbn-' + book.id" class="form-label">
                        ISBN
                    </label>
                    <input :id="'edit-isbn-' + book.id" v-model="editIsbn" type="text" inputmode="numeric"
                        pattern="[0-9]+" class="form-control mb-3" :disabled="busy" required />

                    <label :for="'edit-name-' + book.id" class="form-label">
                        Name
                    </label>
                    <input :id="'edit-name-' + book.id" v-model="editName" type="text" maxlength="200"
                        class="form-control mb-3" :disabled="busy" required />

                    <button type="submit" class="btn btn-success me-2" :disabled="busy">
                        {{ busy ? 'Saving...' : 'Save' }}
                    </button>
                    <button type="button" class="btn btn-secondary" :disabled="busy" @click="editingId = null">
                        Cancel
                    </button>
                </form>

                <div v-else>
                    <p>{{ book.name }} (ISBN: {{ book.isbn }})</p>

                    <button type="button" class="btn btn-outline-primary me-2"
                        :disabled="busy || loading || editingId !== null" @click="startEdit(book)">
                        Edit
                    </button>
                    <button type="button" class="btn btn-outline-danger"
                        :disabled="busy || loading || editingId !== null" @click="deleteBook(book)">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>