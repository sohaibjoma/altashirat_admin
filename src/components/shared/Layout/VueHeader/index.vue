<template>

  <v-container fluid>
      <v-app-bar 
    class="rounded-te-xl rounded-be-xl ps-8 pe-8 pt-2 pb-2 bg-white"
    
    >
      <v-toolbar class="bg-white"
    >
      <v-app-bar-nav-icon @click.stop="toggleDrawer">
        <v-icon icon="mdi-menu" class="icon--green"></v-icon>
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      
      <v-select
        variant="outlined"
        :items="['ar', 'en']"
        class="mt-5 me-2"
        max-width="70px"
        base-color="primary"
        v-model="localed"
      >
        <template #prepend-inner>
          <div class="d-flex align-center">
            <img
              src="../../../../assets/imgs/locale.svg"
              alt="localization-icon"
              class="v-toolbar__avatar"
            />
          </div>
        </template>
      </v-select>

      <img
        src="../../../../assets/imgs/avatar.png"
        alt="avatar"
        class="v-toolbar__avatar"
      />
      <div class="ps-4 text-start d-flex flex-column">
        <span class="font-weight-bold">نادين السيد</span>
        <span class="text-body-2">{{ $t('drawer.superAdmin') }}</span>
      </div>

      <div class="ms-4 me-4">
        <img src="../../../../assets/imgs/group-5.png" alt="" />
      </div>

      <div class="ps-4 border-s-sm">
        <img src="../../../../assets/imgs/group-6.png" alt="" />
      </div>
    </v-toolbar>
     </v-app-bar>
    </v-container>

</template>

<script setup>
import { ref, watch } from "vue";
import i18n from "../../../../plugins/I18n";
import vuetify from "../../../../plugins/vuetify";
import { useDrawerStore } from "../../../../store/drawer";
import { useAppLocale } from "../../../../store/appLocale"
import { storeToRefs } from "pinia";
//handling drawer state
const drawerStore = useDrawerStore();
const { toggleDrawer } = drawerStore

const appLocale = useAppLocale();
const { setAppLocale } = appLocale


// Track the currently active list item
const activeItem = ref("");
// Set the active item dynamically
const setActive = (item) => {
  activeItem.value = item;
};

// Reactive reference for the selected locale
const localed = ref(localStorage.getItem("locale") || "en");

// Function to update the locale settings
const setLocale = () => {
  localStorage.setItem("locale", localed.value);
  i18n.global.locale = localed.value; 
  vuetify.locale.current = localed.value; 
  vuetify.locale.rtl = localed.value === "ar"; 
  setAppLocale(localed.value)
  window.location.reload();
};

// Watch for changes in the selected locale
watch(localed, (newLocale) => {
  console.log("Locale changed to:", newLocale);
  setLocale(); 
});
</script>

<style>

</style>