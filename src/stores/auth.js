import { defineStore } from "pinia";
import { useApi } from "../composables/api";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("userToken") || null);
  const user = ref(localStorage.getItem("auth_user") || null);

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem("userToken")= newToken;
  };

  const setUser = (newUser) => {
    user.value = newUser;
    localStorage.setItem("auth_user") = newUser;
  };

  const clearToken = () => {
    token.value = null;
    user.value = null;
    localStorage.setItem("userToken")= null;
    localStorage.setItem("auth_user")= null;
  };

  const fetchUser = async () => {
    try {
      const { get } = useApi();
      const response = await get("/show-account");

      if (response.data) {
        setUser(response.data);
        setToken(response.data.token);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const logout = async () => {
    try {
      const { DELETE } = useApi();
      await DELETE("/logout");
      clearToken();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    token,
    user,
    setToken,
    setUser,
    clearToken,
    fetchUser,
    logout,
  };
});
