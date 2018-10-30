import Vue from 'vue';
import Router from 'vue-router';
import {interceptRouter} from "./intercept";
import Index from "@/page/Index.vue";
import Login from "@/page/Login.vue";
import NeedGood from '@/page/index/needGood/NeedGood.vue';
import SelectTemplate from '@/page/index/needGood/SelectTemplate.vue';
import ReceiveGood from '@/page/index/receiveGood/ReceiveGood.vue';//收货页
import ComfirmAccept from '@/page/index/receiveGood/ConfirmAccept.vue';//收货修改页
import AddReceiveGood from '@/page/index/receiveGood/AddReceiveGood.vue';//新增收货
import CheckDetail from '@/page/index/receiveGood/CheckDetail.vue';//收货单详情页
import SearchReceiveGood from '@/page/index/receiveGood/SearchReceiveGood.vue';//收货单查询
import PublicAddGood from '@/page/index/receiveGood/PublicAddGood.vue';//选择物料
import MineContent from '@/page/mine/MineContent.vue';
import StockTaking from '@/page/index/stockTaking/StockTaking.vue';
import AddinventoryList from '@/page/index/stockTaking/AddinventoryList.vue';
import LibraryDetails from '@/page/index/stockTaking/LibraryDetails.vue';
import QueryResult from '@/page/index/stockTaking/QueryResult.vue';
import SelecttheTemplate from '@/page/index/stockTaking/SelecttheTemplate.vue';
import ChangePsd from '@/page/mine/ChangePassword.vue';//修改密码
import InitStock from '@/page/index/initStock/InitStock.vue';//库存初始化
import AddInitStock from '@/page/index/initStock/AddInitStock.vue';//添加库存初始化
import InitSet from '@/page/index/initStock/InitSet.vue';//库存初始化设置
import InitAudit from '@/page/index/initStock/InitAudit.vue';//审核库存初始化单
import InitDetail from '@/page/index/initStock/InitDetail.vue';//初始化单详情
import SystemSetting from '@/page/mine/SystemSetting.vue';//系统设置
import AddOrderGood from '@/page/order/AddOrderGood.vue';//新增订货
import OrderGood from '@/page/order/OrderContent.vue';//订货列表页
import ChartContent from '@/page/chart/ChartContent.vue';//报表
import SearchOrderGood from '@/page/order/SearchOrderGood.vue'; //订货查询 
import OrderDetails from '@/page/order/OrderDetails.vue'; //订货单详情
import AuditInvoice from '@/page/order/AuditInvoice.vue';  //审核要货单
import SpilledSheet from '@/page/index/spilledSheet/SpilledSheet.vue'; //损溢单
import SearchSpilledSheet from '@/page/index/spilledSheet/SearchSpilledSheet.vue';//损溢单查询
import SpilledSheetDetails from '@/page/index/spilledSheet/SpilledSheetDetails.vue'; //损溢详情页
import AddflossSheet from '@/page/index/spilledSheet/AddflossSheet.vue';//添加损溢单
import AuditoflossSheet from '@/page/index/spilledSheet/AuditoflossSheet.vue'; //审核损溢单
import StoreAllotment from '@/page/index/storeAllot/StoreAllotment.vue';//店间调拨列表页
import StoreAllotAdd from '@/page/index/storeAllot/StoreAllotAdd.vue';//添加店间调拨单
import StoreAllotAudit from '@/page/index/storeAllot/StoreAllotAudit.vue';//审核店间调拨单
import StoreAllotSearch from '@/page/index/storeAllot/StoreAllotSearch.vue';//查询店间调拨单
import StoreAllotDetail from '@/page/index/storeAllot/StoreAllotDetail.vue';//店间调拨单详情
import InStoreAllotment from '@/page/index/inStoreAllot/InStoreAllotment.vue';//店内调拨列表页
import InStoreAllotAdd from '@/page/index/inStoreAllot/InStoreAllotAdd.vue';//添加店内调拨单
import InStoreAllotAudit from '@/page/index/inStoreAllot/InStoreAllotAudit.vue';//审核店内调拨单
import InStoreAllotSearch from '@/page/index/inStoreAllot/InStoreAllotSearch.vue';//查询店内调拨单
import InStoreAllotDetail from '@/page/index/inStoreAllot/InStoreAllotDetail.vue';//店内调拨单详情
import SupplierReturn from '@/page/index/supplierReturn/supplierReturn.vue';
import SupplierReturnAdd from '@/page/index/supplierReturn/supplierReturnAdd.vue';
import SupplierReturnAudit from '@/page/index/supplierReturn/supplierReturnAudit.vue';
import SupplierReturnSearch from '@/page/index/supplierReturn/supplierReturnSearch.vue';
import SupplierReturnDetail from '@/page/index/supplierReturn/supplierReturnDetail.vue';
import LeadbackMaterial from '@/page/index/leadbackMaterial/LeadbackMaterial.vue';//领退料
import AddleadbackMaterial from '@/page/index/leadbackMaterial/AddleadbackMaterial.vue';//添加领料单
import SearchLeadbackMaterial from '@/page/index/leadbackMaterial/SearchLeadbackMaterial.vue'; //领料搜索结果
import AddleadbackRetreating from '@/page/index/leadbackMaterial/AddleadbackRetreating.vue';//添加退料单
import LeadbackMaterialDetails from '@/page/index/leadbackMaterial/LeadbackMaterialDetails.vue';//领料详情页
import AuditoleadbackMaterial from '@/page/index/leadbackMaterial/AuditoleadbackMaterial.vue';//审核领料单
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
    },{ //店间调拨 开始 
      path: '/storeAllotment',
      name: "StoreAllotment",
      component: StoreAllotment
    },{
      path: '/storeAllotAdd',
      name: "StoreAllotAdd",
      component: StoreAllotAdd
    },{
      path: '/storeAllotAudit',
      name: "StoreAllotAudit",
      component : StoreAllotAudit
    },{
      path: '/storeAllotSearch',
      name: "StoreAllotSearch",
      component: StoreAllotSearch
    },{//店间调拨 结束
      path: '/storeAllotDetail',
      name: 'StoreAllotDetail',
      component: StoreAllotDetail
    },{ //店内调拨 开始 
      path: '/inStoreAllotment',
      name: "InStoreAllotment",
      component: InStoreAllotment
    },{
      path: '/inStoreAllotAdd',
      name: "InStoreAllotAdd",
      component: InStoreAllotAdd
    },{
      path: '/inStoreAllotAudit',
      name: "InStoreAllotAudit",
      component : InStoreAllotAudit
    },{
      path: '/inStoreAllotSearch',
      name: "InStoreAllotSearch",
      component: InStoreAllotSearch
    },{//店内调拨 结束
      path: '/inStoreAllotDetail',
      name: 'InStoreAllotDetail',
      component: InStoreAllotDetail
    },{
      path:"/supplierReturn",
      name:"SupplierReturn",
      component:SupplierReturn
    },{
      path:'/supplierReturnAdd',
      name:"SupplierReturnAdd",
      component:SupplierReturnAdd
    },{
      path:'/supplierReturnDetail',
      name:'SupplierReturnDetail',
      component:SupplierReturnDetail
    },{
      path:'/supplierReturnAudit',
      name:'SupplierReturnAudit',
      component:SupplierReturnAudit
    },{   
      path:'/supplierReturnSearch',
      name:"SupplierReturnSearch",
      component:SupplierReturnSearch
    },{
      path: '/leadbackMaterial',
      name: 'LeadbackMaterial',
      component: LeadbackMaterial
    },{
      path: '/addleadbackMaterial',
      name: 'AddleadbackMaterial',
      component: AddleadbackMaterial
    },{
      path: '/searchLeadbackMaterial',
      name: 'SearchLeadbackMaterial',
      component: SearchLeadbackMaterial
    },{
      path: '/addleadbackRetreating',
      name: 'AddleadbackRetreating',
      component: AddleadbackRetreating
    },{
      path:'/leadbackMaterialDetails',
      name:'LeadbackMaterialDetails',
      component:LeadbackMaterialDetails
    },{
      path:'/auditoleadbackMaterial',
      name:'AuditoleadbackMaterial',
      component:AuditoleadbackMaterial
    }
  ]
});
interceptRouter(router);
export default router;
