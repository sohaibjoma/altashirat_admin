<template>
  <Field
    name="confirmation"
    :rules="'required|confirmed:@password'"
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
import { Field, ErrorMessage } from "vee-validate";

import {ref} from 'vue';

let showPass = ref(false);

function toggleShowPass() {
  showPass.value=!showPass.value
}
</script>

<style></style>
