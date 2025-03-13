<template>
  <v-container>
    <v-table class="table--customized mt-4 h-100">
      <thead>
        <tr>
          <th v-for="header in tableHeaders" :key="header">
            {{ $t(`table.${header}`) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td v-for="header in tableHeaders" :key="header">
            <template v-if="header === 'actions'">
              <div class="d-flex">
                <slot name="actions" :item="item"></slot>
              </div>
            </template>
            <template v-else>
              <span>
                {{ getCellValue(item, header) }}
              </span>
            </template>
          </td>
        </tr>
      </tbody>
    </v-table>
    <pagination
      :length="pageCount"
      :page="page"
      @update:page="$emit('update:page', $event)"
      class="text-center"
    ></pagination>
  </v-container>
</template>

<script setup>
import { useApi } from "../../../composables/api";
import { inject, onMounted, ref, watch } from "vue";

const data = ref([]);
const pageCount = ref(0);

const props = defineProps({
  URLEndpoint: String,
  tableHeaders: Array,
  page: Number,
  headerFieldMapping: {
    type: Object,
    default: () => ({}),
  },
});

const { GET } = useApi();

async function getData() {
  if (!props.URLEndpoint) return;
  try {
    const response = await GET(props.URLEndpoint);
    data.value = response.data.data;
    pageCount.value = response.data.meta.last_page;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const emitter = inject("emitter");

onMounted(() => {
  emitter.on("reload", getData);
});

watch(() => props.page, getData, { immediate: true });

function getCellValue(item, header) {
  const fieldPath = props.headerFieldMapping[header] || header;
  return getNestedValue(item, fieldPath);
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}
</script>

<style scoped></style>
