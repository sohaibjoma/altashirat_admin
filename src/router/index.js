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
    path: "/users",
    component: () => import("../views/users/record/index.vue"),
    meta: {
      hidden: true,
    },
    name: "Dashboard",
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
