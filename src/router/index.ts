import Vue from 'vue'
import Router from 'vue-router'
import {interceptRouter} from "./intercept"
import Index from "@/page/Index.vue"
import Login from "@/page/Login.vue";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta:{noRequireAuth:true}
    },{
      path:"/home",
      name:"Home",
      component:Index
    },
    {
      path: '*',
      name: 'Login',
      component: Login,
      meta:{noRequireAuth:true}
    }
  ]
});
interceptRouter(router);
export default router;
