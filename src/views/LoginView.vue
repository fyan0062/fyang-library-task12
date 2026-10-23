<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../auth'

const username = ref('')
const password = ref('')

const router = useRouter()
const route = useRoute()

const handleLogin = () => {
    const loginSuccessful = login(username.value, password.value)

    if (loginSuccessful) {
        const destination =
            typeof route.query.redirect === 'string'
                ? route.query.redirect
                : '/about'

        router.push(destination)
    } else {
        router.push('/access-denied')
    }
}
</script>

<template>
    <main class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <h1 class="text-center mb-4">Member Login</h1>

                <form @submit.prevent="handleLogin">
                    <div class="mb-3">
                        <label for="login-username" class="form-label">
                            Username
                        </label>

                        <input id="login-username" v-model.trim="username" type="text" class="form-control"
                            autocomplete="username" required />
                    </div>

                    <div class="mb-3">
                        <label for="login-password" class="form-label">
                            Password
                        </label>

                        <input id="login-password" v-model="password" type="password" class="form-control"
                            autocomplete="current-password" required />
                    </div>

                    <button type="submit" class="btn btn-primary w-100">
                        Login
                    </button>
                </form>

                <p class="text-muted text-center mt-3">
                    Demo account: student / Library123!
                </p>
            </div>
        </div>
    </main>
</template>