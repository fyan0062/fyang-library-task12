<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { firebaseUser, roleLoading } from '../firebaseAuth'

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const logoutFirebase = async () => {
    submitting.value = true
    successMessage.value = ''
    errorMessage.value = ''

    try {
        await signOut(auth)

        if (auth.currentUser !== null) {
            throw new Error('User is still signed in.')
        }

        console.log('Firebase Logout Successful!')
        console.log('auth.currentUser after logout:', auth.currentUser)
        successMessage.value = 'You have successfully logged out of Firebase.'
    } catch (error) {
        console.error('Firebase logout failed:', error.code || error.message)
        errorMessage.value = 'Logout failed. Please try again.'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="container mt-5 text-center" style="max-width: 600px">
        <h1 class="mb-4">Firebase Logout</h1>

        <p v-if="roleLoading">Loading current session...</p>
        <p v-else-if="firebaseUser">
            Current user: {{ firebaseUser.email }}
        </p>
        <p v-else>Current user: none (signed out)</p>

        <button v-if="firebaseUser" type="button" class="btn btn-danger" :disabled="submitting || roleLoading"
            @click="logoutFirebase">
            {{ submitting ? 'Logging out...' : 'Logout from Firebase' }}
        </button>

        <div v-if="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
        </div>

        <RouterLink to="/FireLogin" class="btn btn-primary mt-3">
            Return to Firebase Login
        </RouterLink>
    </div>
</template>