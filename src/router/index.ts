import Vue from 'vue'
import Router from 'vue-router'
import {interceptRouter} from "./intercept"
import Index from "@/page/Index.vue"
import Login from "@/page/Login.vue"
import ReturnGood from '@/page/index/return-good/ReturnGood.vue'
import NeedGood from '@/page/index/needGood/NeedGood.vue'
import SelectTemplate from '@/page/index/needGood/SelectTemplate.vue'
import ReceiveGood from '@/page/index/receive-good/ReceiveGood.vue';
import ComfirmAccept from '@/page/index/receive-good/ConfirmAccept.vue';
import MineContent from '@/page/mine/MineContent.vue'
import StockTaking from '@/page/index/stockTaking/StockTaking.vue'
import LibraryDetails from '@/page/index/stockTaking/LibraryDetails.vue'
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
    },{
      path:"/needgood",
      name:"NeedGood",
      component:NeedGood
    },{
      path:"/selecttemplate",
      name:"SelectTemplate",
      component:SelectTemplate
    },{
      path:"/receiveGood",
      name:"ReceiveGood",
      component:ReceiveGood,
      children:[
        {
          path: '/comfirmAccept',
          name: 'ComfirmAccept',
          component: ComfirmAccept,
        }
      ]
    },{
      path:"/mine",
      name:"MineContent",
      component:MineContent
    },{
      path:"/stocktaking",
      name:"StockTaking",
      component:StockTaking,
      children: [  //二级路由的配置
        {
          path: '/librarydetails',
          name: 'LibraryDetails',
          component: LibraryDetails,
        },
      ]
    },
  ]
});
interceptRouter(router);
export default router;
