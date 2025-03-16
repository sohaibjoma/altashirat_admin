<template>
  <div>
    <label class="input__label mr-2" :for="id">{{ label }}</label>
    <Field 
      :name="name" 
      :rules="rules" 
      v-slot="{ field, errorMessage }" 
      :validateOnInput="true" 
      :initialValue="modelValue"
    >
      <input
        type="checkbox"
        v-model="field.value"
        :id="id"
        @change="$emit('update:modelValue', !!field.value)"
      />
      <span v-if="errorMessage || apiError" class="error-message">
        {{ errorMessage || backendErrors[0] }}
      </span>
    </Field>
    <p class="input__description">{{ inputDescription }}</p>
  </div>
</template>

<script setup>
import { Field } from "vee-validate";
import { computed } from "vue";
import { useErrorStore } from "../../../../stores/errors";

const errorStore = useErrorStore();

const props = defineProps({
  id: String,
  label: String,
  inputDescription: String,
  name: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const backendErrors = computed(() => errorStore.getErrorsForField(props.name));
</script>