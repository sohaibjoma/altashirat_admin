<template>
  <v-container>
    <v-table class="table--customized mt-4">
      <thead>
        <tr>
          <th v-for="header in tableHeaders" :key="header" class="text-right">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="title in titles" :key="title.id">
          <td>{{ title.id }}</td>
          <td :class="title.visible ? '' : 'text-gray-2'">{{ title.name }}</td>
          <td class="d-flex">
            <slot name="actions" :title="title"></slot>
          </td> 
        </tr>
      </tbody>
    </v-table>
    <!-- Pass `pageCount` to pagination -->
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
  page: Number, // Accept `page` from parent
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

// Watch for `page` changes and fetch data again
watch(() => props.page, getData, { immediate: true });
</script>
