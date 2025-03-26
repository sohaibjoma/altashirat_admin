<template>
  <v-layout class="d-flex align-center bg-gray">
    <v-container class="mt-16">
      <v-card class="mt-64 pt-8 pb-8 w-75 ms-auto me-auto">
        <h1 class="text-start border-s-xl ps-3 border-secondary">
          {{ $t("login.title") }}
        </h1>
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { POST } = useApi();
const router = useRouter();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

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

    if (!res.data || !res.data.token) {
      throw new Error("Invalid login response: Token missing");
    }
    if (res.data.token) {  
      localStorage.setItem("userToken", res.data.token);
      await authStore.fetchUser();
      notificationStore.setNotification(
        t("notifications.login_success"),
        "success"
      );
      router.push("/users");
    }
  } catch (error) {
    console.error("Login Error:", error);
    if (error.response) {
      if (error.response.status === 422 || error.response.status === 408) {
        console.log("Backend errors:", error.response.data.errors);

        backendErrors.value = error.response.data.errors;
        setErrors(error.response.data.errors);

        notificationStore.setNotification(
          t("notifications.login_error"),
          "error"
        );
      } else {
        console.error("Unexpected error:", error);
        notificationStore.setNotification(
          t("notifications.unexpected_error"),
          "error"
        );
      }
    }
  }
}
</script>

<style></style>
