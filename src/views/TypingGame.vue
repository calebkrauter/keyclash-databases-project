
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
    // Reference: ChatGPT4o was used to generate random data and simple code to house it for generating sentences.
    const nouns = [
      "cat", "dog", "car", "house", "tree", "computer", "book", "phone", "river", "mountain",
      "child", "teacher", "city", "ocean", "star", "bicycle", "flower", "shoe", "bird", "pencil"
    ];

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

    const wordIndexMax = 19;
    const wordIndexMin = 0;
    const multiplyer = (wordIndexMax - wordIndexMin) + wordIndexMin;
    const space = " ";
    const period = ".";
    console.log(Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin))
    const texts = [
        nouns[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + space + verbs[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + space + adverbs[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + period,
        nouns[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + space + verbs[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + space + adjectives[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + space + nouns[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + period,
        adverbs[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + space + nouns[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + space + verbs[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + space + items[Math.floor(Math.random() * (wordIndexMax - wordIndexMin) + wordIndexMin)] + period,
      ];

      /**   "Noun, Verb, Object",
  "Noun, Verb, Adverb",
  "Noun, Adjective, Noun, Verb",
  "Noun, Verb, Adjective, Noun",
  "Adverb, Noun, Verb, Object",
  "Noun, Verb, Prepositional Phrase",
  "Adjective, Noun, Verb, Adverb",
  "Noun, Modal Verb, Verb, Object",
  "Pronoun, Verb, Adverb",
  "Noun, Verb, Infinitive" */
  // Article? Adjective, adjective, noun, verb adverb article 
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

