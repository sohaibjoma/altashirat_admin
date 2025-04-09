<template>
  <div class="mx-4">
    <v-card class="mt-5 py-4">
      <v-card-title class="pt-4 pb-2 pink-border font-weight-bold">
        {{ $t("settings.title") }}
      </v-card-title>
      <hr />

      <v-row class="mt-4 mx-4">
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
    </v-card>
  </div>
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
