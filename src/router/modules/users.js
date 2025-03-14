import usersRecord from "../../views/users/record/index.vue";
import { t } from "../../plugins/I18n/index";

const UsersRoutes = [
  {
    path: "/users",
    component: usersRecord,
    name: "UserRecord",
    meta: {
      hidden: false,
      title: t("drawer.users"),
    },
  },
];

export default UsersRoutes;
