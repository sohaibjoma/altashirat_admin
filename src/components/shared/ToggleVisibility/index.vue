<template>
  <v-switch
    v-model="switcher"
    base-color="primary"
    @update:modelValue="visibilityToggle"
  >
    <template v-slot:append>
      <v-icon color="primary">
        {{ switcher ? "mdi-eye" : "mdi-eye-off" }}
      </v-icon>
    </template>
  </v-switch>
</template>

<script setup>
import { inject, onMounted, ref, watch } from "vue";
import { useApi } from "../../../composables/api";

const switcher = ref(false);
const emitter = inject("emitter");
const { POST, GET } = useApi();

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
  payload: {
    type: Function,
    required: true,
  },
});

// Watch for changes in the record prop
watch(
  () => props.record,
  (newRecord) => {
    if (newRecord && newRecord.visible !== undefined) {
      switcher.value = !newRecord.visible;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.record && props.record.visible !== undefined) {
    switcher.value = !props.record.visible;
  }
});

async function visibilityToggle() {
  try {
    if (!props.record || !props.record.id || !props.record.resource) {
      console.error(
        "Record, record ID, or resource is undefined.",
        props.record
      );
      return;
    }

    const response = await GET(
      `/admin-panel/${props.record.resource}/${props.record.id}`
    );
    console.log("Current record data:", response.data);

    // Check if payload function exists before calling it
    if (typeof props.payload !== "function") {
      console.error("Payload is not a function");
      return;
    }

    // Safely create form data from the response
    const formData = props.payload(response.data);

    if (!formData) {
      console.error("Failed to create form data");
      return;
    }

    await POST(
      `/admin-panel/${props.record.resource}/${props.record.id}`,
      formData
    );

    emitter.emit("reload");
  } catch (error) {
    console.error("Error toggling visibility:", error);
  }
}
</script>

<style scoped></style>
