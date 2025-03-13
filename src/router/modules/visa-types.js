import { t } from "../../plugins/I18n/index";

export default [
  {
    path: "/visa-types",
    component: () => import("../../views/visa-types/record/index.vue"),
    meta: {
      hidden: false,
      title: t("drawer.visaTypes"),
    },
  },
  {
    path: "/visa-types/add",
    component: () => import("../../views/visa-types/actions/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/visa-types/:id/edit",
    component: () => import("../../views/visa-types/actions/index.vue"),
    meta: {
      hidden: true,
    },
  },
];
