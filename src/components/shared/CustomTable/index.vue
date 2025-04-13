<template>
  <v-container>
    <v-table class="table--customized mt-4" :loading="loading">
      <thead>
        <tr>
          <th v-for="header in tableHeaders" :key="header" class="py-3">
            {{ $t(`table.${header}`) || header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id" class="table-row">
          <td v-for="header in tableHeaders" :key="header" class="py-2">
            <template v-if="header === 'visibility'">
              <div class="d-flex align-center justify-start">
                <slot name="visibility" :item="item"></slot>
              </div>
            </template>
            <template v-else-if="header === 'actions'">
              <div class="d-flex align-center justify-start">
                <slot name="actions" :item="item"></slot>
              </div>
            </template>
            <template v-else-if="header === 'profile'">
              <div class="d-flex align-center justify-center">
                <slot name="profile" :item="item"></slot>
              </div>
            </template>
            <template v-else>
              <span>
                {{ getCellValue(item, header) || t('profile.N/A') }}
              </span>
            </template>
          </td>
        </tr>
      </tbody>
    </v-table>
    <Pagination
      :length="pageCount"
      :page="page"
      @update:page="$emit('update:page', $event)"
    />
  </v-container>
</template>

<script setup>
import { useApi } from "../../../composables/api";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useEventBus } from "../../../composables/eventBus";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const data = ref([]);
const pageCount = ref(0);
const loading = ref(false);

const props = defineProps({
  URLEndpoint: {
    type: String,
    required: true,
  },
  tableHeaders: {
    type: Array,
    required: true,
  },
  page: {
    type: Number,
    default: 1,
  },
  headerFieldMapping: {
    type: Object,
    default: () => ({}),
  },
  refreshEvent: {
    type: String,
    default: 'table-refresh'
  }
});

const { GET } = useApi();
const eventBus = useEventBus();

async function getData() {
  if (!props.URLEndpoint) return;
  loading.value = true;
  try {
    const response = await GET(props.URLEndpoint);
    data.value = response.data.data || [];
    pageCount.value = response.data.meta?.last_page || 1;
  } catch (error) {
    console.error("Error fetching data:", error);
    data.value = [];
  } finally {
    loading.value = false;
  }
}

function getCellValue(item, header) {
  const fieldPath = props.headerFieldMapping[header] || header;
  return getNestedValue(item, fieldPath);
}

function getNestedValue(obj, path) {
  if (!obj || !path) return null;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

onMounted(() => {
  eventBus.on(props.refreshEvent, getData);
  getData();
});

onUnmounted(() => {
  eventBus.off(props.refreshEvent, getData);
});

watch(() => props.page, getData, { immediate: false });
</script>

<style scoped></style>