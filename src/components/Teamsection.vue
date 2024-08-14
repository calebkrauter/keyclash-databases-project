<template>
  <section id="meet-team" class="meet-team-section">
    <h2 ref="popOutText" class="pop-out-text">Meet Our Team</h2>
    <div class="team-members">
      <div v-for="member in teamMembers" :key="member.name" class="team-member">
        <div class="member-image">
          <img :src="member.image" :alt="member.name" />
        </div>
        <h3>{{ member.name }}</h3>
        <div class="social-links">
          <a :href="member.github" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-github"></i>
          </a>
          <a :href="member.linkedin" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const teamMembers = ref([
 {
    name: 'James',
    image: 'src/public/JamesAndMiki.jpg',
    github: 'https://github.com/jimothy-dev',
    linkedin: 'https://www.linkedin.com/in/james'
  },
  {
    name: 'Johnny',
    image: 'src/public/Johnny.jpg',
    github: 'https://github.com/jasgcode',
    linkedin: 'https://www.linkedin.com/in/jasgarnica'
  },
  {
    name: 'Caleb',
    image: 'src/public/caleb.jpg',
    github: 'https://github.com/calebkrauter',
    linkedin: 'https://www.linkedin.com/in/calebkrauter/'
  }
]);
</script>

<style scoped>
.meet-team-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f0f0f0;
}

.team-members {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}

.team-member {
  width: 200px;
  text-align: center;
}

.member-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
}

.member-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.social-links {
  margin-top: 0.5rem;
}

.social-links a {
  color: #333;
  font-size: 1.5rem;
  margin: 0 0.5rem;
  text-decoration: none;
}

/* Reuse your existing pop-out text animation */
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