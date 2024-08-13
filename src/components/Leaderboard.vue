<template>
    <div class="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        <li v-for="(score, index) in scores" :key="index">
          {{ score.name }}: {{ score.score }} WPM
        </li>
      </ul>
    </div>
  </template>

  <script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    scores: {
      type: Array,
      required: true
    }
  });
  </script>

  <style scoped>
  .leaderboard {
    width: 200px;
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 10px;
    text-align: center;
  }

  h2 {
    margin-top: 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }
  </style>