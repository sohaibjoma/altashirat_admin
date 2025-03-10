<template>
  <Field :name="name" :rules="rules" v-slot="{ field, errors }">
    <v-text-field
      v-bind="field"
      :error-messages="[...errors.map((error) => $t(error)), ...backendErrors]"
      variant="outlined"
      :hint="hint"
      persistent-hint
      class="ms-5 w-75"
      @update:model-value="handleInput"
      :model-value="modelValue"
    />
  </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import { computed } from "vue";
import { useErrorStore } from "../../../../../stores/errors";

const errorStore = useErrorStore();
const backendErrors = computed(() => errorStore.getErrorsForField(props.name));

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  rules: String,
  hint: String,
  modelValue: String,
  name: String,
});


// Custom function to handle input and clear errors
const handleInput = (event) => {
  emit("update:modelValue", event); // Update v-model
  errorStore.clearErrors();// Clear backend errors for this field
};

</script>
<style></style>
