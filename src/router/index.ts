import Vue from 'vue';
import Router from 'vue-router';
import {interceptRouter} from "./intercept";
import Index from "@/page/Index.vue";
import Login from "@/page/Login.vue";
import ReturnGood from '@/page/index/return-good/ReturnGood.vue';
import NeedGood from '@/page/index/needGood/NeedGood.vue';
import SelectTemplate from '@/page/index/needGood/SelectTemplate.vue';
import ReceiveGood from '@/page/index/receive-good/ReceiveGood.vue';//收货页
import ComfirmAccept from '@/page/index/receive-good/ConfirmAccept.vue';//收货修改页
import AddReceiveGood from '@/page/index/receive-good/AddReceiveGood.vue';//新增收货
import CheckDetail from '@/page/index/receive-good/CheckDetail.vue';//收货单详情页
import SearchReceiveGood from '@/page/index/receive-good/SearchReceiveGood.vue';//收货单查询
import PublicAddGood from '@/page/index/receive-good/PublicAddGood.vue';//选择物料
import MineContent from '@/page/mine/MineContent.vue';
import StockTaking from '@/page/index/stockTaking/StockTaking.vue';
import AddinventoryList from '@/page/index/stockTaking/AddinventoryList.vue';
import LibraryDetails from '@/page/index/stockTaking/LibraryDetails.vue';
import QueryResult from '@/page/index/stockTaking/QueryResult.vue';
import SelecttheTemplate from '@/page/index/stockTaking/SelecttheTemplate.vue';
import ChangePsd from '@/page/mine/ChangePassword.vue';//修改密码
import InitStock from '@/page/index/init-stock/InitStock.vue';//库存初始化
import AddInitStock from '@/page/index/init-stock/AddInitStock.vue';//添加库存初始化
import InitSet from '@/page/index/init-stock/InitSet.vue';//库存初始化设置
import InitAudit from '@/page/index/init-stock/InitAudit.vue';//审核库存初始化单
import InitDetail from '@/page/index/init-stock/InitDetail.vue';//初始化单详情
import SystemSetting from '@/page/mine/SystemSetting.vue';//系统设置
import AddOrderGood from '@/page/order/AddOrderGood.vue';//新增订货
import OrderGood from '@/page/order/OrderContent.vue';//订货列表页
import ChartContent from '@/page/chart/ChartContent.vue';//报表
import SearchOrderGood from '@/page/order/SearchOrderGood.vue'; //订货查询 
import OrderDetails from '@/page/order/OrderDetails.vue'; //订货单详情
import AuditInvoice from '@/page/order/AuditInvoice.vue';  //审核要货单
import Allotment from '@/page/index/allotment/Allotment.vue';//调拨列表页
import AllotAdd from '@/page/index/allotment/AllotAdd.vue';//添加调拨单
import AllotAudit from '@/page/index/allotment/AllotAudit.vue';//审核调拨单
import AllotSearch from '@/page/index/allotment/AllotSearch.vue';//查询调拨单
import AllotDetail from '@/page/index/allotment/AllotDetail.vue';//调拨单详情
import SpilledSheet from '@/page/index/SpilledSheet/SpilledSheet.vue'; //损溢单
import SearchSpilledSheet from '@/page/index/SpilledSheet/SearchSpilledSheet.vue';//损溢单查询
import SpilledSheetDetails from '@/page/index/SpilledSheet/SpilledSheetDetails.vue'; //损溢详情页
import AddflossSheet from '@/page/index/SpilledSheet/AddflossSheet.vue';//添加损溢单
import AuditoflossSheet from '@/page/index/SpilledSheet/AuditoflossSheet.vue'; //审核损溢单
Vue.use(Router)

const router = new Router({
  routes: [{
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
      path:"/needGood",
      name:"NeedGood",
      component:NeedGood
    },{
      path:"/selectTemplate",
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
    },{
      path:"/stockTaking",
      name:"StockTaking",
      component:StockTaking,
    },{
      path: '/addInventoryList',   //新增盘点单
      name: 'AddinventoryList',
      component: AddinventoryList,
    },{      
      path: '/libraryDetails',   //盘库详情   审核盘点单
      name: 'LibraryDetails',
      component: LibraryDetails,
    },{
      path: '/queryResult',   //查询结果
      name: 'QueryResult',
      component: QueryResult,
    },{
      path: '/selecttheTemplate',   //选择模板
      name: 'SelecttheTemplate',
      component: SelecttheTemplate,
    },{
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
    },{
      path:'/addInitStock',
      name:'AddInitStock',
      component: AddInitStock
    },{
      path: '/initSet',
      name:"InitSet",
      component: InitSet
    },{
      path: '/initAudit',
      name:'InitAudit',
      component: InitAudit
    },{
      path: '/initDetail',
      name:"InitDetail",
      component: InitDetail
    },{
      path:'/systemSetting',
      name:'SystemSetting',
      component: SystemSetting
    },{
      path: '/addOrderGood',
      name:"AddOrderGood",
      component: AddOrderGood
    },
    {
      path: '/orderGood',
      name: 'OrderGood',
      component: OrderGood
    },
    {   
      path: '/chartContent',
      name: 'ChartContent',
      component: ChartContent
    },{
      path: '/searchOrderGood',
      name:"SearchOrderGood",
      component: SearchOrderGood
    },{
      path: '/orderDetails',
      name:"OrderDetails",
      component: OrderDetails
    },{
      path: '/auditInvoice',
      name:"AuditInvoice",
      component: AuditInvoice
    },{
      path: '/allotment',
      name: "Allotment",
      component: Allotment
    },{
      path: '/allotAdd',
      name: "AllotAdd",
      component: AllotAdd
    },{
      path: '/allotAudit',
      name: "AllotAudit",
      component : AllotAudit
    },{
      path: '/allotSearch',
      name: "AllotSearch",
      component: AllotSearch
    },{
      path: '/allotDetail',
      name: 'AllotDetail',
      component: AllotDetail
    },{
      path:"/spilledSheet",
      name:"SpilledSheet",
      component: SpilledSheet
    },{
      path:"/searchSpilledSheet",
      name:"SearchSpilledSheet",
      component: SearchSpilledSheet
    },{
      path:"/spilledSheetDetails",
      name:"SpilledSheetDetails",
      component: SpilledSheetDetails
    },{
      path:"/addflossSheet",
      name:"AddflossSheet",
      component:AddflossSheet
    },{
      path:"/auditoflossSheet",
      name:"AuditoflossSheet",
      component:AuditoflossSheet
      
    }
  ]
});
interceptRouter(router);
export default router;
