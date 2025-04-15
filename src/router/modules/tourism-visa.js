import { t } from "../../plugins/I18n/index";

export default [
  {
    path: "/tourism-visa",
    component: () => import("../../views/tourism-visa/record/index.vue"),
    meta: {
      hidden: false,
      title: t("drawer.TourismVisa"),
    },
  },
  {
    path: "/tourism-visa/add",
    component: () => import("../../views/tourism-visa/actions/index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/tourism-visa/:id/edit",
    component: () => import("../../views/tourism-visa/actions/index.vue"),
    meta: {
      hidden: true,
    },
  },
];
