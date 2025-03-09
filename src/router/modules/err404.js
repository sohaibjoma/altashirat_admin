import NotFound from "../../views/Errors/404/index.vue"

const NotFoundRoute = {
  path: '/:pathMatch(.*)*', component: NotFound, meta:{
    hidden: true
  }
}

export default NotFoundRoute;