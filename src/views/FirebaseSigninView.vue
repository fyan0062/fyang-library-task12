<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import {
    firebaseUser,
    firebaseRole,
    roleLoading,
    roleError,
} from '../firebaseAuth'

const email = ref('')
const password = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const submitting = ref(false)

const signIn = async () => {
    successMessage.value = ''
    errorMessage.value = ''
    submitting.value = true

    try {
        const credential = await signInWithEmailAndPassword(
            auth,
            email.value.trim(),
            password.value
        )

        successMessage.value = `Login successful: ${credential.user.email}`
        console.log('Firebase Login Successful!')
        password.value = ''
    } catch (error) {
        console.error('Firebase login failed:', error.code)
        errorMessage.value = 'Login failed. Check your email and password.'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="container mt-5" style="max-width: 600px">
        <h1 class="text-center mb-4">Firebase Login</h1>

        <form @submit.prevent="signIn">
            <div class="mb-3">
                <label for="login-email" class="form-label">Email</label>
                <input id="login-email" v-model="email" type="email" class="form-control" placeholder="Enter your email"
                    autocomplete="username" required />
            </div>

            <div class="mb-3">
                <label for="login-password" class="form-label">Password</label>
                <input id="login-password" v-model="password" type="password" class="form-control"
                    placeholder="Enter your password" autocomplete="current-password" required />
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="submitting || roleLoading">
                {{ submitting ? 'Signing in...' : 'Login with Firebase' }}
            </button>
        </form>

        <div v-if="successMessage" class="alert alert-success mt-3">
            {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
        </div>

        <div v-if="roleLoading" class="alert alert-info mt-3">
            Loading authentication and role...
        </div>

        <div v-else-if="roleError" class="alert alert-warning mt-3">
            {{ roleError }}
        </div>

        <section v-else-if="firebaseUser && firebaseRole" class="card mt-4">
            <div class="card-body">
                <p>Current user: {{ firebaseUser.email }}</p>
                <p>
                    Role:
                    <strong>{{ firebaseRole === 'admin' ? 'Admin' : 'Member' }}</strong>
                </p>

                <div v-if="firebaseRole === 'admin'">
                    <h2 class="h4">Admin Workspace</h2>
                    <p class="mb-0">You are signed in as an administrator.</p>
                </div>

                <div v-else-if="firebaseRole === 'member'">
                    <h2 class="h4">Member Workspace</h2>
                    <p class="mb-0">You are signed in as a member.</p>
                </div>
            </div>
        </section>
    </div>
</template>