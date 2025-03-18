import allSettings from "../../views/settings/allSettings/index.vue";
import editSettings from "../../views/settings/editSettings/index.vue";
import { t } from "../../plugins/I18n/index";

const settingsRoutes = [
  {
    path: "/settings",
    component: allSettings,
    name: "settings",
    meta: {
      hidden: true,
      title: t("settings.title"),
    },
  },
  {
    path: "/settings/:id",
    component: editSettings,
    name: "editSettings",
    meta: {
      hidden: true,
    },
  },
];

export default settingsRoutes;
