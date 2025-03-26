<template>
  <v-container
    class="bg-white rounded-te-lg rounded-ts-lg border-sm w-75 ms-auto me-auto"
    fluid
  >
    <h1 class="text-start ps-3 border-s-xl border-primary">
      {{ $t("settings.title") }}
    </h1>
    <hr />

    <v-row class="mt-4">
      <v-col
        v-for="setting in settingsStore.settings"
        :key="setting.id"
        cols="12"
      >
        <v-card
          class="pa-3 d-flex align-center justify-space-between mb-2 bg-gray"
        >
          <div>
            <h3>{{ t(`settings.${setting.key}`) }}</h3>
          </div>
          <v-btn class="bg-primary-2" icon @click="editSetting(setting.id)">
            <v-icon color="secondary">mdi-pencil</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { t } from "../../../plugins/i18n";
import { useSettingsStore } from "../../../stores/settings";

const router = useRouter();
const settingsStore = useSettingsStore();

const editSetting = (id) => {
  router.push(`/settings/${id}`);
};

onMounted(async () => {
  await settingsStore.fetchSettings();
});
</script>

<style scoped></style>
