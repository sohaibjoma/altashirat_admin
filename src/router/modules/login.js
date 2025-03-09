import login from "../../views/login/index.vue";

const loginRoute = {
  path: '/', component: login,
   meta: {
    hidden: true
  },
  //?login middleware to be implemented
  // beforeEnter: (to, from, next) => {
  //   if (localStorage.getItem("userToken")) {
  //     next({ name: 'record' }); // Redirect authenticated users
  //   } else {
  //     next(); 
  //   }
  // }, 
}

export default loginRoute