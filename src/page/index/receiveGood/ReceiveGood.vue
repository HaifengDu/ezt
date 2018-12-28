<!--整体页面的头部布局-->
<template>
  <div>
    <div class="ezt-page-con" ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
      <ezt-header :back="true" title="收货" :isInfoGoback="true" @goBack="goBack">
        <div slot="action">   
          <div>
            <span class='ezt-action-point' @click="toPage(null,'/addReceiveGood')" v-if="!InterfaceSysTypeBOH">
              <i class="fa fa-plus" aria-hidden="true" ></i>
              </span>
            <span class='ezt-action-point' @click="searchTitle">
              <i class="fa fa-search" aria-hidden="true"></i>
            </span>          
          </div>
        </div>
      </ezt-header>    
      <div class="ezt-main">       
        <tab :line-width=2 active-color='#fc378c'>
          <tab-item 
          class="vux-center" 
          :selected="item.active" 
          v-for="(item, index) in tabList.TabList"
          @on-item-click="tabClick(index)" 
          :key="index">
            {{item.name}}
          </tab-item>
        </tab>        
        <div class="ezt-add-content">
          <!--无任何数据时 -->
          <div v-if="goodList.length==0" class="done-none">
            <div></div>
            <span>暂无记录</span>
          </div> 
          <!-- 收货单列表       -->
          <div v-if="goodList.length>0" class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click="toPage(item,'')">
              <div class="receive-icon-title">
              <span class="receive-icon-dcName type">{{item.type == 'SCM_RECEIVE_TYPE_INVOICE'? '配' : "无"}}</span>
              <span class="return-list-title">{{item.dc_name || item.outOrganName}}</span> 
              <span class="receive-status">{{billStatus}}</span>
              </div>
              <div class="receive-icon-content" v-if="!InterfaceSysTypeBOH">
                <span class="receive-dc-title">订单编号：<span class="receive-dc-content">{{item.bill_no}}</span></span>
                <span class="receive-dc-title">到货日期：<span class="receive-dc-content">{{item.arrive_date}}</span></span>
                <span class="receive-dc-title">要货日期：<span class="receive-dc-content">{{item.ask_goods_date}}</span></span>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
              </div>
              <div class="receive-icon-content" v-if="InterfaceSysTypeBOH">
                <span class="receive-dc-title">单据号：<span class="receive-dc-content">{{item.billNo}}</span></span>
                <span class="receive-dc-title">发货日期：<span class="receive-dc-content">{{new Date (item.busiDate).format('yyyy-MM-dd')}}</span></span>
                <span class="receive-dc-title">创建人：<span class="receive-dc-content">{{item.creator}}</span></span>
                <span class="receive-dc-title">备注:<span class="receive-dc-content">{{item.memo}}</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1" v-if="!InterfaceSysTypeBOH">
                  <span>共{{item.material_size}}件货品<span class="receive-total">合计：￥434</span></span>
                </div>
                <div class="glow-1" v-if="InterfaceSysTypeBOH" style="justify-content: space-between;">
                  <!-- <span>业务日期：{{item.busiDate}}</span> -->
                  <span>金额：￥{{item.totalAmt}}</span>
                </div>
                <div>
                  <span class="receive-ys-btn" v-if="tabList.getActive().status==1||tabList.getActive().status=='SCM_AUDIT_NO'">验收</span>
                </div>
              </div>
          </div>
           <span v-show="allLoaded">已全部加载</span>   
        </div>
      </div>         
    </div>
    <div v-show="isSearch" class="search-dialog">
      <ul class="ezt-title-search">
        <li class="select-list">
          <span class="title-search-name is-required">收货类型：</span>
          <span class="title-select-name item-select">
            <select placeholder="请选择" class="ezt-select" v-model="searchParam.receiveType"
             @change="handlerSearch('receiveType')" :class="[{'selectError':billFiles[0].receiveType}]">
              <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
              <option :value="item.id" :key="index" v-for="(item,index) in pullList.receiveType">{{item.name}}</option>
            </select>
          </span>
        </li>
        <li class="select-list">
          <span class="title-search-name is-required">来货单位：</span>
          <span class="title-select-name item-select">
            <select placeholder="请选择" class="ezt-select" :disabled='!searchParam.receiveType' v-model="searchParam.supplierId"
             @change="handlerSearch('supplierId')" :class="[{'selectError':billFiles[1].supplierId},{'disabled':!searchParam.receiveType}]">
              <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
              <option :value="item.id" :key="index" v-for="(item,index) in pullList.storeList">{{item.name}}</option>
            </select>
          </span>
        </li>
        <li>
          <span class="title-search-name is-required">收货日期：</span>
          <span>
            <ezt-canlendar ref="startDate" :max="searchParam.endDate" :defaultValue="pullList.defaultDate.defaultStartDate" 
              placeholder="开始时间" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
              <span>至</span>
            <ezt-canlendar ref="endDate" :min="searchParam.startDate" :defaultValue="pullList.defaultDate.defaultEndDate"
              placeholder="结束时间" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
          </span>
        </li>
        <li class="select-list">
          <span class="title-search-name ">仓库：</span>
          <span class="title-select-name item-select">
            <select placeholder="请选择" class="ezt-select" v-model="searchParam.warehouse">
              <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
              <option :value="item.id" :key="index" v-for="(item,index) in pullList.warehouseList">{{item.name||item.warehouseName}}</option>
            </select>
          </span>
        </li>
        <li>
          <span class="title-search-name">源单号：</span>
          <input type="text" ref="sourceBillNo" v-on:input="handlerChangeNo($event)" class="ezt-middle" placeholder="请输入源单号" v-model="searchParam.upBillNo">
        </li>
        <li>
          <span class="title-search-name">单据号：</span>
          <input type="text" class="ezt-middle" v-on:input="handlerChangeNo($event)" placeholder="请输入单据号" v-model="searchParam.billNo">
        </li>
        <li>
          <span class="title-search-name">物料：</span>
          <input type="text" class="ezt-middle" placeholder="请输入物料名称" v-model="searchParam.goodsName">
        </li>
        <li>
          <div class="ezt-two-btn" @click="toSearch">查询</div>
        </li>
      </ul>
    </div>  
     <go-top :element="element" :maxTop="40" class="toTop"></go-top> 
  </div> 
