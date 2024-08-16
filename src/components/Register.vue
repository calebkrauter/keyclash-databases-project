<template>
  <div class="register-form">
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <button type="submit" :disabled="isLoading">{{ isLoading ? 'Registering...' : 'Register' }}</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore, useAuthStore } from '@/store';
// import { API_URL } from '@/config';

const userStore = useDataStore();

const authStore = useAuthStore();
const { isLoggedIn, login } = storeToRefs(authStore)
const { countClicks, countKeyPresses, timeOfRegistration } = storeToRefs(userStore);
const { incrementClicks, incrementKeyPresses, getTimeSinceRegister } = userStore;

window.onclick = () => {
  incrementClicks();
  console.log(countClicks);
}

window.onkeydown = () => {
  incrementKeyPresses();
  console.log(countKeyPresses);
}

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const hashedPassword = ref('');
const confirmPassword = ref('');
const error = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const API_URL = 'http://localhost:5001';


const handleRegister = async (name, email, password, confirmPassword) => {
  const error = ref('');
  const successMessage = ref('');
  const isLoading = ref(false);
  const router = useRouter();
  const authStore = useAuthStore();

  const validateInputs = () => {
    if (!name.value || !email.value || !password.value || !confirmPassword.value) {
      throw new Error('All fields are required');
    }
    if (password.value !== confirmPassword.value) {
      throw new Error('Passwords do not match');
    }
    if (password.value.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/\S+@\S+\.\S+/.test(email.value)) {
      throw new Error('Invalid email format');
    }
  };

  const registerUser = async () => {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: name.value,
        email: email.value,
        password_hash: password.value
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  try {
    isLoading.value = true;
    validateInputs();

    const data = await registerUser();
    console.log('User registered:', data);
    successMessage.value = 'Registration successful!';

    await authStore.login({ email: email.value, password: password.value });

    // Clear form fields
    name.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';

    // Redirect after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1000);
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }

  return { error: error.value, successMessage: successMessage.value, isLoading: isLoading.value };
};

</script>

<style scoped>
.register-form {
  max-width: 300px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}
</style>