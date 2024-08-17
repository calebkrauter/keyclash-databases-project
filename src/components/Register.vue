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
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useDataStore, useAuthStore } from '@/store';

  const API_URL = 'http://localhost:5001';

  const router = useRouter();
  const userStore = useDataStore();
  const authStore = useAuthStore();

  const { isLoggedIn } = storeToRefs(authStore);
  const { countClicks, countKeyPresses, timeOfRegistration } = storeToRefs(userStore);
  const { incrementClicks, incrementKeyPresses, getTimeSinceRegister } = userStore;

  const name = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const error = ref('');
  const successMessage = ref('');
  const isLoading = ref(false);

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
  console.log('Sending registration data:', {
    username: name.value,
    email: email.value,
    password: password.value  // Changed from password_hash to password
  });

  const response = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: name.value, 
      email: email.value,
      password: password.value  // Changed from password_hash to password
    }),
  });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Server response:', responseData);
      throw new Error(responseData.error || `HTTP error! status: ${response.status}, message: ${JSON.stringify(responseData)}`);
    }

    return responseData;
  };

  const handleRegister = async () => {
    error.value = '';
    successMessage.value = '';
    isLoading.value = true;

    try {
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

      getTimeSinceRegister();

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