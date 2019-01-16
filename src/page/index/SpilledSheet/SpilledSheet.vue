<!--损溢模块首页-->
<template>
<div>
   <div class="ezt-page-con SpilledSheet" ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" 
        infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
    <ezt-header :back="true" title="报损单" :isInfoGoback="true" @goBack="goBack">
      <div slot="action">
         <div class="add">
           <span class='ezt-action-point' @click="addPage">
            <i class="fa fa-plus" aria-hidden="true" ></i>
           </span>
          <span class='ezt-action-point' @click="queryPage">
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>          
         </div>         
       </div>
    </ezt-header>      
    <div class="ezt-main">            
        <!--内容-->
      <tab :line-width=2 active-color='#fc378c'>
        <tab-item class="vux-center" :selected="item.active" v-for="(item, index) in tabList.TabList"
        @on-item-click="tabClick(index)" :key="index">{{item.name}}
        </tab-item>
      </tab>
      <div class="ezt-add-content main-menu">
         <div v-if="!goodList" class="done-none">
            <div></div>
            <span>目前还没有任何订单</span>
          </div>
        <div v-if="goodList">
          <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index">
            <div class="ezt-list-show" v-swipeleft="handlerSwipe.bind(this,item,true)"  v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}" @click="toexamine(item)">
              <div class="receive-icon-title">
                <span class="return-list-title">单号：{{item.bill_no}}</span> 
                <span class="receive-status" v-if="tabList.getActive().status==1">报损</span>
                <span class="receive-status" v-if="tabList.getActive().status==2">盘点报溢</span>
              </div>
              <div class="receive-icon-content">
                <span class="receive-dc-title">仓库：
                  <span class="receive-dc-content">{{item.dc_name}}</span>  
                </span>
                <span class="receive-dc-title">制单日期：
                  <span class="receive-dc-content">{{item.arrive_date}}</span>
                </span>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
                <span class="receive-dc-title">备注：<span class="receive-dc-content">{{item.remark}}</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                  <span>共{{item.material_size}}件货品<span class="receive-total">损溢金额：￥434</span></span>
                </div>
              </div>
            </div>
            <div class="ezt-detail-del" @click="deleteBill(item)">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>
        <span v-show="allLoaded">没有更多数据</span> 
       </div>
      </div>  
    </div>
  </div>
  <!-- 查询损溢单 -->  
  <div v-show="isSearch" class="search-dialog SpilledSheet">
      <ul class="ezt-title-search">
       <li class="select-list">
        <span class="title-search-name is-required">仓库名称：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select" v-model="searchParam.warehouseName">
            <option style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
      <li>
        <span class="title-search-name is-required">单据日期：</span>
        <span>
          <ezt-canlendar ref="startDate" :max="searchParam.endDate" 
            :defaultValue="new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd')" 
            placeholder="开始日期" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
            <span>至</span>
          <ezt-canlendar ref="endDate" :min="searchParam.startDate" 
            :defaultValue="new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')"
            placeholder="结束日期" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
        </span>
      </li>
      <li>
        <x-input title="盘点单号：" :max="50" v-model="searchParam.singleNumber" placeholder="输入盘点单号查询"></x-input>
      </li>
      <li>
        <x-input title="单据或物料：" :max="50" v-model="searchParam.materiel" placeholder="输入单据号和物料名称查询"></x-input>
      </li>
      <li>
        <div class="ezt-two-btn" @click="toSearch">查询</div>
      </li>
    </ul>
  </div> 
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager'
import {TabItem,LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex'
import {maskMixin} from "../../../helper/maskMixin"
import { INoop, INoopPromise } from '../../../helper/methods'
import { TabList } from '../../../common/ITab'
import { FactoryService } from "../../../factory/FactoryService"
import { ISpilledSheetService } from "../../../interface/service/ISpilledSheetService"
import { CachePocily } from "../../../common/Cache"
import {ECache} from '../../../enum/ECache'
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({

     })
   },
   methods:{
     ...mapActions({

     })
   }
})
export default class SpilledSheet extends Vue{
    private cache = CachePocily.getInstance();
    private pager:Pager;
    private service: ISpilledSheetService;
    private tabList:TabList = new TabList();
    private goodList:any[] = [];//列表页list数据
    private addMaskClickListener:(...args:any[])=>void;
    private allLoaded:boolean = false;//损溢单是否加载完
    private hideMask:()=>void;
    private showMask:()=>void;
    private isSearch:boolean = false; //订货查询
    private searchParam:any={
      startDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
      endDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')
    };//搜索时的查询条件
    private orderType:any=[{
      name:'仓库1',
      id:'01'
    }]
    created() {
      this.tabList.push({
        name:"待审核",
        status:1,
        active:true,
      },{
        name:"已完成",
        status:2,
        active:false
      });
      const factory = FactoryService.getInstance().createFactory();
      this.service = factory.createSpilledSheet();
      this.pager= new Pager();   
      this.pager.setLimit(20);
      this.getList();  
    }
    mounted(){      
      this.getList();
      /**
       * 点击遮罩层
       */
      this.addMaskClickListener(()=>{  
        this.isSearch=false; 
        this.hideMask();
      });
      if(this.$route.params.purStatus=="已完成"){
       this.tabList.TabList.forEach((item,index)=>{
         item.active = item.name == this.$route.params.purStatus;
       })
      } 
    } 
    /**
     * 查询日期限制
     */
     private selectDateChange(val:any){
      (<any>this.$refs.startDate).setMax(new Date(val));
      (<any>this.$refs.endDate).setMin(new Date(val));
    }
    /**
     * 返回上一页
     */
    private goBack(){
      this.$router.push("/");
    } 
    private tabClick(index:number){
      this.tabList.setActive(index);
      this.allLoaded=false;
      (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
      this.pager.resetStart();//分页加载还原pageNum值
      this.getList();     
    }
    /**
     * 点击删除按钮
     */
    private deleteBill(item:any){
      let _this = this;
      this.$vux.confirm.show({
        onCancel () {
          let newIndex = _this.goodList.findIndex((info:any,index:any)=>{
            return item.id == info.id;
          })
          _this.goodList[newIndex].active = false;
        },
        onConfirm () {
          let newIndex = _this.goodList.findIndex((info:any,index:any)=>{
            return item.id == info.id;
          })
          _this.goodList.splice(newIndex,1);
        },
        content:'是否要删除该单据?'
      })
    }
    /**
     * 获取列表
     */
    private getList(){
      const status = this.tabList.getActive().status;
      this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{
        this.showMask();
        this.$vux.loading.show({
          text: '加载中...'
        }); 
        this.goodList=res.data.list;
        (this.goodList||[]).forEach(item=>this.$set(item,'active',false));
        setTimeout(()=>{
          this.$vux.loading.hide();
          this.hideMask();
        },400); 
        },err=>{
          this.$toasted.show(err.message);
      });
    } 

