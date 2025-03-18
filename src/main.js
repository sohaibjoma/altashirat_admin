import { app } from "./myApp/index.js";
import "./assets/scss/main.scss";

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'flag-icons/css/flag-icons.min.css';

import "./plugins/index.js";
import { vuetify, i18n, emitter } from "./plugins/index.js";
import "./components/shared/index.js";

import router from "./router/index.js";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/auth";
import authMiddleware from "./middleware/auth.js";

const pinia = createPinia();

app
  .provide("emitter", emitter)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(i18n)
  .mount("#app");

const authStore = useAuthStore(pinia);
authMiddleware(router, authStore);
