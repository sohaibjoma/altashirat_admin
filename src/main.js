import { app } from './myApp/index.js'
import './assets/scss/main.scss'

import './plugins/index.js';
import { vuetify} from "./plugins/index.js"; 

import router from './router/index.js'
import { createPinia } from 'pinia'

app.use(router).use(vuetify).use(createPinia()).mount('#app')
