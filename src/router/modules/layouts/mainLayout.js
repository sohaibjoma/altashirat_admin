//? the dahshboard layout including the child components that would appear inside this layout

import mainLayout from "../../../layouts/mainLayout/index.vue"
import profileRoute from "../profile"
const mainLayoutRoute = {
  path: '/dashboard', component: mainLayout,
  children:[
    profileRoute,
  ]
}

export default mainLayoutRoute