import login from "../../views/login/index.vue";

const loginRoute = {
  path: '/', component: login,
   meta: {
    hidden: true
  },
  beforeEnter: (to, from, next) => {
    if (localStorage.getItem("userToken")) {
      next({ path: 'profile' }); // Redirect authenticated users
    } else {
      next(); 
    }
  }, 
}

export default loginRoute