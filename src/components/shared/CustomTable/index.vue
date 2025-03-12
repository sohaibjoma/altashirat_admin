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
        <tr v-for="item in titles" :key="item.id">
          <td>{{ item.id }}</td>
          <td :class="item.visible ? '' : 'text-gray-2'">{{ item.name }}</td>
          <td class="d-flex">
            <slot name="actions" :item="item"></slot>
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

const titles = ref([]);
const pageCount = ref(0);

const props = defineProps({
  URLEndpoint: String,
  tableHeaders: Array,
  page: Number,
});

const { GET } = useApi();

async function getData() {
  if (!props.URLEndpoint) return;
  try {
    const response = await GET(props.URLEndpoint);
    titles.value = response.data.data;
    pageCount.value = response.data.meta.last_page;
  } catch (error) {
    console.error("Error fetching titles:", error);
  }
}

const emitter = inject("emitter");

onMounted(() => {
  emitter.on("reload", getData);
});

watch(() => props.page, getData, { immediate: true });
</script>

<style scoped></style>
