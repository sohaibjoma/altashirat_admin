export default function authMiddleware(router, authStore) {
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!authStore.token;

    // Skip redirection if we're already navigating to users page
    if (to.path === "/users") {
      return next();
    }

    // If authenticated and trying to access login page, redirect to users
    if (isAuthenticated && to.path === "/") {
      return next("/users");
    }

    // If not authenticated and trying to access protected page, redirect to login
    if (!isAuthenticated && to.path !== "/") {
      return next("/");
    }

    // Otherwise proceed
    next();
  });
}