<template>

  <div class="home">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="initial-content">
        <h1 v-if="authStore.isLoggedIn === false" class="typing-animation">Welcome to KeyClash</h1>
        <h1 v-if="authStore.isLoggedIn === true" class="typing-animation">Welcome {{ authStore.user }}</h1>
        <p class="typing-animation">
          <span class="hidden">Discover the ultimate typing challenge!</span>
        </p>
        <button @click="startGame" class="fade-in">Play Game</button>
      </div>
    </section>

    <!-- about-game Section -->
    <section id="about-game" class="about-game-section">
      <div class="animated-background"></div>
      <span class="about-game-content">
        <h2 ref="aboutTitle" class="typing-text">What is KeyClash</h2>
        <h4 ref="aboutDescription" class="typing-text">
          KeyClash is a typing game where you battle online for high rankings based on your WPM.
          <br>Don't get too mad at our proprietary sentence generation, he's still in his infancy...
          <br>He also likes to collect your data which you can view in your account stats.
        </h4>

      </span>
    </section>
    <div class="meet-team-wrapper">
    <div class="background-animation">
      <div v-for="n in 20" :key="`circle-${n}`" class="circle"></div>
      <div v-for="(key, index) in keys" :key="`key-${index}`" class="key" :style="key.style">
        {{ key.letter }}
      </div>
      <div v-for="(word, index) in words" :key="`word-${index}`" class="word" :class="{ 'typing': word.isTyping }" :style="word.style">
        <span v-for="(letter, letterIndex) in word.text" :key="`letter-${letterIndex}`" 
              :class="{ 'typed': letterIndex < word.typedLength }">
          {{ letter }}
        </span>
      </div>
    </div>
    <Teamsection />
  </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';
import Teamsection from '@/components/Teamsection.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/store';
const API_URL = 'http://localhost:5001';
const userStore = useDataStore();
const { incrementClicks, incrementKeyPresses } = userStore;

window.onclick = () => {
  incrementClicks();
}

window.onkeydown = () => {
  incrementKeyPresses();
}
const router = useRouter();
const authStore = useAuthStore();
const { isLoggedIn, username } = storeToRefs(authStore);
const user = authStore.user;
const teamSection = ref(null);
const popOutText = ref(null);
const handleScroll = () => {
  if (teamSection.value) {
    const rect = teamSection.value.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      teamSection.value.classList.add('reveal');
    }
  }

  // Existing pop-out text animation logic
  const popOutTexts = document.querySelectorAll('.pop-out-text');
  popOutTexts.forEach((element) => {
    const position = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.1;

    if (position < screenPosition) {
      element.classList.add('visible');
    } else {
      element.classList.remove('visible');
    }
  });
};
const aboutTitle = ref(null);
const aboutDescription = ref(null);

const startTypingAnimation = (element, delay = 0) => {
  if (element.value) {
    const text = element.value.textContent;
    element.value.textContent = '';
    let i = 0;
    setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          element.value.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50); // Adjust typing speed here
    }, delay);
  }
};
const randomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

