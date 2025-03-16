import { t } from "../../plugins/I18n/index";

export default [
  {
    path: "/employment-types",
    component: () => import("../../views/employment-types/record/index.vue"),
    meta: {
      hidden: false,
      title: t("drawer.employmentTypes"),
    },
  },
  {
    path: "/employment-types/add",
    component: () => import("../../views/employment-types/actions/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/employment-types/:id/edit",
    component: () => import("../../views/employment-types/actions/index.vue"),
    meta: {
      hidden: true,
    },
  },
];
