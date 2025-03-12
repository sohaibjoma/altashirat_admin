<template>
  <Field
    :name="name"
    :rules="`required|confirmed:@${targetField}`"
    :messages="{ confirmed: 'The passwords must match' }"
    v-slot="{ field, errors }"
  >
    <v-text-field
      v-bind="field"
      :error="!!errors.length"
      :error-messages="errors"
      variant="outlined"
      :type="showPass ? 'text' : 'password'"
      :hint="$t('inputs.password.confirmHint')"
      persistent-hint
      :append-inner-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="toggleShowPass"
      class="ms-5 me-5"
    ></v-text-field>
  </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import { ref } from "vue";

const props = defineProps({
  name: String,
  targetField: String,
});

let showPass = ref(false);

function toggleShowPass() {
  showPass.value = !showPass.value;
}
</script>

<style></style>
