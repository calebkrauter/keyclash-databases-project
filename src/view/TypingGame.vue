
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
        <button @click="startGame" v-if="!gameStarted && roundsEnded" :class="{'play-btn': true}">Start Game</button>
        <p style="margin-top: 40px;" v-if="pasteToWin">We don't allow PASTE TO WIN...</p>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref, computed } from 'vue';
    // Reference: Claude AI and ChatGPT4o/3 were used to help with word generation and simple code to house it.
    // TODO ask AI if the word types are correct.
    const present = [
      ['a', 'the'],
      ['he', 'she', 'it'],
      ['walks', 'runs', 'jumps', 'sings', 'dances', 'plays', 'reads', 'writes', 'eats', 'drinks', 'sleeps', 'works', 'talks', 'listens', 'thinks', 'feels', 'sees', 'hears', 'smells', 'touches', 'learns', 'teaches', 'explores', 'discovers', 'imagines', 'wonders', 'hopes', 'dreams', 'believes'],
      ['quickly', 'slowly', 'gracefully', 'happily', 'loudly', 'silently', 'easily', 'angrily', 'brightly', 'carefully', 'calmly', 'eagerly', 'sharply', 'quietly', 'gently', 'firmly', 'rapidly', 'smoothly', 'softly', 'boldly', 'secretly', 'roughly', 'cheerfully', 'awkwardly', 'nervously', 'constantly', 'rarely', 'frequently', 'suddenly', 'briefly', 'vividly', 'politely', 'warmly', 'gratefully', 'cautiously'],    ['fence', 'tree', 'ball', 'book', 'flower', 'tower', 'chair', 'car', 'cloud', 'river', 'mountain', 'house', 'sun', 'apple', 'desk', 'bird', 'moon', 'glass', 'cat', 'dog', 'pencil', 'table', 'window', 'door', 'street', 'clock', 'leaf', 'pond', 'butterfly', 'bicycle', 'computer', 'guitar', 'flower', 'hat'],    
      ['dog', 'cat', 'bird', 'person', 'child', 'woman', 'man', 'horse'],
      ["about","above","across","after","against","along","among","around","at","before","behind","below","beneath","beside","beyond","by","down","during","for","from","in","inside","into","like","near","off","on","onto","out","outside","over","through","to","toward","under","underneath","up","upon","with","within","without"],
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
    const startTime = ref(0);
    const endTime = ref(0);
    const API_URL = process.env.API_URL || 'http://localhost:5001'; 
    const pasteToWin = ref(false);
    const playTenRounds = ref(false);
    const highScoreOfDay = ref(false);
    const firstScoreOfDay = ref(false);
    const earlyBird = ref(false);
    const highWPM = ref(false);
    const slowPoke = ref(false);
    const easterEgg = ref(false);
    const perfectRun= ref(false);
    const perfectionist = ref(false);
    const username = ref('');

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
        handleAchievements();
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
        console.log(({
          achievements
          }));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.error('Achievement ERROR: ', err);
        err.value = 'Achievement failed. Please try again.';
      }
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

