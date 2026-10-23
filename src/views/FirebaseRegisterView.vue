<template>
    <div class="container mt-5" style="max-width: 600px">
        <h1 class="text-center mb-4">Create an Account</h1>

        <form @submit.prevent="register">
            <div class="mb-3">
                <label for="register-email" class="form-label">Email</label>
                <input id="register-email" v-model="email" type="email" class="form-control"
                    placeholder="Enter your email" required />
            </div>

            <div class="mb-3">
                <label for="register-password" class="form-label">Password</label>
                <input id="register-password" v-model="password" type="password" class="form-control"
                    placeholder="Enter your password" minlength="6" required />
            </div>

            <button type="submit" class="btn btn-primary w-100">
                Save to Firebase
            </button>

            <div v-if="successMessage" class="alert alert-success mt-3">
                {{ successMessage }}
            </div>

            <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const router = useRouter()
const auth = getAuth()

const register = () => {
    successMessage.value = ''
    errorMessage.value = ''

    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            console.log('Firebase Register Successful!', {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
            })
            successMessage.value = 'Registration successful! Redirecting to login...'

            setTimeout(() => {
                router.push('/FireLogin')
            }, 1000)
        })
        .catch((error) => {
            console.error(error.code)
            errorMessage.value = error.message
        })
}
</script>