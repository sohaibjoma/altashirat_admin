<template>
  <div class="ms-4 mt-8 font-weight-bold">
    {{ label }}
  </div>
  <Field :name="name" :rules="rules" v-slot="{ field, errors }">
    <v-text-field
      v-bind="field"
      :error-messages="[...errors.map((error) => $t(error)), ...backendErrors]"
      variant="outlined"
      :type="showPass ? 'text' : 'password'"
      :hint="hint"
      persistent-hint
      class="ms-5 me-5"
      :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="toggleShowPass"
      @update:modelValue="emit('update:modelValue', $event)"
      :model-value="modelValue"
    ></v-text-field>
  </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import { ref, computed } from "vue";
import { useErrorStore } from "../../../../../stores/errors";

const errorStore = useErrorStore();
const backendErrors = computed(() => errorStore.getErrorsForField(props.name));

const emit = defineEmits(["update:modelValue"]);

let showPass = ref(false);

let props = defineProps({
  modelValue: String,
  rules: String,
  label: String,
  hint: String,
  name: String,
});

function toggleShowPass() {
  showPass.value = !showPass.value;
}
</script>

<style></style>
