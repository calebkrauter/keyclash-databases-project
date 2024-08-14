<template>
  <Span class="game">
    <div class="stars-container"></div>
    <div class="typing-game">
      <h1>Let The Battle Begin!</h1>
      <div class="game-area">
        <p class="text-to-type">{{ currentText }}</p>
        <input v-model="userInput" v-show="gameStarted" @input="checkInput" @keydown="handleKeydown"
          :disabled="!gameStarted || gameEnded" placeholder="Type here..." style="color: transparent" />
        <!-- Reference for font from Google: https://fonts.google.com/selection/embed -->
        <p id="userInput" v-show="gameStarted" @keydown="handleKeydown" :style="inputTextStyle" style="margin-top: -55px;
          font-family: Righteous, sans-serif;
          font-weight: 400;
          font-style: normal;">{{ userInputConstrained }}</p>
        <p style="margin-top: 40px;" v-if="gameEnded">Game Over! Your WPM: {{ wpm }}</p>
        <button @click="startGame" v-if="!gameStarted && roundsEnded" :class="{ 'play-btn': true }">Start Game</button>
        <p style="margin-top: 40px;" v-if="pasteToWin">We don't allow PASTE TO WIN...</p>
      </div>
      <Leaderboard class="leaderboard" />
    </div>
  </Span>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
// Reference: Claude AI and ChatGPT4o/3 were used to help with word generation and simple code to house it.
// TODO ask AI if the word types are correct.
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/store';
import Leaderboard from '../components/Leaderboard.vue';

const userStore = useDataStore();
const { countClicks, countKeyPresses } = storeToRefs(userStore);
const { incrementClicks, incrementKeyPresses } = userStore;

window.onclick = () => {
  incrementClicks();
}

window.onkeydown = () => {
  incrementKeyPresses();
}

const present = [
  ['a', 'the'],
  ['he', 'she', 'it'],
  ['walks', 'runs', 'jumps', 'sings', 'dances', 'plays', 'reads', 'writes', 'eats', 'drinks', 'sleeps', 'works', 'talks', 'listens', 'thinks', 'feels', 'sees', 'hears', 'smells', 'touches', 'learns', 'teaches', 'explores', 'discovers', 'imagines', 'wonders', 'hopes', 'dreams', 'believes'],
  ['quickly', 'slowly', 'gracefully', 'happily', 'loudly', 'silently', 'easily', 'angrily', 'brightly', 'carefully', 'calmly', 'eagerly', 'sharply', 'quietly', 'gently', 'firmly', 'rapidly', 'smoothly', 'softly', 'boldly', 'secretly', 'roughly', 'cheerfully', 'awkwardly', 'nervously', 'constantly', 'rarely', 'frequently', 'suddenly', 'briefly', 'vividly', 'politely', 'warmly', 'gratefully', 'cautiously'],
  ['fence', 'tree', 'ball', 'book', 'flower', 'tower', 'chair', 'car', 'cloud', 'river', 'mountain', 'house', 'sun', 'apple', 'desk', 'bird', 'moon', 'glass', 'cat', 'dog', 'pencil', 'table', 'window', 'door', 'street', 'clock', 'leaf', 'pond', 'butterfly', 'bicycle', 'computer', 'guitar', 'flower', 'hat'],
  ['dog', 'cat', 'bird', 'person', 'child', 'woman', 'man', 'horse'],
  ["about", "above", "across", "after", "against", "along", "among", "around", "at", "before", "behind", "below", "beneath", "beside", "beyond", "by", "down", "during", "for", "from", "in", "inside", "into", "like", "near", "off", "on", "onto", "out", "outside", "over", "through", "to", "toward", "under", "underneath", "up", "upon", "with", "within", "without"],
  ["big", "small", "red", "blue", "green", "yellow", "tall", "short", "fast", "slow", "happy", "sad", "loud", "quiet", "soft", "hard", "new", "good", "bad", "beautiful", "ugly", "smart", "silly", "brave", "afraid", "strong", "weak", "warm", "cold", "dry", "wet", "rough", "smooth", "sharp", "dull", "heavy", "light", "narrow", "wide", "deep", "shallow", "bright", "dark", "clean", "dirty", "thin", "thick", "long", "short", "young", "modern", "cheap", "valuable", "worthless", "famous", "certain", "clear", "boring", "comfortable", "delicious", "disgusting", "dangerous", "safe"],
  ['is', 'seems', 'becomes', 'appears', 'feels', 'looks', 'sounds', 'smells', 'tastes', 'remains', 'grows', 'stays', 'turns', 'sits', 'stands', 'falls', 'fades', 'shines', 'feels', 'moves', 'acts', 'sounds', 'becomes', 'feels', 'grows', 'appears', 'looks', 'remains', 'seems', 'turns', 'stays', 'feels', 'appears', 'sounds', 'turns'],
  ['and', 'but', 'or'],
];
const wordType = {
  article: 0,
  person: 1,
  verb: 2,
  adverb: 3,
  objectNoun: 4,
  subject: 5,
  preposition: 6,
  adjective: 7,
  linkingVerb: 8,
  conjunction: 9,
}

