import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; 
// import en from "../I18n/en.json";
// import ar from "../I18n/ar.json";



// Vuetify setup
const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: localStorage.getItem("locale") || "ar",
    // messages:{ar,en}
  },
  icons: {
    defaultSet: 'mdi', // Default icon set
  },

   theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          black: '#000000',
          white: '#ffffff',
          primary: '#01335b',
          secondary: '#a6bf23',
          gray: '#f7f8f9',
          'primary-2': '#335a7a',
          'secondary-2': 'rgba(166, 191, 35, 0.8)',
          'gray-2': '#dadada',
          'primary-3': '#e3edf5',
          'secondary-3': '#f8fed9',
          'gray-3': '#939393',
          'error-text': '#e21b1b',
          'error-bg': '#fae1e4',
          'correct-text': '#4bae4f',
          'correct-bg':'#f1fff2',
        },
      },
    },
  },
});

  
export default vuetify;



