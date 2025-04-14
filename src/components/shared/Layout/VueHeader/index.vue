<template>
  <v-container fluid>
    <v-app-bar
      class="rounded-te-xl rounded-be-xl ps-8 pe-8 pt-2 pb-2 bg-white me-3 mt-2"
      elevation="0"
    >
      <v-toolbar class="bg-white">
        <v-app-bar-nav-icon @click.stop="toggleDrawer">
          <svg
            width="22"
            height="25"
            viewBox="0 0 30 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30 2c0-.53-.22-1.04-.614-1.414A2.147 2.147 0 0 0 27.905 0H2.762C2.206 0 1.673.21 1.28.586A1.955 1.955 0 0 0 .667 2c0 .53.22 1.04.613 1.414.393.375.926.586 1.482.586h25.143c.555 0 1.088-.21 1.481-.586C29.78 3.04 30 2.53 30 2zm0 10c0-.53-.22-1.04-.614-1.414A2.147 2.147 0 0 0 27.905 10H15.333c-.555 0-1.088.21-1.481.586A1.955 1.955 0 0 0 13.238 12c0 .53.22 1.04.614 1.414.393.375.926.586 1.481.586h12.572c.555 0 1.088-.21 1.481-.586C29.78 13.04 30 12.53 30 12zm0 10c0-.53-.22-1.04-.614-1.414A2.147 2.147 0 0 0 27.905 20H2.762c-.556 0-1.089.21-1.482.586A1.955 1.955 0 0 0 .667 22c0 .53.22 1.04.613 1.414.393.375.926.586 1.482.586h25.143c.555 0 1.088-.21 1.481-.586C29.78 23.04 30 22.53 30 22z"
              fill="#DE1D9D"
              fill-rule="evenodd"
            />
          </svg>
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
          :items="localeOptions"
          class="mt-5 me-1"
          max-width="40px"
          density="compact"
          menu-icon="none"
          base-color="secondary"
          v-model="localed"
          item-title="title"
          item-value="value"
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

        <LogoutDialog />

        <div
          class="ps-3 border-s-sm cursor-pointer settings-icon"
          @click="goToSettings"
        >
          <div class="bg-primary-2 pt-2 ps-2 pe-2 rounded-lg">
            <Image
              name="settings.png"
              alt="settings"
              class="header__icon icon-hover"
            />
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
import i18n from "../../../../plugins/i18n";
import vuetify from "../../../../plugins/vuetify";

const localeOptions = [
  { value: "ar", title: "عربي" },
  { value: "en", title: "English" },
];

const drawerStore = useDrawerStore();
const { toggleDrawer } = drawerStore;

const appLocale = useAppLocale();
const { setAppLocale } = appLocale;

const localed = ref(localStorage.getItem("locale") || "en");

const setLocale = () => {
  window.location.reload();
  localStorage.setItem("locale", localed.value);
  vuetify.locale.current = localed.value;
  vuetify.locale.rtl = localed.value === "ar";
  setAppLocale(localed.value);
};

watch(localed, (newLocale) => {
  console.log("Locale changed to:", newLocale);
  setLocale();
});

const authStore = useAuthStore();

const router = useRouter();
const goToSettings = () => router.push("/settings");

const user = computed(() => authStore.user?.user || authStore.user || {});
const userName = computed(() => user.value?.firstname || "Guest");
</script>
