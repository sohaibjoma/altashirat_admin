<template>
  <v-container class="pa-0">
    <v-pagination
      v-model="page"
      :length="length"
      :total-visible="5"
      color="primary"
      rounded="circle"
      class="mt-6"
      @update:modelValue="$emit('update:page', page)"
    />
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  length: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:page"]);

const page = ref(props.page);

watch(
  () => props.page,
  (newPage) => {
    page.value = newPage;
  }
);
</script>

<style scoped>
.v-pagination .v-btn:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}
</style>