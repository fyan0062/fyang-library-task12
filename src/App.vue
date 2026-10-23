<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()

const showHeader = computed(() => {
  return route.name !== 'CountBookAPI' &&
    route.name !== 'GetAllBookAPI'
})
</script>

<template>
  <BHeader v-if="showHeader" />
  <RouterView />
</template>