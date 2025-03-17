export default function authMiddleware(router, authStore) {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!authStore.token;

    if (isAuthenticated && to.path === "/") {
      return next("/users");
    }

    if (!isAuthenticated && to.path !== "/") {
      return next("/");
    }

    return next();
  });
}