const sentence = [
  [wordType.article, wordType.subject, wordType.adverb, wordType.verb, wordType.preposition, wordType.article, wordType.adjective, wordType.objectNoun],
  [wordType.person, wordType.verb, wordType.adverb, wordType.conjunction, wordType.linkingVerb, wordType.article, wordType.adjective, wordType.objectNoun],
]
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
      // console.log(sentence[i][n])
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
const startTime = ref(0);
const endTime = ref(0);
// const API_URL = process.env.API_URL || 'http://localhost:5001'; 
const API_URL = 'http://localhost:5001';
const pasteToWin = ref(false);
const playTenRounds = ref(false);
const highScoreOfDay = ref(false);
const firstScoreOfDay = ref(false);
const earlyBird = ref(false);
const highWPM = ref(false);
const slowPoke = ref(false);
const easterEgg = ref(false);
const perfectRun = ref(false);
const perfectionist = ref(false);
const username = ref('');
const completeUserInputText = ref('');
const completeText = ref('');

let curWordIndex = 0;
let curCharTextColor = "black";
let pasteDoneOnce = false;
let attemptedCharacters = 0;
let wordsTypedArray = [];
let wordsGivenArray = [];

const wpm = computed(() => {
  if (!gameEnded.value && !roundsEnded) return 0;
  const timeInMinutes = (endTime.value - startTime.value) / 60000;
  const wordsTyped = completeUserInputText.value.split(' ').length;

  return Math.round(wordsTyped / timeInMinutes);
});

function startGame() {
  if (curRound.value === 0) {
    startTime.value = Date.now();
  }
  texts.push(generateSentence());

  attemptedCharacters += texts[curRound.value].length;
  // console.log("cur count to attempt " + attemptedCharacters);

  roundsEnded.value = false;
  currentText.value = texts[curRound.value];
  userInput.value = '';
  userInputConstrained.value = '';
  gameStarted.value = true;
  gameEnded.value = false;
}
const keysPressedIterator = ref(0);
let backspacePressed = false;
let numOfWrongChars = 0;



function handleKeydown(event) {
  const userStore = useDataStore();
  const { countClicks, countKeyPresses, countWordsTyped, countCharactersTyped, countBackspaces } = storeToRefs(userStore);
  const { incrementKeyPresses, incrementWordsTyped, incrementCharactersTyped, incrementBackspaces } = userStore;

  incrementCharactersTyped();
  // console.log(countCharactersTyped);
  if (event.key === "Backspace" && event.key !== "Space") {
    if (userInput.value[keysPressedIterator.value - 1] !== " ") {
      incrementBackspaces();
      // console.log(countBackspaces);

      backspacePressed = true;
      keysPressedIterator.value = (userInput.value.split('')).length - 1;
      if (keysPressedIterator.value < -1) {
        keysPressedIterator.value = 0;
      }
    } else {
      event.preventDefault();
    }
  } else if (event.key === " ") {
    if (userInput.value[keysPressedIterator.value - 1] === " " || userInput.value[keysPressedIterator.value - 1] === undefined) {
      event.preventDefault();
    } else {
      incrementWordsTyped();
      // console.log(countWordsTyped);
      curWordIndex++;
    }
  } else if (event.ctrlKey && event.key === "v") {
    pasteToWin.value = true;
    handleAchievements();
    event.preventDefault();
  }
}

