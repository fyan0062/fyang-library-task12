<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">

        <h1 class="text-center">❤️ Library Registration Form</h1>

        <p class="text-center mb-4">
          Let's build some more advanced features into our form.
        </p>

        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>

              <input type="text" class="form-control" id="username" v-model="formData.username"
                @blur="() => validateName(true)" @input="() => validateName(false)" />

              <div v-if="errors.username" class="text-danger mt-1">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>

              <select class="form-select" id="gender" v-model="formData.gender" @change="validateGender(true)">
                <option disabled value="">Please select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <div v-if="errors.gender" class="text-danger mt-1">
                {{ errors.gender }}
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>

              <input type="password" class="form-control" id="password" v-model="formData.password"
                @blur="() => validatePassword(true)" @input="() => validatePassword(false)" />

              <div v-if="errors.password" class="text-danger mt-1">
                {{ errors.password }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="confirm-password" class="form-label">
                Confirm password
              </label>

              <input type="password" class="form-control" id="confirm-password" v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)" />

              <div v-if="errors.confirmPassword" class="text-danger mt-1">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input type="checkbox" class="form-check-input" id="isAustralian" v-model="formData.isAustralian"
                @change="validateResident(true)" />

              <label class="form-check-label" for="isAustralian">
                Australian Resident?
              </label>
            </div>

            <div v-if="errors.resident" class="text-danger mt-1">
              {{ errors.resident }}
            </div>
          </div>

          <div class="mb-3">

            <label for="reason" class="form-label">
              Reason for joining
            </label>

            <textarea class="form-control" id="reason" rows="4" v-model="formData.reason" @blur="validateReason(true)"
              @input="handleReasonInput"></textarea>

            <div v-if="errors.reason" class="text-danger mt-1">
              {{ errors.reason }}
            </div>

            <div v-if="friendMessage" class="text-success mt-1">
              {{ friendMessage }}
            </div>

          </div>

          <div class="mb-3">
            <label for="suburb" class="form-label">Suburb</label>

            <input type="text" class="form-control" id="suburb" v-bind:value="formData.suburb" />
          </div>

          <div class="text-center">

            <button type="submit" class="btn btn-primary me-2">
              Submit
            </button>

            <button type="button" class="btn btn-secondary" @click="clearForm">
              Clear
            </button>

          </div>

        </form>

        <div class="mt-5" v-if="submittedCards.length">
          <h2 class="text-center mb-3">Submitted Library Members</h2>

          <DataTable :value="submittedCards" paginator :rows="5" stripedRows showGridlines
            tableStyle="min-width: 50rem">
            <Column field="username" header="Username" sortable />

            <Column field="password" header="Password" />

            <Column header="Australian Resident">
              <template #body="{ data }">
                {{ data.isAustralian ? 'Yes' : 'No' }}
              </template>
            </Column>

            <Column field="gender" header="Gender" sortable />

            <Column field="reason" header="Reason for joining" />
          </DataTable>
        </div>

      </div>


    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton'
})

const submittedCards = ref([])

const friendMessage = ref('')

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateResident(true)
  validateGender(true)
  validateReason(true)

  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.resident &&
    !errors.value.gender &&
    !errors.value.reason
  ) {
    submittedCards.value.push({
      ...formData.value
    })

    clearForm()
    friendMessage.value = ''
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.value.password =
        `Password needs at least ${minLength} characters`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.value.password =
        'Password needs at least one uppercase letter'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.value.password =
        'Password needs at least one lowercase letter'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.value.password =
        'Password needs at least one number'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.value.password =
        'Password needs at least one special character'
    }
  } else {
    errors.value.password = null
  }
};

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) {
      errors.value.confirmPassword = 'Passwords do not match.'
    }
  } else {
    errors.value.confirmPassword = null
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton'
  }
  errors.value.username = null
  errors.value.password = null
  errors.value.confirmPassword = null
  errors.value.resident = null
  errors.value.gender = null
  errors.value.reason = null
  friendMessage.value = ''
};

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null,
});

const validateResident = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) {
      errors.value.resident =
        'Australian residency confirmation is required'
    }
  } else {
    errors.value.resident = null
  }
};

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) {
      errors.value.gender = 'Please select a gender'
    }
  } else {
    errors.value.gender = null
  }
};

const validateReason = (blur) => {
  const minimumLength = 10

  if (formData.value.reason.trim().length < minimumLength) {
    if (blur) {
      errors.value.reason =
        `Please explain your reason using at least ${minimumLength} characters`
    }
  } else {
    errors.value.reason = null
  }
};

const handleReasonInput = () => {
  validateReason(false)

  friendMessage.value = /\bfriend\b/i.test(formData.value.reason)
    ? 'Great to have a friend'
    : ''
}

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) {
      errors.value.username =
        'Username must contain at least 3 characters'
    }
  } else {
    errors.value.username = null
  }
}
</script>


<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #1752cf;
  color: rgb(177, 154, 154);
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>