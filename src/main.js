import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

// Inicjalizuj Pinia przed aplikacją
const pinia = createPinia();

// Tworzenie i montowanie aplikacji
const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');
