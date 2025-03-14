//? the dahshboard layout including the child components that would appear inside this layout

import mainLayout from "../../../layouts/mainLayout/index.vue";
import profileRoute from "../profile";
import settingsRoutes from "../settings";
import TitlesRoutes from "../Titles";
import CountriesRoutes from "../countries";
import visaTypesRoutes from "../visa-types";
import UsersRoutes from "../users";
import EmploymentTypesRoutes from "../employment-types";

const mainLayoutRoute = {
  path: "/dashboard",
  component: mainLayout,
  children: [
    profileRoute,
    ...settingsRoutes,
    ...TitlesRoutes,
    ...CountriesRoutes,
    ...visaTypesRoutes,
    ...UsersRoutes,
    ...EmploymentTypesRoutes,
  ],
};

export default mainLayoutRoute;
