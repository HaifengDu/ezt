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
import AddinventoryList from '@/page/index/stockTaking/AddinventoryList.vue'
import EnquiryList from '@/page/index/stockTaking/EnquiryList.vue'
import LibraryDetails from '@/page/index/stockTaking/LibraryDetails.vue'
import ConfirmationList from '@/page/index/stockTaking/ConfirmationList.vue'
import RealdiscEntry from '@/page/index/stockTaking/RealdiscEntry.vue'
import AuditcheckList from '@/page/index/stockTaking/AuditcheckList.vue'
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
          path: '/addinventorylist',   //新增盘点单
          name: 'AddinventoryList',
          component: AddinventoryList,
        },
        {
          path: '/enquirylist',   //查询盘点单
          name: 'EnquiryList',
          component: EnquiryList,
        },
        {      
          path: '/librarydetails',   //盘库详情
          name: 'LibraryDetails',
          component: LibraryDetails,
        },
        {
          path: '/confirmationlist',  //确认盘点单
          name: 'ConfirmationList',
          component: ConfirmationList,
        },
        {
          path: '/realdiscentry',   //实盘录入
          name: 'RealdiscEntry',
          component: RealdiscEntry,
        },
        {
          path: '/auditchecklist',   //审核盘点单
          name: 'AuditcheckList',
          component: AuditcheckList,
        }
      ]
    },
  ]
});
interceptRouter(router);
export default router;
