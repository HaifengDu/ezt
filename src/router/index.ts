import Vue from 'vue'
import Router from 'vue-router'
import {interceptRouter} from "./intercept"
import Index from "@/page/Index.vue"
import Login from "@/page/Login.vue";
import ReturnGood from '@/page/index/return-good/ReturnGood.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{noRequireAuth:true}
    },{
      path:"/",
      name:"Home",
      component:Index
    },{
      path:"/returnGood",
      name:"ReturnGood",
      component:ReturnGood
    }
  ]
});
interceptRouter(router);
export default router;
