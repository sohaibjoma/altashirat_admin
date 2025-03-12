import { t } from "../../plugins/I18n/index";

export default [
  {
    path: "/titles",
    component: () => import("../../views/titles/record/index.vue"),
    meta: {
      hidden: false,
    title: t("drawer.titles")
    },
  },
  {
    path: "/titles/add",
    component: () => import("../../views/titles/actions/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/titles/:id/edit",
    component: () => import("../../views/titles/actions/index.vue"),
    meta: {
      hidden: true,
    },
  },
];