<template>
  <div class="ms-4 mt-8 mb-4 font-weight-bold">
    {{ label }}
  </div>
  <v-text-field
    v-model="internalValue"
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
import { Field } from "vee-validate";
import { computed } from "vue";
import { useErrorStore } from "../../../../../stores/errors";

const errorStore = useErrorStore();
const backendErrors = computed(() => errorStore.getErrorsForField(props.name));

const emit = defineEmits(["update:modelValue"]);
import { useField } from "vee-validate";
import { computed } from 'vue';

const props = defineProps({
  modelValue: String,
  rules: String,
  label: String,
  rules: [Array, Function],
  hint: String,
  name: String,
});
  type: String,
  label: String,
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, setTouched, validate } = useField(
  props.name,
  props.rules
);

const internalValue = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    value.value = newValue;
    emit("update:modelValue", newValue);
  },
});

const validateOnImmediate = () => {
  setTouched(true);
  validate();
};
</script>

<style scoped></style>
