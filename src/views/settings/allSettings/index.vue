<template>
  <v-container class="bg-white rounded-te-xl rounded-ts-xl border-sm" fluid>
    <h1 class="text-start ps-3">
      {{ $t("settings.title") }}
    </h1>
    <hr>

    <v-row class="mt-4">
      <v-col v-for="setting in settings" :key="setting.id" cols="12">
        <v-card class="pa-3 d-flex align-center justify-space-between mb-2 bg-gray">
          <div>
            <h3>{{ getFormattedKey(setting.key) }}</h3>
          </div>
          <v-btn class="bg-primary-2" icon @click="editSetting(setting.id)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useApi } from '../../../composables/api';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { GET } = useApi();
const settings = ref([]);
const router = useRouter();
const { t } = useI18n();

const fetchSettings = async () => {
  const response = await GET('admin-panel/settings?pagination=all');
  settings.value = response.data.data;
};

// Format setting key: "default-currency" → "Default Currency"
const getFormattedKey = (key) => {
  const localizedKey = t(`settings.${key}`, key); // Use translation if available
  return localizedKey.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const editSetting = (id) => {
  router.push(`/settings/${id}`);
};

onMounted(fetchSettings);
</script>

<style scoped>
</style>