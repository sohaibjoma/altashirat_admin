import { createWebHistory, createRouter } from "vue-router";
import routes from "./asyncRoutes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//?global authentication middleware to be implemented

// router.beforeEach((to, from, next) => {
//   if (["/user", "/titles"].some(path => to.path.startsWith(path)) && !localStorage.getItem("userToken")) {
//     next({ path: "/" });
//   } else {
//     next();
//   }
// });

export default router;