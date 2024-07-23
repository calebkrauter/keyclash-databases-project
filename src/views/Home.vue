<template>
  <!-- Insert Navbar component at the top -->
  <Navbar />
  <!-- Create the welcome text and play button -->
  <div class="home">
    <div class="initial-content">
      <!-- The classes are set to stagger-animate as elements of the class will have an animation -->
      <h1 class="stagger-animate" style="--i: 1">Welcome to KeyClash</h1>
      <p class="stagger-animate" style="--i: 2">Discover the ultimate typing challenge!</p>
      <button @click="startGame" class="stagger-animate" style="--i: 3">Play Game</button>
    </div>

    <div class="scroll-section">
      <h2 ref="popOutText" class="pop-out-text">What is KeyClash</h2>
    </div>
  </div>
</template>

<script>
//ref, onMounted, onBeforeUnmount are important to vue as it allows for code to be executed at different times of the instance.
//https://vuejs.org/guide/essentials/lifecycle.html
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'Home',
  components: {
    Navbar
  },
  setup() {
    const popOutText = ref(null)

    const handleScroll = () => {
      if (!popOutText.value) return

      const position = popOutText.value.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.3

      console.log('Position:', position, 'Screen Position:', screenPosition)

      if (position < screenPosition) {
        console.log('Adding visible class')
        popOutText.value.classList.add('visible')
      } else {
        console.log('Removing visible class')
        popOutText.value.classList.remove('visible')
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      popOutText,
      handleScroll
    }
  },
  methods: {
    startGame() {
      console.log("starting game")
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}
.initial-content {
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.scroll-section {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}
@keyframes exaggeratedFadeInUp {
  0% {
    opacity: 0;
    transform: translateY(100px) scale(0.5);
  }

  60% {
    transform: translateY(-20px) scale(1.1);
  }

  80% {
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.stagger-animate {
  opacity: 0;
  animation: exaggeratedFadeInUp 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: calc(var(--i) * 0.3s);
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

button {
  background-color: #000000;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}


button:hover {
  background-color: #1b6e1f;
}

.scroll-section {
  height: 100vh;
  /* This ensures the section is tall enough to scroll to */
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.pop-out-text {
  transform: translateX(-100%);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.pop-out-text.visible {
  transform: translateX(0);
  opacity: 1;
}
</style>