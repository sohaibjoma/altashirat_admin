<template>
  <v-container fluid>
    <v-app-bar
      class="rounded-te-xl rounded-be-xl ps-8 pe-8 pt-2 pb-2 bg-white me-3 mt-2"
    >
      <v-toolbar class="bg-white">
        <v-app-bar-nav-icon @click.stop="toggleDrawer">
          <v-icon icon="mdi-menu" class="icon--pink"></v-icon>
        </v-app-bar-nav-icon>

        <router-link
          to="/profile"
          class="d-flex align-center text-decoration-none"
        >
          <Image name="avatar.png" class="v-toolbar__avatar" />
          <div class="ps-4 text-start d-flex flex-column">
            <span class="font-weight-bold">{{ userName }}</span>
            <span class="text-body-2">{{ $t("drawer.superAdmin") }}</span>
          </div>
        </router-link>

        <v-spacer></v-spacer>

        <v-select
          variant="outlined"
          :items="['ar', 'en']"
          class="mt-5 me-2"
          max-width="70px"
          base-color="secondary"
          v-model="localed"
        >
          <template #prepend-inner>
            <div class="d-flex align-center">
              <Image
                name="locale.svg"
                alt="localization-icon"
                class="v-toolbar__avatar"
              />
            </div>
          </template>
        </v-select>

        <div
          class="ms-3 me-3 bg-error-bg pt-2 ps-2 pe-2 rounded-lg cursor-pointer logout-icon"
          @click="logout"
        >
          <Image name="logout.png" alt="logout" class="header__icon icon-hover" />
        </div>

        <div
          class="ps-3 border-s-sm cursor-pointer settings-icon"
          @click="goToSettings"
        >
          <div class="bg-primary-2 pt-2 ps-2 pe-2 rounded-lg">
            <Image name="settings.png" alt="settings" class="header__icon icon-hover" />
          </div>
        </div>
      </v-toolbar>
    </v-app-bar>
  </v-container>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../../stores/auth";
import { useDrawerStore } from "../../../../stores/drawer";
import { useAppLocale } from "../../../../stores/appLocale";
import i18n from "../../../../plugins/I18n";
import vuetify from "../../../../plugins/vuetify";

const drawerStore = useDrawerStore();
const { toggleDrawer } = drawerStore;

const appLocale = useAppLocale();
const { setAppLocale } = appLocale;

const localed = ref(localStorage.getItem("locale") || "en");

const setLocale = () => {
  localStorage.setItem("locale", localed.value);
  i18n.global.locale = localed.value;
  vuetify.locale.current = localed.value;
  vuetify.locale.rtl = localed.value === "ar";
  setAppLocale(localed.value);
  window.location.reload();
};

watch(localed, (newLocale) => {
  console.log("Locale changed to:", newLocale);
  setLocale();
});

const authStore = useAuthStore();
const logout = () => authStore.logout();

const router = useRouter();
const goToSettings = () => router.push("/settings");

const user = computed(() => authStore.user?.user || authStore.user || {});
const userName = computed(() => user.value?.firstname || "Guest");
</script>

<style scoped></style>
