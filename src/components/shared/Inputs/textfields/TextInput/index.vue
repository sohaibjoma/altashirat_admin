<template>
  <div class="ms-4 mt-8 font-weight-bold">
    {{ label }}
  </div>
  <v-text-field
    :model-value="value"
    @update:model-value="updateValue"
    :error="!!errorMessage"
    :error-messages="errorMessage"
    variant="outlined"
    :type="type"
    :hint="hint"
    persistent-hint
    class="ms-5 me-5"
    @blur="validateOnImmediate"
  ></v-text-field>
</template>

<script setup>
import { useField } from "vee-validate";

const props = defineProps({
  rules: [Array, Function], // Should be array or function, not string
  hint: String,
  name: String,
  type: String,
  label: String,
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, setTouched, validate } = useField(
  props.name,
  props.rules
);

// Emit update to parent component
const updateValue = (newValue) => {
  value.value = newValue;
  emit("update:modelValue", newValue);
};

const validateOnImmediate = () => {
  setTouched(true);
  validate();
};
</script>
