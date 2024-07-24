<!-- src/views/TypingGame.vue -->
<template>
    <div class="typing-game">
      <h1>KeyClash Typing Game</h1>
      <div class="game-area">
        <p class="text-to-type">{{ currentText }}</p>
        <input
          v-model="userInput"
          @input="checkInput"
          :disabled="!gameStarted || gameEnded"
          placeholder="Type here..."
        />
        <button @click="startGame" v-if="!gameStarted">Start Game</button>
        <p v-if="gameEnded">Game Over! Your WPM: {{ wpm }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    name: 'TypingGame',
    setup() {
      const texts = [
        "The quick brown fox jumps over the lazy dog.",
        "Programming is the art of telling another human what one wants the computer to do.",
        "The only way to learn a new programming language is by writing programs in it.",
      ];
  
      const currentText = ref('');
      const userInput = ref('');
      const gameStarted = ref(false);
      const gameEnded = ref(false);
      const startTime = ref(0);
      const endTime = ref(0);
  
      const wpm = computed(() => {
        if (!gameEnded.value) return 0;
        const timeInMinutes = (endTime.value - startTime.value) / 60000;
        const wordsTyped = currentText.value.split(' ').length;
        return Math.round(wordsTyped / timeInMinutes);
      });
  
      function startGame() {
        currentText.value = texts[Math.floor(Math.random() * texts.length)];
        userInput.value = '';
        gameStarted.value = true;
        gameEnded.value = false;
        startTime.value = Date.now();
      }
  
      function checkInput() {
        if (userInput.value === currentText.value) {
          endTime.value = Date.now();
          gameEnded.value = true;
        }
      }
  
      return {
        currentText,
        userInput,
        gameStarted,
        gameEnded,
        wpm,
        startGame,
        checkInput,
      };
    },
  };
  </script>
  
  <style scoped>
  .typing-game {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .game-area {
    margin-top: 20px;
  }
  
  .text-to-type {
    font-size: 1.2em;
    margin-bottom: 20px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
  }
  </style>