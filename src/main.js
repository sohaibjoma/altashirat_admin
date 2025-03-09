import { app } from './myApp/index.js'
import './assets/scss/main.scss'

import './plugins/index.js';
import { vuetify, i18n, emitter} from "./plugins/index.js"; 
import './components/shared/index.js';

import router from './router/index.js'
import { createPinia } from 'pinia'

app.provide('emitter', emitter).use(router).use(vuetify).use(createPinia()).use(i18n).mount('#app')
