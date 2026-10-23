<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { collection, addDoc } from 'firebase/firestore'
import db from '../firebase/init.js'
import {
    firebaseUser,
    firebaseRole,
    roleLoading,
    roleError,
} from '../firebaseAuth'
import BookList from '../components/BookList.vue'
import BookManager from '../components/BookManager.vue'

const isbn = ref('')
const name = ref('')
const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const addBook = async () => {
    if (submitting.value) return

    successMessage.value = ''
    errorMessage.value = ''

    if (roleLoading.value || !firebaseUser.value ||
        firebaseRole.value !== 'admin') {
        errorMessage.value = 'Only administrators can add books.'
        return
    }

    const isbnText = String(isbn.value).trim()
    const isbnNumber = Number(isbnText)
    const bookName = name.value.trim()

    if (!/^[0-9]+$/.test(isbnText) ||
        !Number.isSafeInteger(isbnNumber) || isbnNumber <= 0) {
        errorMessage.value = 'Please enter a valid positive ISBN number.'
        return
    }

    if (!bookName || bookName.length > 200) {
        errorMessage.value = 'Book name is required (maximum 200 characters).'
        return
    }

    submitting.value = true

    try {
        const document = await addDoc(collection(db, 'books'), {
            isbn: isbnNumber,
            name: bookName,
        })

        successMessage.value =
            `Book added successfully! Name: ${bookName}; ` +
            `ISBN: ${isbnNumber}; Document ID: ${document.id}`

        isbn.value = ''
        name.value = ''
    } catch (error) {
        console.error('Error adding book:', error.code)
        errorMessage.value = 'Unable to add the book. Please check permissions and connection.'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="container mt-5" style="max-width: 600px">
        <h1 class="text-center mb-4">Add Book</h1>

        <div v-if="roleLoading" class="alert alert-info">
            Loading current user and role...
        </div>

        <div v-else-if="!firebaseUser" class="alert alert-warning">
            Please
            <RouterLink to="/FireLogin">sign in with Firebase</RouterLink>
            first.
        </div>

        <div v-else-if="roleError" class="alert alert-danger">
            {{ roleError }}
        </div>

        <div v-else-if="firebaseRole !== 'admin'" class="alert alert-warning">
            Only administrators can add books.
        </div>

        <form v-else @submit.prevent="addBook">
            <p>Current administrator: {{ firebaseUser.email }}</p>

            <div class="mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <input id="isbn" v-model="isbn" type="text" inputmode="numeric" pattern="[0-9]+" class="form-control"
                    required />
            </div>

            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input id="name" v-model="name" type="text" maxlength="200" class="form-control" required />
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="submitting">
                {{ submitting ? 'Adding...' : 'Add Book' }}
            </button>
        </form>

        <div v-if="successMessage" class="alert alert-success mt-3" style="overflow-wrap: anywhere">
            {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
        </div>

        <BookList v-if="!roleLoading && firebaseUser && firebaseRole === 'admin'" />

        <BookManager v-if="!roleLoading && firebaseUser && firebaseRole === 'admin'" />
    </div>
</template>