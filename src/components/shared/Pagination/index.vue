<template>
  <div class="text-center">
    <v-pagination
      v-model="page"
      rounded="lg"
      class="mt-5"
      :length="length"
      @update:modelValue="$emit('update:page', page)" 
    ></v-pagination>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  length: Number,
  page: Number
});

const emit = defineEmits(["update:page"]);

let page = ref(props.page);

// Sync changes when parent updates `page`
watch(() => props.page, (newPage) => {
  page.value = newPage;
});
</script>
