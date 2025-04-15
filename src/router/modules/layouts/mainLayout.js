import mainLayout from "../../../layouts/mainLayout/index.vue";
import profileRoute from "../profile";
import settingsRoutes from "../settings";
import TitlesRoutes from "../Titles";
import CountriesRoutes from "../countries";
import visaTypesRoutes from "../visa-types";
import UsersRoutes from "../users";
import EmploymentTypesRoutes from "../employment-types";
import TourismVisasRoutes from "../tourism-visas";
  
const mainLayoutRoute = {
  path: "/dashboard",
  component: mainLayout,
  children: [
    ...UsersRoutes,
    profileRoute,
    ...TitlesRoutes,
    ...CountriesRoutes,
    ...visaTypesRoutes,
    ...EmploymentTypesRoutes,
    ...settingsRoutes,
    ...TourismVisasRoutes
  ],
};

export default mainLayoutRoute;