const inputTextStyle = computed(() => {
  let curKey = userInput.value.split('');
  return {
    color: curKey[keysPressedIterator.value - 1] ? curCharTextColor : "black",
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

    completeUserInputText.value += userInput.value;
    completeText.value += texts[curRound.value] + space;
    wordsGivenArray = completeText.value.split(' ');
    wordsTypedArray = completeUserInputText.value.split(' ');

    console.log(wordsGivenArray);
    console.log(wordsTypedArray);

    curRound.value++;
    if (curRound.value >= roundsToPlay) {
      for (let n = 0; n < wordsGivenArray.length; n++) {
        let curGivenWordLength = wordsGivenArray[n].split('').length;
        let curTypedWordLength = wordsTypedArray[n].split('').length;
        let longestCurWordLength = curGivenWordLength >= curTypedWordLength ? curGivenWordLength : curTypedWordLength;
        for (let m = 0; m < longestCurWordLength; m++) {
          if (wordsGivenArray[n].split('')[m] !== wordsTypedArray[n].split('')[m]) {
            numOfWrongChars++;
          }

        }
      }
      console.log("Number of incorrect characters typed = " + numOfWrongChars);

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
const handleAchievements = async () => {
  const achievements = {
    paste_to_win: pasteToWin.value,
    play_ten_rounds: playTenRounds.value,
    high_score_of_day: highScoreOfDay.value,
    first_score_of_day: firstScoreOfDay.value,
    early_bird: earlyBird.value,
    high_wpm: highWPM.value,
    slow_poke: slowPoke.value,
    easter_egg: easterEgg.value,
    perfect_run: perfectRun.value,
    perfectionist: perfectionist.value,
    username: username.value,
  }
  try {
    const response = await fetch(`${API_URL}/api/achievement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        achievements
      }),
    });
    // console.log(({
    //   achievements
    //   }));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (err) {
    console.error('Achievement ERROR: ', err);
    err.value = 'Achievement failed. Please try again.';
  }
}

function createStars() {
  const starsContainer = document.querySelector('.stars-container');
  const starCount = 30; // Reduced number of stars

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Randomize star size between 10px and 30px
    const size = Math.random() * 20 + 10;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Position stars randomly
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;

    // Randomize animation duration between 20s and 40s
    star.style.animationDuration = `${Math.random() * 20 + 20}s`;

    // Add a subtle twinkle effect
    star.style.animationDelay = `${Math.random() * 5}s`;

    starsContainer.appendChild(star);
  }
}

onMounted(() => {
  createStars();
});

</script>


<style scoped>
/* Global styles */

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Galactic background */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Galactic background */
.game {
  position: relative;
  background-color: #000011;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: starTwinkle 5s ease-in-out infinite alternate,
    starMove 30s linear infinite;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.7);
}

@keyframes starTwinkle {
  0% {
    opacity: 0.5;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes starMove {
  0% {
    transform: translateX(100vw);
  }

  100% {
    transform: translateX(-100vw);
  }
}

/* Typing game container */
.typing-game {
  max-width: 800px;
  width: 90%;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 2;
}

h1 {
  color: #333;
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.text-to-type {
  font-size: 1.4em;
  margin-bottom: 25px;
  color: #555;
  line-height: 1.6;
}

input {
  width: 100%;
  padding: 12px;
  font-size: 1.1em;
  margin-bottom: 25px;
  border: 2px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s ease;
  background-color: rgba(255, 255, 255, 0.8);
}

input:focus {
  outline: none;
  border-color: #F57E9A;
  box-shadow: 0 0 10px rgba(245, 126, 154, 0.5);
}

/* Play button */
.play-btn {
  padding: 12px 25px;
  font-size: 1.1em;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.play-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
}

@keyframes color-animation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.play-btn {
  background: linear-gradient(45deg, #FFC3A8, #F57E9A, #EB3E8C, #D61F77, #B70159,
      #8E44AD, #3498DB, #2ECC71, #F1C40F, #E67E22);
  background-size: 300% 300%;
  animation: color-animation 15s ease infinite;
}

/* User input display */
#userInput {
  font-family: 'Righteous', sans-serif;
  font-size: 1.2em;
  margin-top: -55px;
  min-height: 30px;
  color: #333;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* Game over message */
.game-over {
  font-size: 1.3em;
  font-weight: bold;
  color: #D61F77;
  margin-top: 20px;
  text-shadow: 0 0 10px rgba(214, 31, 119, 0.5);
}

/* Paste to win message */
.paste-warning {
  color: #E67E22;
  font-style: italic;
  margin-top: 15px;
  text-shadow: 0 0 5px rgba(230, 126, 34, 0.5);
}

/* Leaderboard component */
.leaderboard {
  margin-top: 40px;
  padding: 20px;
  background-color: rgba(249, 249, 249, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 255, 255, 0.5);
}
</style>
