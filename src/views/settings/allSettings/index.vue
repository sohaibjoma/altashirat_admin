<template>
  <v-container class="bg-white rounded-te-lg rounded-ts-lg border-sm" fluid>
    <h1 class="text-start ps-3 border-s-xl border-primary">
      {{ $t("settings.title") }}
    </h1>
    <hr>

    <v-row class="mt-4">
      <v-col v-for="setting in settings" :key="setting.id" cols="12">
        <v-card class="pa-3 d-flex align-center justify-space-between mb-2 bg-gray">
          <div>
            <h3>{{ t(`settings.${setting.key}`) }}</h3>
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
import { t } from "../../../plugins/i18n";


const { GET } = useApi();
const settings = ref([]);
const router = useRouter();

const fetchSettings = async () => {
  const response = await GET('admin-panel/settings?pagination=all');
  settings.value = response.data.data;
};

// // Format setting key: "default-currency" → "Default Currency"
// const formattedKey = computed(() => {
//   return setting.value?.key
//     ? t(`settings.${setting.value.key}`, setting.value.key)
//     : "";
// });

const editSetting = (id) => {
  router.push(`/settings/${id}`);
};

onMounted(fetchSettings);
</script>

<style scoped>
</style>