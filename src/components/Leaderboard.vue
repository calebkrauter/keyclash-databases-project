<template>
  <div class="leaderboard">
    <h2>Leaderboard</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Highscore</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in leaderboardData" :key="index">
          <td>{{ user.ranking }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.highscore }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'http://localhost:5001';
const leaderboardData = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchLeaderboard = async () => {
  try {
    const response = await fetch(`${API_URL}/api/leaderboard`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    leaderboardData.value = data.data;
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    error.value = 'Failed to load leaderboard. Please try again later.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLeaderboard();
});
</script>

<style scoped>
.leaderboard {
  max-width: 600px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f8f8f8;
}

tr:hover {
  background-color: #e8e8e8;
}
</style>