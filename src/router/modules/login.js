import login from "../../views/login/index.vue";

const loginRoute = {
  path: '/', component: login,
   meta: {
    hidden: true
  },
  beforeEnter: (to, from, next) => {
    if (localStorage.getItem("userToken")) {
      next({ path: 'profile' });
    } else {
      next(); 
    }
  },
}

export default loginRoute