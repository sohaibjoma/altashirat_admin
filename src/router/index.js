import { createWebHistory, createRouter } from "vue-router";
import asyncRoutes from "./asyncRoutes";
import login from "../views/login/index.vue";

const routes = [
  ...asyncRoutes,
  {
    path: "/",
    component: login,
    meta: {
      hidden: true,
    },
    name: "Login",
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/Errors/404/index.vue"),
    meta: {
      hidden: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
