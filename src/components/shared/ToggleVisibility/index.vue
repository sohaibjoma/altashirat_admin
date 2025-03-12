<template>
  <v-switch
    v-model="switcher"
    base-color="primary"
    @update:modelValue="visibilityToggle">
    <template v-slot:append>
      <v-icon color="primary">
        {{ switcher ? "mdi-eye" : "mdi-eye-off" }}
      </v-icon>
    </template>
  </v-switch>



</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useApi } from "../../../composables/api";

const switcher = ref(false);

onMounted(() => {
  props.title.visible ? switcher.value = false : switcher.value = true
})


const emitter = inject("emitter");
const { POST, GET } = useApi();
const props = defineProps({
  title: Object
});

async function visibilityToggle() {
  const response = await GET(`/admin-panel/titles/${props.title.id}`);
  console.log(response.data);

  const updateFormData = () => {
  const formData = new FormData();
  formData.append("name", response.data.title.name);
  formData.append("visible", response.data.title.visible ? "0" : "1");
  formData.append("locale", "en");
  formData.append("_method", "put");
  return formData;
};

  await POST(`/admin-panel/titles/${props.title.id}`, updateFormData());
  emitter.emit("reload");
}

</script>

<style></style>
