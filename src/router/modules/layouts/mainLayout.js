//? the dahshboard layout including the child components that would appear inside this layout

import mainLayout from "../../../layouts/mainLayout/index.vue"
import profileRoute from "../profile"
import settingsRoutes from "../settings"
import TitlesRoutes from "../Titles"
import CountriesRoutes from "../countries"

const mainLayoutRoute = {
  path: '/dashboard', component: mainLayout,
  children:[
    profileRoute,
    ...settingsRoutes,
    ...TitlesRoutes,
    ...CountriesRoutes
  ]
}

export default mainLayoutRoute