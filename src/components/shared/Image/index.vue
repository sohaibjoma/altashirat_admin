<template>
  <img :src="computedSrc" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: String,
  URL: String,
});

// compute the correct image source dynamically
const computedSrc = computed(() => {
  return props.URL || getLocalImage(props.name);
});

// function to resolve local image path
function getLocalImage(name) {
  return new URL(`../../../assets/imgs/${name}`, import.meta.url).href;
}
</script>

<style scoped></style>