</template>

<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager';
import {TabItem,LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../../helper/maskMixin";
import noInput from '../../../mixin/noInput';
import { INoop, INoopPromise } from '../../../helper/methods';
import { TabList } from '../../../common/ITab';
import { FactoryService } from '../../../factory/FactoryService';
import { IReceiveGoodService } from '../../../interface/service/IReceiveGoodService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
import commonService from '../../../service/commonService.js';
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin,noInput],
   computed:{
     ...mapGetters({
       'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',
     })
   },
  //  methods:{
  //    ...mapActions({
  //      'getGoodList':"receiveGood/getGoodList"
  //    })
  //  }
})
export default class ReceiveGood extends Vue{
  private element: any=null;
  private InterfaceSysTypeBOH:boolean;
  private cache = CachePocily.getInstance();
  private service: IReceiveGoodService;
  private pager:Pager;
  private getGoodList:INoopPromise
  private addMaskClickListener:(...args:any[])=>void;
  private hideMask:()=>void;
  private showMask:()=>void;
  // private updateUser:INoop;
  /**
   * 列表页list数据
   */
  private goodList:any[] = [];
   /**
   * 数据是否已经全部加载完
   */
  private allLoaded:boolean= false;
  /**
   * 搜索显示
   */
  private isSearch:boolean= false; 
  /**
   * 搜索时的查询条件
   */
  private searchParam:any={};
  private tabList:TabList = new TabList();
  /**
   * 单据类型
   */
  private submitType:any[]=[
    "SCM_RECEIVE_TYPE_INVOICE",//发货单收货
    "SCM_RECEIVE_TYPE_ORDER" //订单收货 
  ]
  /**
   * 下拉 列表
   */
  private pullList:any = {
    // receiveType:[{//收货类型 下拉列表
    //   id:'a',
    //   name:'配送收货'
    // },{
    //   id:'b',
    //   name:'直配收货'
    // },{
    //   id:'c',
    //   name:'采购收货'
    // },{
    //   id:'d',
    //   name:'（平调）店间调拨收货'
    // }],
    receiveType:[{//boh只支持一种类型
      name:'配送收货',
      id:"SCM_RECEIVE_TYPE_INVOICE"
    }],
    storeList:[],//来货单位 下拉列表
    warehouseList:[],//仓库 下拉列表
    defaultDate:{
      defaultStartDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
      defaultEndDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')
    }
  };
  /**
   * 枚举 表单字段
   */
  private billFiles=[
    {id:"receiveType",msg:"请选择收货类型！",receiveType:false},
    {id:"supplierId",msg:"请选择来货单位！",supplierId:false}];
  created() {
    if(!this.InterfaceSysTypeBOH){
      this.tabList.push({
        name:"待收货",
        status:1,
        active:true,
      },{
        name:"已完成",
        status:3,
        active:false
      });
    }else{
      this.tabList.push({
        name:"待收货",
        status:'SCM_AUDIT_NO',
        active:true,
      },{
        name:"已完成",
        status:'SCM_AUDIT_YES',
        active:false
      });
    }
    this.pager = new Pager().setLimit(10)
    const factory = FactoryService.getInstance().createFactory();
    this.service = factory.createReceiveGood();
    this.getWarehouseList(); //仓库下拉列表
   
  }
  @Watch('this.osTop',{
    deep:true
  })

