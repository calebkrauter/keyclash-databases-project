<template>
  <div class="login-form">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, useDataStore } from '@/store';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useDataStore();

const { isLoggedIn } = storeToRefs(authStore);
const { countClicks, countKeyPresses } = storeToRefs(userStore);
const { incrementClicks, incrementKeyPresses } = userStore;

const email = ref('');
const password = ref('');
const error = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    await authStore.login({ email: email.value, password: password.value });
    
    successMessage.value = 'Login successful!';
    
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/');
    }, 1000);
  } catch (err) {
    console.error('Login failed:', err);
    error.value = err.message || 'Login failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const handleClick = () => {
  incrementClicks();
  console.log(countClicks.value);
};

const handleKeyDown = () => {
  incrementKeyPresses();
  console.log(countKeyPresses.value);
};

onMounted(() => {
  window.addEventListener('click', handleClick);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClick);
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.login-form {
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>