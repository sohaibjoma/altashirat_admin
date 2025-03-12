import { defineStore } from "pinia";
import { useApi } from "../composables/api";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("userToken") || null);
  const user = ref(
    localStorage.getItem("auth_user")
      ? JSON.parse(localStorage.getItem("auth_user"))
      : null
  );

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem("userToken", newToken);
  };

  const setUser = (newUser) => {
    user.value = newUser;
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const clearToken = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("userToken");
    localStorage.removeItem("auth_user");
  };

  const fetchUser = async () => {
    try {
      const { GET } = useApi();
      const response = await GET("/show-account");

      if (response.data) {
        setUser(response.data);
        if (response.data.token) {
          setToken(response.data.token);
        }
      }
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      const { DELETE } = useApi();
      await DELETE("/logout");
      clearToken();
      if (useRouter) {
        const router = useRouter();
        router.push("/");
      }
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
