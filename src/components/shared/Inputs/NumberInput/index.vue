<template>
  <div class="ms-4 mt-8 mb-4 font-weight-bold">
    {{ label }}
  </div>
  <Field :name="name" :rules="rules" v-slot="{ field, errors }">
    <v-text-field
      v-bind="field"
      type="number"
      :error-messages="[...errors.map((error) => $t(error)), ...backendErrors]"
      variant="outlined"
      :hint="hint"
      persistent-hint
      class="ms-5 me-5"
      @update:modelValue="emit('update:modelValue', $event)"
      :model-value="modelValue"
    ></v-text-field>
  </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import { computed } from "vue";
import { useErrorStore } from "../../../../stores/errors";

const errorStore = useErrorStore();
const backendErrors = computed(() => errorStore.getErrorsForField(props.name));

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Number,
  rules: String,
  label: String,
  hint: String,
  name: String,
});
</script>
