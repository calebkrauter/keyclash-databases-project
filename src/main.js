import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import './styles/index.css'
//https://vuejs.org/guide/essentials/application.html
const app = createApp(App)
//mount the router on to the app
app.use(router)


// app.use(store)
//mount the app
app.mount('#app')