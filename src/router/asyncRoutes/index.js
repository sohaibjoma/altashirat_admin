import mainLayoutRoute from "../modules/layouts/mainLayout";
import NotFoundRoute from "../modules/err404";
import loginRoute from "../modules/login";
import profileRoute from "../modules/profile";

const routes = [
  mainLayoutRoute,
  loginRoute,
  NotFoundRoute,
  profileRoute,
]

export default routes;