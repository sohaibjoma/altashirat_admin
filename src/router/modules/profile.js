import profile from "../../views/profile/index.vue";
import { t } from "../../plugins/i18n";
const profileRoute = {
  path: "/profile",
  component: profile,
  meta: {
    hidden: true,
    title: t("profile.title"),
  },
};

export default profileRoute;
