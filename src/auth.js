import { ref } from 'vue'

export const isAuthenticated = ref(false)

export const login = (username, password) => {
  const isValid =
    username === 'student' &&
    password === 'Library123!'

  isAuthenticated.value = isValid
  return isValid
}

export const logout = () => {
  isAuthenticated.value = false
}