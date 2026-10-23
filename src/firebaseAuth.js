import { ref, shallowRef } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDocFromServer } from 'firebase/firestore'
import { auth, db } from './firebase'

export const firebaseUser = shallowRef(null)
export const firebaseRole = ref(null)
export const roleLoading = ref(true)
export const roleError = ref('')

let sessionVersion = 0

const stopObserver = onAuthStateChanged(auth, async (user) => {
  const version = ++sessionVersion

  firebaseUser.value = user
  firebaseRole.value = null
  roleError.value = ''
  roleLoading.value = Boolean(user)

  if (!user) {
    console.log('Current Firebase user:', null)
    return
  }

  try {
    const snapshot = await getDocFromServer(
      doc(db, 'userRoles', user.uid)
    )

    if (version !== sessionVersion) return

    const role = snapshot.exists() ? snapshot.data().role : null

    if (role !== 'admin' && role !== 'member') {
      roleError.value = 'No valid role assigned. Contact the administrator.'
      return
    }

    firebaseRole.value = role

    console.log('Current Firebase user:', {
      uid: user.uid,
      email: user.email,
      role,
    })
  } catch (error) {
    if (version !== sessionVersion) return

    roleError.value = 'Unable to load your role. Please try again.'
    console.error('Role loading failed:', error.code)
  } finally {
    if (version === sessionVersion) {
      roleLoading.value = false
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    sessionVersion++
    stopObserver()
  })
}