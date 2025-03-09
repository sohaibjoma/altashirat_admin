import mainLayoutRoute from "../modules/layouts/mainLayout";
import NotFoundRoute from "../modules/err404";
import loginRoute from "../modules/login";

const routes = [
  mainLayoutRoute,
  loginRoute,
  NotFoundRoute
]

export default routes;