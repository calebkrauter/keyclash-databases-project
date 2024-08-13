<template>
  
  <div class="home">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="initial-content">
        <h1 v-if= "authStore.isLoggedIn === false" class="typing-animation">Welcome to KeyClash</h1>
        <h1 v-if= "authStore.isLoggedIn === true" class="typing-animation">Welcome {{ authStore.user }}</h1>
        <p class="typing-animation">  
          <span class="hidden">Discover the ultimate typing challenge!</span>
        </p>
        <button @click="startGame" class="fade-in">Play Game</button>
      </div>  
    </section>

    <!-- about-game Section -->
    <section id="about-game" class="about-game-section">
      <span class=about-game-content>
        <h2 ref="popOutText" class="pop-out-text">What is KeyClash</h2>
      </span>

      <!-- Additional content for the about-game section can be added here -->
       <!-- Linkedin https://www.linkedin.com/in/calebkrauter/ -->
    </section>
     <section id="meet-team" class="meet-team-section" ref="teamSection">
      <div class="curtain">
        <div class="curtain-left"></div>
        <div class="curtain-right"></div>
      </div>
      <div class="team-content">
       <Teamsection />
    
      </div>


    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store';
import Teamsection  from '@/components/Teamsection.vue';  
import { ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/store';

const userStore = useDataStore();
const { countClicks, countKeyPresses } = storeToRefs(userStore);
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

const startGame = () => {
  router.push('/game');
};



onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check visibility on initial load
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
  background-color: #f0f0f0;
}

.meet-team-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f0f0f0;
  position: relative;
  overflow: hidden;
}

.curtain {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 10;
}

.curtain-left, .curtain-right {
  width: 50%;
  height: 100%;
  background-color: #333;
  transition: transform 5s ease-out;
}

.curtain-left {
  transform: translateX(0);
}

.curtain-right {
  transform: translateX(0);
}

.reveal .curtain-left {
  transform: translateX(-100%);
}

.reveal .curtain-right {
  transform: translateX(100%);
}

.team-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transition: opacity 2.5s ease-out 2.5s;
}

.reveal .team-content {
  opacity: 1;
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