    /**
     * 下拉加载更多
     */
    private loadMore() {
        if(!this.allLoaded){
            this.showMask();
            this.$vux.loading.show({
                text:'加载中..'
            });
            this.pager.setNext();
            this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{  
                if(this.pager.getPage().limit>res.data.data.length){
                     this.allLoaded=true;
                }
                this.goodList=this.goodList.concat(res.data.data);
                setTimeout(()=>{
                    this.$vux.loading.hide();
                    this.hideMask();
                },500); 
            },err=>{
                this.$toasted.show(err.message);
            })
        }     
    }
    /**   
     * 左侧滑动删除
     */
    private handlerSwipe(item:any,active:boolean){
      const status = this.tabList.getActive().status;
      if(status =="1"){
         item.active = active;
      }     
    }
    private addPage(){
      this.$router.push('/addflossSheet')
    }
   /**
    * 查询损溢单
    */
   private queryPage(){
      this.isSearch = !this.isSearch;
      this.isSearch?this.showMask():this.hideMask();
   }
   private toSearch(){
      this.isSearch = false;
      this.hideMask();
      this.cache.save(CACHE_KEY.SPILLEDSHEET_SEARCH,JSON.stringify(this.searchParam));
      this.$router.push('/searchSpilledSheet');
   }   
   /**
    * 损溢详情
    */
    private spilledetails(item:any){  
      
    }   
    /**
     * 审核损溢单    损溢单详情
     */
    private toexamine(item:any){
      /**
       * 审核损溢单
       */
      let addBillInfo = {};
      /**
       * 损溢单详情
       */
      let details={} 
      if(this.tabList.getActive().status==1){
         addBillInfo={
          billno:item.bill_no,
          warehouse:item.warehouse,
          billType:"损溢单",
          causeofloss:"提前一天发货",
          remark:item.remark,        
        }   
        this.cache.save(CACHE_KEY.SPILLEDSHEET_ADDINFO,JSON.stringify(addBillInfo));
        this.$router.push({name:'AuditoflossSheet'});  
      }
      if(this.tabList.getActive().status==2){
        details={
          bill_no:item.bill_no,
          currentdate:item.arrive_date,
          warehouse:item.warehouse,
          bill_type:"报损单",
          causeofloss:"提前一天发货",
          singlenumber:"12124124",
          remark:item.remark,
        }
        this.cache.save(CACHE_KEY.SPILLEDSHEET_DETAILS,JSON.stringify(details));
        this.$router.push('/spilledSheetDetails');
      }
    }     
}
</script>
<style lang="less" scoped>
    .ezt-header{
      padding: 0;
      height: 45px;
      align-items: center;
    }
    .ezt-add-content{
      padding-bottom: 0px;
    }
    .main-menu{
      background-color: #F1F6FF;
    }
    .add{
      i{
        margin-right: 10px;
      }
    }
    .receive-dc-list{
      position: relative;
      .return-list-title{
          display: block;
          margin-left: 10px;
      }
    }
    .ezt-action-point{
      margin-top: 10px;
      width: 20px;
      height: 26px;
      display: inline-block;
    }
    //左侧滑动删除
    .ezt-list-show{
      position: relative;
      transition: transform .5s;
      background: #fff;
      z-index: 2;
    }
    .ezt-detail-del{
        position: absolute;
        right: -11px;
        width: 50px;
        height: 214px;
        font-size: 25px;
        display: flex;
        align-items: center;
        top: 0;
     }
    .swipe-transform{
      transform: translateX(-50px);
    }
</style>
