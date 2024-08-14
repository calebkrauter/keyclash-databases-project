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
          <a :href="member.github" target="_blank" rel="noopener noreferrer" :aria-label="`${member.name}'s GitHub`">
            <i class="fab fa-github"></i>
          </a>
          <a :href="member.linkedin" target="_blank" rel="noopener noreferrer" :aria-label="`${member.name}'s LinkedIn`">
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
    image: '/src/public/JamesAndMiki.jpg',
    github: 'https://github.com/jimothy-dev',
    linkedin: 'https://www.linkedin.com/in/james'
  },
  {
    name: 'Johnny',
    image: '/src/public/Johnny.jpg',
    github: 'https://github.com/jasgcode',
    linkedin: 'https://www.linkedin.com/in/jasgarnica'
  },
  {
    name: 'Caleb',
    image: '/src/public/caleb.jpg',
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
  background-color: transparent;  /* Changed to transparent to show background animation */
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
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.member-image:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
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
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-links a:hover {
  color: #007bff;
  transform: translateY(-3px);
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

/* Add this to ensure text is readable over the animated background */
h2, h3 {
  color: #fff;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}
</style>