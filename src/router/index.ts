import Vue from 'vue'
import Router from 'vue-router'
import {interceptRouter} from "./intercept"
import Index from "@/page/Index.vue"
import Login from "@/page/Login.vue"
import ReturnGood from '@/page/index/return-good/ReturnGood.vue'
import NeedGood from '@/page/index/needGood/NeedGood.vue'
import SelectTemplate from '@/page/index/needGood/SelectTemplate.vue'
import ReceiveGood from '@/page/index/receive-good/ReceiveGood.vue';//收货页
import ComfirmAccept from '@/page/index/receive-good/ConfirmAccept.vue';//收货修改页
import AddReceiveGood from '@/page/index/receive-good/AddReceiveGood.vue';//新增收货
import CheckDetail from '@/page/index/receive-good/CheckDetail.vue';//收货单详情页
import SearchReceiveGood from '@/page/index/receive-good/SearchReceiveGood.vue';//收货单查询
import PublicAddGood from '@/page/index/receive-good/PublicAddGood.vue';//选择物料
import MineContent from '@/page/mine/MineContent.vue'
import StockTaking from '@/page/index/stockTaking/StockTaking.vue'
import AddinventoryList from '@/page/index/stockTaking/AddinventoryList.vue'
import LibraryDetails from '@/page/index/stockTaking/LibraryDetails.vue'
import ConfirmationList from '@/page/index/stockTaking/ConfirmationList.vue'
import RealdiscEntry from '@/page/index/stockTaking/RealdiscEntry.vue'
import AuditcheckList from '@/page/index/stockTaking/AuditcheckList.vue'
import QueryResult from '@/page/index/stockTaking/QueryResult.vue'
import SelecttheTemplate from '@/page/index/stockTaking/SelecttheTemplate.vue'
import SelectingInventory from '@/page/index/stockTaking/SelectingInventory.vue'
import ChangePsd from '@/page/mine/ChangePassword.vue';//修改密码
import InitStock from '@/page/index/init-stock/InitStock.vue';//库存初始化
import AddInitStock from '@/page/index/init-stock/AddInitStock.vue';//添加库存初始化
import InitSet from '@/page/index/init-stock/InitSet.vue';//库存初始化设置
import InitAudit from '@/page/index/init-stock/InitAudit.vue';//审核库存初始化单
import InitDetail from '@/page/index/init-stock/InitDetail.vue';//初始化单详情
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
    },{
        path: '/comfirmAccept',
        name: 'ComfirmAccept',
        component: ComfirmAccept,
      },{
        path: '/checkDetail',
        name: 'CheckDetail',
        component: CheckDetail
      },{
        path: '/addReceiveGood',
        name: 'AddReceiveGood',
        component: AddReceiveGood
      },{
        path: '/searchReceiveGood',
        name: 'SearchReceiveGood',
        component: SearchReceiveGood
      },{
      path:"/mine",
      name:"MineContent",
      component:MineContent
    },
    {
      path:"/stocktaking",
      name:"StockTaking",
      component:StockTaking,
    },
    {
      path: '/addinventorylist',   //新增盘点单
      name: 'AddinventoryList',
      component: AddinventoryList,
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
    },
    {
      path: '/queryresult',   //查询结果
      name: 'QueryResult',
      component: QueryResult,
    },
    {
      path: '/selectthetemplate',   //选择模板
      name: 'SelecttheTemplate',
      component: SelecttheTemplate,
    },
    {
      path: '/selectinginventory',   //选择盘点货品
      name: 'SelectingInventory',
      component: SelectingInventory,
    },
    {
      path:'/publicAddGood',
      name:'PublicAddGood',
      component: PublicAddGood,
    },{
      path:'/changePsd',
      name:'ChangePsd',
      component: ChangePsd,
    },{
      path: '/initStock',
      name:'InitStock',
      component: InitStock
    },
    {
      path:'/addInitStock',
      name:'AddInitStock',
      component: AddInitStock
    },
    {
      path: '/initSet',
      name:"InitSet",
      component: InitSet
    },
    {
      path: '/initAudit',
      name:'InitAudit',
      component: InitAudit
    },
    {
      path: '/initDetail',
      name:"InitDetail",
      component: InitDetail
    }
  ]
});
interceptRouter(router);
export default router;
