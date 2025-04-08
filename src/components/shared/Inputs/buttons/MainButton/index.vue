<template>
  <v-btn
    class="text-white font-weight-bold"
    :color="color"
    :width="width"
    :height="height"
    :font-size="fontSize"
  >
    <slot></slot>
  </v-btn>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: "primary",
  },
  width: {
    type: String,
    default: "135px",
  },
  height: {
    type: String,
    default: "50px",
  },
  fontSize: {
    type: String,
    default: "16px",
  },
});
</script>

<style></style>
