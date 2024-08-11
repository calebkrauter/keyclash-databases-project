<template>
  <div class="game-container">
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
        <button @click="startGame" v-if="!gameStarted && roundsEnded" :class="{'play-btn': true}">Start Game</button>
        <p style="margin-top: 40px;" v-if="pasteToWin">We don't allow PASTE TO WIN...</p>
      </div>
    </div>
    <Leaderboard :scores="leaderboardScores" />
  </div>
</template>
  
  <script setup>
    import { ref, computed } from 'vue';
    import Leaderboard from '@/components/Leaderboard.vue';
    // Reference: ChatGPT4o was used to generate random data and simple code to house it for generating sentences.
    const nouns = [
      "cat", "dog", "car", "house", "tree", "computer", "book", "phone", "river", "mountain",
      "child", "teacher", "city", "ocean", "star", "bicycle", "flower", "shoe", "bird", "pencil"
    ];
    const leaderboardScores = ref([
    { name: 'Player 1', score: 50 },
    { name: 'Player 2', score: 45 },
    { name: 'Player 3', score: 40 },
    { name: 'Player 4', score: 35 },
    { name: 'Player 5', score: 30 },
  ]);

    const verbs = [
      "run", "jump", "swim", "drive", "read", "write", "sing", "dance", "cook", "play",
      "study", "teach", "paint", "draw", "build", "fix", "throw", "catch", "fly", "climb"
    ];

    const adjectives = [
      "happy", "sad", "bright", "dark", "tall", "short", "fast", "slow", "loud", "quiet",
      "hot", "cold", "new", "old", "young", "strong", "weak", "smooth", "rough", "soft"
    ];

    const adverbs = [
      "quickly", "slowly", "loudly", "quietly", "happily", "sadly", "gracefully", "clumsily", "brightly", "darkly",
      "bravely", "cowardly", "calmly", "angrily", "easily", "hardly", "warmly", "coldly", "seriously", "jokingly"
    ];

    const pronouns = [
      "he", "she", "it", "they", "we", "I", "you", "him", "her", "them",
      "us", "me", "myself", "yourself", "himself", "herself", "itself", "ourselves", "yourselves", "themselves"
    ];

    const prepositions = [
      "in", "on", "at", "by", "with", "about", "against", "between", "into", "through",
      "during", "before", "after", "above", "below", "to", "from", "up", "down", "out"
    ];

    const conjunctions = [
      "and", "but", "or", "so", "because", "although", "since", "if", "when", "while",
      "where", "after", "before", "until", "unless", "whether", "though", "once", "than", "even though"
    ];

    const modals = [
      "can", "could", "may", "might", "must", "shall", "should", "will", "would", "ought to",
      "have to", "need to", "used to", "be able to", "be going to", "would like to", "shall", "will", "should", "might"
    ];

    const infinitives = [
      "to run", "to jump", "to swim", "to drive", "to read", "to write", "to sing", "to dance", "to cook", "to play",
      "to study", "to teach", "to paint", "to draw", "to build", "to fix", "to throw", "to catch", "to fly", "to climb"
    ];

    const gerunds = [
      "running", "jumping", "swimming", "driving", "reading", "writing", "singing", "dancing", "cooking", "playing",
      "studying", "teaching", "painting", "drawing", "building", "fixing", "throwing", "catching", "flying", "climbing"
    ];
    const items = [
      "chair", "table", "lamp", "sofa", "bed", "desk", "cabinet", "television", "rug", "shelf",
      "couch", "dresser", "stove", "microwave", "refrigerator", "toaster", "blender", "coffee maker", "oven", "bookshelf"
    ];

    const tenseWords = [
      "present",    // e.g., "run"
      "past",       // e.g., "ran"
      "future",     // e.g., "will run"
      "presentContinuous", // e.g., "running"
      "pastContinuous",    // e.g., "was running"
      "presentPerfect",    // e.g., "have run"
      "pastPerfect",       // e.g., "had run"
      "futureContinuous",  // e.g., "will be running"
      "futurePerfect",     // e.g., "will have run"
      "conditional"        // e.g., "would run"
    ];
    const tensePostfixes = [
      "ing",        // Present Continuous, Gerunds
      "ed",         // Past Simple
      "s",          // Present Simple (third person singular)
      "en",         // Past Participle (e.g., "written")
      "will",       // Future Simple
      "was/were",   // Past Continuous
      "have/has",   // Present Perfect
      "had",        // Past Perfect
      "be",         // Future Continuous
      "would"       // Conditional
    ];

    let chooseTense = Math.floor(Math.random() * (tenseWords.length - 0) + 0);
    const wordIndexMax = 19;
    const wordIndexMin = 0;
    const multiplyer = (wordIndexMax - wordIndexMin) + wordIndexMin;
    const space = " ";
    const period = ".";
    const texts = [];
    const roundsToPlay = 3;
    const curRound = ref(0);

    
    function generateSentence() {
      return appendWord();
    }

    function appendWord() {
      let firstWord = "";
      let i = Math.floor(Math.random() * sentence.length);
      let text = "";
      for (let n = 0; n < sentence[i].length; n++) {
        if (n === 0) {
          firstWord = getWord(sentence[i][n]);
          firstWord = firstWord[0].toUpperCase() + firstWord.slice(1)
          text += firstWord;
        } else {
          console.log(sentence[i][n])
          text += space.concat(getWord(sentence[i][n]));
        }
      }
      text += period;
      return text;
    }

    function getWord(typeIndex) {
      return present[typeIndex][Math.floor(Math.random() * (present[typeIndex].length - 0) + 0)];
    }

    const currentText = ref('');
    const userInput = ref('');
    const userInputConstrained = ref('');
    const gameStarted = ref(false);
    const roundsEnded = ref(true);
    const gameEnded = ref(false);
    const pasteToWin = ref(false);
    const startTime = ref(0);
    const endTime = ref(0);
    let curWordIndex = 0;
    let curCharTextColor = "black";
    let pasteDoneOnce = false;
    const wpm = computed(() => {
      if (!gameEnded.value && !roundsEnded) return 0;
      const timeInMinutes = (endTime.value - startTime.value) / 60000;
      const wordsTyped = currentText.value.split(' ').length;
      return Math.round(wordsTyped / timeInMinutes);
    });

    function startGame() {
      if (curRound.value === 0) {
        startTime.value = Date.now();
      }
      texts.push(generateSentence());
      roundsEnded.value = false;
      currentText.value = texts[curRound.value];
      userInput.value = '';
      userInputConstrained.value = '';
      gameStarted.value = true;
      gameEnded.value = false;
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
        if (userInput.value[keysPressedIterator.value-1] === " " || userInput.value[keysPressedIterator.value-1] === undefined) {
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
        curRound.value++;
        if (curRound.value >= roundsToPlay) {
          endTime.value = Date.now();
          gameEnded.value = true;
          curWordIndex = 0;
          curRound.value = 0;
          keysPressedIterator.value = -1;
          pasteToWin.value = false;
          pasteDoneOnce = false;
          gameStarted.value = false;
          roundsEnded.value = true;
        } else {
          curWordIndex = 0;
          keysPressedIterator.value = -1;
          startGame();
        }
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
.game-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.typing-game {
  flex: 0 1 auto;
  max-width: 600px;
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
}

/* New styles for the leaderboard */
:deep(.leaderboard) {
  position: absolute;
  right: 0;
  top: 20px;
  width: 250px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>