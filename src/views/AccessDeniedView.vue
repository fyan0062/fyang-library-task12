<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <main class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 text-center">
                <div class="alert alert-danger">
                    <h1 class="h3">Access Denied</h1>

                    <p class="mb-0">
                        The username or password is incorrect.
                    </p>
                </div>

                <RouterLink to="/login" class="btn btn-primary">
                    Return to Login
                </RouterLink>
            </div>
        </div>
    </main>
</template>