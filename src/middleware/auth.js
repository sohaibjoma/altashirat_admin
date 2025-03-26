export default function authMiddleware(router) {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("userToken");
    if (isAuthenticated && to.path === "/") {
      return next("/users");
    }

    if (!isAuthenticated && to.path !== "/") {
      return next("/");
    }

    next();
  });
}
