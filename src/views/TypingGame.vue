
<template>

    <div class="typing-game">
      <h1>Let The Battle Begin!</h1>
      <div class="game-area">
        <p class="text-to-type">{{ currentText }}</p>
        <input
          v-model="userInput"
          v-show="gameStarted"
          @input="checkInput"
          @keydown="handleKeydown"
          :disabled="!gameStarted || gameEnded"
          placeholder="Type here..."
          style="color: transparent"
        />
        <!-- Reference for font from Google: https://fonts.google.com/selection/embed -->
        <p 
          id="userInput" 
          v-show="gameStarted"
          @keydown="handleKeydown"
          :style="inputTextStyle"
          style="margin-top: -55px;
          font-family: Righteous, sans-serif;
          font-weight: 400;
          font-style: normal;"
        >{{userInputConstrained}}</p>
        <p style="margin-top: 40px;" v-if="gameEnded">Game Over! Your WPM: {{ wpm }}</p>
        <button @click="startGame" v-if="!gameStarted" :class="{'play-btn': true}">Start Game</button>
        <p style="margin-top: 40px;" v-if="pasteToWin">We don't allow PASTE TO WIN...</p>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref, computed } from 'vue';
    const texts = [
        "The quick brown fox jumps over the lazy dog.",
        "Programming is the art of telling another human what one wants the computer to do.",
        "The only way to learn a new programming language is by writing programs in it.",
      ];
  
      const currentText = ref('');
      const userInput = ref('');
      const userInputConstrained = ref('');
      const gameStarted = ref(false);
      const gameEnded = ref(false);
      const pasteToWin = ref(false);
      const startTime = ref(0);
      const endTime = ref(0);
      let curWordIndex = 0;
      let curCharTextColor = "black";
      let pasteDoneOnce = false;
      const wpm = computed(() => {
        if (!gameEnded.value) return 0;
        const timeInMinutes = (endTime.value - startTime.value) / 60000;
        const wordsTyped = currentText.value.split(' ').length;
        return Math.round(wordsTyped / timeInMinutes);
      });

      function startGame() {
        currentText.value = texts[Math.floor(Math.random() * texts.length)];
        userInput.value = '';
        userInputConstrained.value = '';
        gameStarted.value = true;
        gameEnded.value = false;
        startTime.value = Date.now();
      }
      const keysPressedIterator = ref(0);
      let backspacePressed = false;
      function handleKeydown(event) {
        if (event.key === "Backspace" && event.key !== "Space") {
          if (userInput.value[keysPressedIterator.value-1] !== " ") {
            backspacePressed = true;
            keysPressedIterator.value = (userInput.value.split('')).length -1;
            if (keysPressedIterator.value < -1) {
              keysPressedIterator.value = 0;
            }
          } else {
            event.preventDefault();
          }
        } else if (event.key === " ") {
          if (userInput.value[keysPressedIterator.value-1] === " ") {
            event.preventDefault();
          } else {
            curWordIndex++;
          }
        } else if (event.ctrlKey && event.key === "v") {
          pasteToWin.value = true;
          event.preventDefault();
        }
      }
      const inputTextStyle = computed(() => {
        let curKey = userInput.value.split('');
        return {
          color: curKey[keysPressedIterator.value-1] ? curCharTextColor : "black",
        };
      });

      function checkInput() {  
        let userInputChar = userInput.value.split('');
        let curWord = userInput.value.split(' ');
        userInputConstrained.value = curWord[curWordIndex];
        let charsToType = currentText.value.split('') 
        let inputChar = userInputChar[keysPressedIterator.value]
        if (inputChar === charsToType[keysPressedIterator.value]) { 
            curCharTextColor = "green";
        } else {
          curCharTextColor = "red";
        }
        if (curWordIndex >= currentText.value.split(' ').length) {
          endTime.value = Date.now();
          gameEnded.value = true;
          curWordIndex = 0;
          keysPressedIterator.value = -1;
          pasteToWin.value = false;
          pasteDoneOnce = false;
          gameStarted.value = false;
        }        
        if (!backspacePressed) {
          keysPressedIterator.value++;
        } else {
          keysPressedIterator.value = userInputChar.length;
          backspacePressed = false;
        }
        if (userInputChar.length <= 0) {
          keysPressedIterator.value = 0;
        }
      }
 
      if (gameStarted.value) {
        gameStarted.value = false;
      }
  
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
    width: 20%;
    padding: 10px;
    font-size: 1em;
    margin-bottom: 20px;
    background-color: #fafcff;
    border-color: black;
    border-radius: 10px;
  }

  button {
    padding: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    border-radius: 10px;
  }
}

function handleKeydown(event) {
  if (event.key === "Backspace") {
    backspacePressed.value = true;
    keysPressedIterator.value = (userInput.value.split('')).length - 1;
    if (keysPressedIterator.value < -1) {
      keysPressedIterator.value = 0;
    }
  } else if (event.ctrlKey && event.key === "v") {
    pasted.value = true;
  }
}

const inputTextStyle = computed(() => {
  return {
    color: userInput.value ? curCharTextColor.value : "black",
  };
});

watch(gameEnded, (isEnded) => {
  if (isEnded) {
    gameStarted.value = false;
  }
});
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

@keyframes color-animation {
  0% {
    background-position: 0% 0%;
  }

  100% {
    background-position: 100% 100%;

  }
}

.play-btn {
  background: linear-gradient(45deg, #FFC3A8, #F57E9A, #EB3E8C, #D61F77, #B70159,
      #8E44AD, #3498DB, #2ECC71, #F1C40F, #E67E22, #FFC3A8, #E67E22);
  background-size: 300% 200%;
  animation: color-animation 5s ease infinite alternate;
}

.input {
  border: 2px solid yellow;
  /* Example style for the class */
}
</style>