  mounted(){ 
    if (this.$refs.listContainer){
      this.element = this.$refs.listContainer;
      console.log(this.$refs.listContainer);
    }

    if(this.cache.getData(CACHE_KEY.RECEIVE_SEARCH)){//记住查询条件
      this.searchParam = JSON.parse(this.cache.getDataOnce(CACHE_KEY.RECEIVE_SEARCH));
      this.pullList.defaultDate.defaultStartDate = this.searchParam.startDate;
      this.pullList.defaultDate.defaultEndDate = this.searchParam.endDate;
      this.getSupplierList();
    }else{
      this.searchParam = {        
        receiveType: '',
        supplierId:'',
        warehouse:'',
        startDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
        endDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')
      }
    }     
    this.getList();
    this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
      this.isSearch=false; 
      this.hideMask(); 
    }); 
    if(this.$route.params.purStatus=="已完成"){//tab 哪个是选中状态
      this.tabList.TabList.forEach((item,index)=>{
        item.active = item.name == this.$route.params.purStatus;
      })
    } 
  }
  /**
   * 查询 收货类型、来货单位
   */
  private handlerSearch(val:any){
    if(val == 'receiveType'){
      //TODO: 重新加载收货类型下面的来货单位列表
      this.getSupplierList();
    }
    this.billFiles.forEach(item=>{
      if(item.id == val){
        item[val]= false;
      }
    })
  };
  /**
   * 获取  来货单位列表
   */
  private getSupplierList(){   
    this.service.getSupplierList().then(res=>{
      if(res){
        this.pullList.storeList = res.data.organList;
      }else{
        this.pullList.storeList = [{
          name: '供应商1',
          id: 1
        },{
          name: '供应商2',
          id: 2
        }]
      }
    })
  }
  /**
   * 获取仓库下拉列表
   */
  private getWarehouseList(){    
    this.service.getWarehouseList().then(res=>{
      if(res){
        this.pullList.warehouseList = res.data.warehouseList;
      }else{
        this.pullList.warehouseList = [{
          name: '仓库01',
          id: 1
        },{
          name: '仓库02',
          id: 2
        }]
      }
    })
  }
  /**
   * 改变查询的日期
   */
  private selectDateChange(val:any){
    (<any>this.$refs.startDate).setMax(new Date(val));
    (<any>this.$refs.endDate).setMin(new Date(val));
  }
  //详情页跳转
  private toPage(item:any,info:string){
    let confirmGoodInfo = {};
    let detailList = {};
    if(info){
      this.$router.push(info);
      return false;
    }
    if(this.tabList.getActive().status=="SCM_AUDIT_NO"||this.tabList.getActive().status=="1"){
      confirmGoodInfo={
        id: item.id,  
        submitType:item.type       
      }
      if(this.InterfaceSysTypeBOH){
        //BOH只支持配送收货
        this.cache.save(CACHE_KEY.RECEIVE_BILLTYPE,JSON.stringify("配"))
      }else{
        this.cache.save(CACHE_KEY.RECEIVE_BILLTYPE,JSON.stringify("采"))//配、直、调、采
      }
     
      this.cache.save(CACHE_KEY.RECEIVE_ADDINFO,JSON.stringify(confirmGoodInfo));
      this.$router.push('/comfirmAccept');
    }else if(this.tabList.getActive().status=="SCM_AUDIT_YES" || this.tabList.getActive().status=="3"){
      detailList = {
        dc_name:item.dc_name || item.outOrganName,
        bill_no:item.bill_no||item.billNo,    
        id: item.id,  
        submitType:item.type        
      }
      this.cache.save(CACHE_KEY.RECEIVE_DETAILLIST,JSON.stringify(detailList));
      this.$router.push('/checkDetail');
    }
  }
  /**
   * computed demo
   */
  private get Total(){
    return this.goodList.reduce((ori,item)=>{
      return ori.uprice+item;
    },0);
  }
  private get billStatus(){
    return (this.tabList.getActive().status=='SCM_AUDIT_NO'||this.tabList.getActive().status=='1')?'待审核':'已完成';
  }
  private tabClick(index:number){
    this.tabList.setActive(index);
    this.allLoaded=false;
    (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
    this.pager.resetStart();//分页加载还原pageNum值
    this.getList();     
  }
  //下拉加载更多
  private loadMore() {
    const status = this.tabList.getActive().status;
    if(!this.allLoaded && this.goodList.length >= this.pager.getPage().limit){
      this.showMask();
      this.$vux.loading.show({
        text:'加载中..'
      });
      this.pager.setNext();
      this.service.getGoodList(this.submitType[0],status as string, this.pager.getPage()).then(res=>{  
        if(this.pager.getPage().limit>res.data.list.length){
          this.allLoaded=true;
        }
        this.goodList=this.goodList.concat(res.data.list);
        setTimeout(()=>{
          this.$vux.loading.hide();
          this.hideMask();
        },500); 
      },err=>{
          this.$toasted.show(err.message);
      })
    }     
  }
  //获取列表
  private getList(){
    const status = this.tabList.getActive().status;
     this.service.getGoodList(this.submitType[0],status as string, this.pager.getPage()).then(res=>{
      this.showMask();
      this.$vux.loading.show({
        text: '加载中...'
        });
      this.goodList=res.data.list;
      setTimeout(()=>{
        this.$vux.loading.hide();
        this.hideMask();
      },400); 
      },err=>{
        this.$toasted.show(err.message);
    });
  }
  //搜索选择的条件显示/隐藏
  private searchTitle(){
    this.isSearch = !this.isSearch;
    this.isSearch?this.showMask():this.hideMask();
  }
  private toSearch(){
    for(let i=0;i<this.billFiles.length;i++){
      let item = this.billFiles[i];
      if(!this.searchParam[item.id]||this.searchParam[item.id]==""){
        this.$toasted.show(item.msg);
        item[item.id]=true;
        return false;
      }
    }
    this.isSearch = false;
    this.hideMask();
    this.cache.save(CACHE_KEY.RECEIVE_SEARCH,JSON.stringify(this.searchParam));
    this.$router.push('/searchReceiveGood');
  }  
  private goBack(){
    this.$router.push("/");
  } 
  /**
   * watch 监听单号
   */
 /*  @Watch("searchParam.sourceNo",{
    deep:true
  })
  private sourceNoWatch(newValue:any[],oldValue:any[]){
    this.searchParam.sourceBillNo = this.searchParam.sourceBillNo.replace(/[\w]/g,'')
  } */
}
</script>

<style lang="less" scoped> 
 //tab切换颜色设置
  .mint-tab-item.is-selected .deliver {
    color: #54B1FD;
    border-bottom: 2px solid #54B1FD;
    padding: 3px 6px;
  }
    .mint-tab-item.is-selected .purchase {
    color: #6EDB90;
    border-bottom: 2px solid #6EDB90;
    padding: 3px 6px;
  }

  .mint-navbar .mint-tab-item.is-selected {
    border: none;
  }

  .mint-navbar .mint-tab-item {
    padding: 7px 0;
  }
  .mint-navbar{
    display: flex;
  } 
  .add{
    font-size: 20px;
    i{
      margin-right: 10px;
    }
  }
  .ezt-action-point{
    width: 20px;
    height: 26px;
    display: inline-block;
  }
  .title-select-name .ezt-select.disabled{
    background: #ccc;
  }
  .ezt-add-content{
    padding-bottom: 0 !important;
  }
   
</style>
