<!-- login -->
<template>
  <v-layout class="d-flex align-center bg-gray">
    <v-container class="mt-16">
      <v-card class="mt-64 pt-8 pb-8 w-75 ms-auto me-auto">
        <h1 class="text-start border-s-xl ps-3 text-h4 border-secondary">
          {{ $t("login.title") }}
        </h1>
        <!-- handleSubmit is the vee validate function that handles the validation before the submit happens 
         we pass the submission function we created to it to make sure the validation happen then the logic we implemnted i sperformed -->
        <Form v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(formSubmitting)">
            <div class="ms-4 mt-8 font-weight-bold">
              {{ $t("login.phone") }}
            </div>

            <div class="d-flex gap-0">
              <PhoneNum
                v-model="data.phoneNumber"
                rules="required|phoneno"
                :hint="$t('inputs.phoneno.hint')"
                name="phone.number"
              />
              <PhoneCode
                v-model="data.phoneCode"
                rules="required"
                name="phone[country_code]"
              />
            </div>

            <Password
              v-model="data.password"
              rules="required|password"
              :label="$t('login.password')"
              :hint="$t('inputs.password.hint')"
              name="password"
            />

            <div class="text-end mt-8 ps-8">
              <MainButton
                color="secondary"
                width="135px"
                class="me-5"
                type="submit"
              >
                {{ $t("login.login") }}
              </MainButton>
            </div>
          </form>
        </Form>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script setup>
import { Form } from "vee-validate";
import { useRouter } from "vue-router";
import { useApi } from "../../composables/api";
import { ref } from "vue";
import { useNotificationStore } from "../../stores/notification";
import { useAuthStore } from "../../stores/auth";

const { POST } = useApi();
const router = useRouter();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

// Reactive backend errors object
const backendErrors = ref({});

const data = {
  password: "",
  phoneNumber: "",
  phoneCode: "",
};

const retrievedData = () => {
  const formdata = new FormData();
  formdata.append("phone[number]", data.phoneNumber);
  formdata.append("phone[country_code]", data.phoneCode);
  formdata.append("password", data.password);
  return formdata;
};

async function formSubmitting({ setErrors }) {
  console.log("Form Data before sending:", data);
  try {
    const res = await POST("/login", retrievedData());
    console.log("Response:", res);

    localStorage.setItem("userToken", res.data.token);
    authStore.setToken(res.data.token);
    router.push("/profile");

    // Show success notification
    notificationStore.setNotification("success");
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422 || error.response.status === 408) {
        console.log("backend errors:", error.response.data.errors);

        // Store backend errors
        backendErrors.value = error.response.data.errors;
        setErrors(error.response.data.errors);

        // Show error notification
        notificationStore.setNotification("error");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }
}
</script>

<style></style>