const createFloatingElement = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${Math.random() * 20 + 40}s`
});

const keys = ref(Array.from({ length: 15 }, () => ({
  letter: randomLetter(),
  style: createFloatingElement()
})));

const wordList = ['TYPE', 'FAST', 'GAME', 'SKILL', 'SPEED', 'LEARN', 'IMPROVE', 'PRACTICE', 'CHALLENGE', 'KEYBOARD'];

const words = ref(wordList.map((word) => ({
  text: word,
  isTyping: false,
  typedLength: 0,
  style: createFloatingElement()
})));

const typeWord = (index) => {
  const word = words.value[index];
  word.isTyping = true;
  word.typedLength = 0;
  
  const typeInterval = setInterval(() => {
    if (word.typedLength < word.text.length) {
      word.typedLength++;
    } else {
      clearInterval(typeInterval);
      setTimeout(() => {
        word.isTyping = false;
        word.typedLength = 0;
        setTimeout(() => typeWord(index), Math.random() * 5000 + 2000);
      }, 1000);
    }
  }, 100);
};
const startGame = () => {
  router.push('/game');
};



onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check visibility on initial load
  startTypingAnimation(aboutTitle, 500);
  startTypingAnimation(aboutDescription, 2000);
  words.value.forEach((_, index) => {
    setTimeout(() => typeWord(index), Math.random() * 5000);
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<style scoped>
/* Keyframe Animations */
@keyframes gradientShift {

  0%,
  100% {
    background-position: 0% 0%;
  }

  10% {
    background-position: 100% 0%;
  }

  20% {
    background-position: 200% 100%;
  }

  30% {
    background-position: 300% 200%;
  }

  40% {
    background-position: 400% 300%;
  }

  50% {
    background-position: 500% 400%;
  }

  60% {
    background-position: 400% 500%;
  }

  70% {
    background-position: 300% 600%;
  }

  80% {
    background-position: 200% 700%;
  }

  90% {
    background-position: 100% 800%;
  }
}

@keyframes typing {
  from {
    width: 0
  }

  to {
    width: 100%
  }
}

@keyframes fadeIn {
  to {
    opacity: 1
  }
}

@keyframes reveal {

  0%,
  99% {
    visibility: hidden;
    opacity: 0;
  }

  100% {
    visibility: visible;
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

/* General Styles */
.home {
  text-align: center;
}

/* Welcome Section Styles */
.welcome-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg,
      #FFC3A8, #F57E9A, #EB3E8C, #D61F77, #B70159,
      #8E44AD, #3498DB, #2ECC71, #F1C40F, #E67E22, #FFC3A8);
  background-size: 1000% 1000%;
  animation:
    fadeIn 1s ease-in-out forwards,
    gradientShift 120s ease-in-out infinite;
}

.initial-content {
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

}

/* about-game Section Styles */
.about-game-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  color: white;
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #3498db, #8e44ad, #3498db);
  background-size: 400% 400%;
  animation: gradientAnimation 15s ease infinite;
  z-index: -1;
}

@keyframes gradientAnimation {
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

.about-game-content {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  width: 90%;
}

.typing-text {
  white-space: pre-wrap;
  overflow: hidden;
}

.meet-team-wrapper {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.circle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: floatFull 60s infinite ease-in-out;
}

.key {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  animation: floatFull 60s infinite ease-in-out;
}

.word {
  position: absolute;
  font-size: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.3);
  animation: floatFull 60s infinite ease-in-out;
}

.word.typing {
  color: rgba(255, 255, 255, 0.7);
}

.word span {
  opacity: 0.3;
  transition: opacity 0.1s;
}

.word span.typed {
  opacity: 1;
}

@keyframes floatFull {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  20% { transform: translate(100%, 50%) rotate(60deg); }
  40% { transform: translate(50%, 100%) rotate(-60deg); }
  60% { transform: translate(-50%, 50%) rotate(30deg); }
  80% { transform: translate(25%, -50%) rotate(-30deg); }
}

.key:nth-child(21) { left: 10%; top: 15%; animation-delay: -1s; }
.key:nth-child(22) { left: 25%; top: 35%; animation-delay: -3s; }
.key:nth-child(23) { left: 40%; top: 55%; animation-delay: -5s; }
.key:nth-child(24) { left: 55%; top: 75%; animation-delay: -7s; }
.key:nth-child(25) { left: 70%; top: 25%; animation-delay: -2s; }
.key:nth-child(26) { left: 85%; top: 45%; animation-delay: -4s; }
.key:nth-child(27) { left: 20%; top: 65%; animation-delay: -6s; }
.key:nth-child(28) { left: 35%; top: 85%; animation-delay: -8s; }
.key:nth-child(29) { left: 50%; top: 5%; animation-delay: -1s; }
.key:nth-child(30) { left: 65%; top: 95%; animation-delay: -3s; }
.key:nth-child(31) { left: 80%; top: 15%; animation-delay: -5s; }
.key:nth-child(32) { left: 95%; top: 35%; animation-delay: -7s; }
.key:nth-child(33) { left: 5%; top: 55%; animation-delay: -2s; }
.key:nth-child(34) { left: 30%; top: 75%; animation-delay: -4s; }
.key:nth-child(35) { left: 45%; top: 25%; animation-delay: -6s; }

/* Position words */
.word:nth-child(36) { left: 5%; top: 85%; animation-delay: -1s; }
.word:nth-child(37) { left: 25%; top: 15%; animation-delay: -3s; }
.word:nth-child(38) { left: 45%; top: 45%; animation-delay: -5s; }
.word:nth-child(39) { left: 65%; top: 75%; animation-delay: -7s; }
.word:nth-child(40) { left: 85%; top: 5%; animation-delay: -2s; }
.word:nth-child(41) { left: 15%; top: 35%; animation-delay: -4s; }
.word:nth-child(42) { left: 35%; top: 65%; animation-delay: -6s; }
.word:nth-child(43) { left: 55%; top: 95%; animation-delay: -8s; }
.word:nth-child(44) { left: 75%; top: 25%; animation-delay: -1s; }
.word:nth-child(45) { left: 95%; top: 55%; animation-delay: -3s; }

/* Ensure Teamsection is above the background */
:deep(.meet-team-section) {
  position: relative;
  z-index: 2;
  background: transparent;
}

/* Typography Styles */
h1,
p {
  color: white;
  max-width: 100%;
}

h1 {
  font-size: 2rem;
  padding: 1.5rem;
}

p {
  font-size: 1.5rem;
  padding: 1.5rem;
}

/* Animation Classes */
.typing-animation {
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
  animation: typing 2s steps(40, end);
}

p.typing-animation {
  animation-delay: 2.5s;
}

.hidden {
  visibility: hidden;
  opacity: 0;
  animation: reveal 0.1s linear forwards;
  animation-delay: 2.5s;
}

.fade-in {
  opacity: 0;
  /* Start fully transparent */
  animation: fadeIn 1s ease-in-out forwards;
  animation-delay: 5s;
}

/* Button Styles */
button {
  background-color: #000000;
  border: none;
  color: white;
  padding: 1.5rem 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 0.5rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #6d1f4e;
}

/* Pop-out Text Animation */
.pop-out-text {
  transform: translateX(-100%);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.pop-out-text.visible {
  transform: translateX(0);
  opacity: 1;
}

.team {
  color: rgb(217, 0, 255);
}
</style>