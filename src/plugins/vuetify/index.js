import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

// Get locale from localStorage or default to "ar"
const locale = localStorage.getItem("locale") || "ar";
const isRTL = locale === "ar";

// Set direction on HTML document
document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");

// Vuetify setup
const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale,
  },
  rtl: isRTL, // Set RTL dynamically
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          black: '#000000',       // ✅ Fixed: Wrapped in quotes
          white: '#ffffff',       // ✅ Already correct
          primary: '#de1d9d',      
          'primary-2': '#F8D2EB',
          'primary-3': '#FBE8F5',
          secondary: '#212cff',
          'secondary-2': '#D3D5FF',
          'secondary-3': '#E8E9FF',
          gray: '#f7f8f9',
          'gray-2': '#dadada',
          'gray-3': '#939393',   // ✅ Fixed: Wrapped in quotes
          'error-text': '#e21b1b',
          'error-bg': '#fae1e4',
          'correct-text': '#4bae4f',
          'correct-bg': '#f1fff2',
        },
      },
    },
  },
});

export default vuetify;
