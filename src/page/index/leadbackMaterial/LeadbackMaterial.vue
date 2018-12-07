<!--领退料模块-->
<template>
<div>
   <div class="ezt-page-con LeadbackMaterial"  ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" 
        infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
    <ezt-header :back="true" title="领/退料" :isInfoGoback="true" @goBack="goBack">
      <div slot="action">
         <div class="add">
           <span class='ezt-action-point' @click="addPage">
            <i class="fa fa-plus" aria-hidden="true" ></i>
           </span>
          <span class='ezt-action-point' @click="queryPage">
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>            
         </div>
         <div v-show="addgoods" class="addgoods">
          <ul>
            <li @click="Material('/addleadbackMaterial')">领料单</li>
            <li @click="Material('/addleadbackRetreating')">退料单</li>
          </ul>
        </div>  
       </div>
    </ezt-header>  
    <div class="ezt-main">      
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
          <div class="receive-dc-list"  v-if="goodList" v-for="(item,index) in goodList" :key="index">
            <div class="ezt-list-show" v-swipeleft="handlerSwipe.bind(this,item,true)"  v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}" @click="MaterialDetails(item)">
              <div class="receive-icon-title">
                <span class="return-list-title">单号：{{item.bill_no}}</span> 
                <span class="receive-status">2018-10-25</span>
              </div>
              <div class="receive-icon-content">
                <div style="display:flex">
                  <span class="receive-dc-title" v-if="tabList.getActive().status==1 || tabList.getActive().status==2">领料库：
                    <span class="receive-dc-content">{{item.storehouse}}</span>  
                  </span>
                  <span class="receive-dc-title" v-if="tabList.getActive().status==3 || tabList.getActive().status==4">退料库：
                    <span class="receive-dc-content">{{item.storehouse}}</span>  
                  </span>
                  <span class="receive-dc-title">数量：
                    <span class="receive-dc-content">{{item.number}}</span>
                  </span>
                </div>
                <div style="display:flex">
                  <span class="receive-dc-title">主仓库：
                    <span class="receive-dc-content">{{item.warehouse}}</span>  
                  </span>
                  <span class="receive-dc-title">单据金额：
                    <span class="receive-dc-content">{{item.amount}}</span>
                  </span>
                </div>
                <span class="receive-dc-title">货品摘要：<span class="receive-dc-content">{{item.details}}</span></span>
                <span class="receive-dc-title">备注：<span class="receive-dc-content">{{item.remark}}</span></span>
              </div>
            </div>
            <div class="ezt-list-del" @click="deleteBill(item)">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
          </div>
          <span v-show="allLoaded">已全部加载</span> 
        </div>
      </div>
    </div>
  </div>
  <!-- 查询领退料 -->  
  <div v-show="isSearch" class="search-dialog LeadbackMaterial">
      <ul class="ezt-title-search">
       <li class="select-list"> 
        <span class="title-search-name">单据类型：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select" v-model="searchParam.billType">
            <option value='' style="display:none;" disabled="disabled" selected="selected">请选择单据类型</option>
            <option :value="item.name" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
       <li class="select-list">
        <span class="title-search-name">领/退料仓库：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select" v-model="searchParam.Warehouse">
            <option value='' style="display:none;" disabled="disabled" selected="selected">请选择领/退料仓库</option>
            <option :value="item.name" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>    
          </select>
        </span>
      </li>
      <li>
        <span class="title-search-name">单据日期：</span>
        <span>
          <ezt-canlendar ref="startDate" :max="searchParam.endDate" :defaultValue="new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd')"  placeholder="开始日期" @change="selectDateChange" type="text" 
           :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
            <span>至</span>
          <ezt-canlendar ref="endDate" :min="searchParam.startDate" :defaultValue="new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')" placeholder="结束日期" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>     
        </span>
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
import { ILeadbackMaterialService } from "../../../interface/service/ILeadbackMaterialService"
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
export default class leadbackMaterial extends Vue{
    private cache = CachePocily.getInstance();
    private pager:Pager;
    private service: ILeadbackMaterialService;
    private tabList:TabList = new TabList();
    private goodList:any[] = [];//列表页list数据
    private addMaskClickListener:(...args:any[])=>void;
    private allLoaded:boolean = false;//领退料是否加载完
    private addgoods:boolean = false;//显示领退料单
    private hideMask:()=>void;
    private showMask:()=>void;
    private isSearch:boolean = false; //订货查询
    //搜索时的查询条件
    private searchParam:any={
      billType:'',
      Warehouse:'',
      startDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
      endDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')
    };
     /**
      * 单据类型  领退料仓库
      */
     private orderType=[{   
        name: '领料单',
      }, {
        name: '退料单',
      }]
    created() {
      this.tabList.push({
        name:"领料待审",
        status:1,
        active:true,
      },{
        name:"领料已审",
        status:2,
        active:false
      },{
        name:"退料待审",
        status:3,
        active:false
      },{
        name:"退料已审",
        status:4,
        active:false
      });
      const factory = FactoryService.getInstance().createFactory();
      this.service = factory.createLeadbackMaterial();
      this.pager= new Pager();   
      this.pager.setLimit(20);
      this.getList();  
    }
    mounted(){   
      /**
       * 点击遮罩层
       * */   
      this.addMaskClickListener(()=>{ 
        this.isSearch=false; 
        this.hideMask();
      });
      if(this.$route.params.purStatus=="领料待审"){
       this.tabList.TabList.forEach((item,index)=>{
         item.active = item.name == this.$route.params.purStatus;
       })
      } 
      if(this.$route.params.purStatus=="领料已审"){
       this.tabList.TabList.forEach((item,index)=>{
         item.active = item.name == this.$route.params.purStatus;
       })
      } 
      if(this.$route.params.purStatus=="退料待审"){
       this.tabList.TabList.forEach((item,index)=>{
         item.active = item.name == this.$route.params.purStatus;
       })
      } 
      if(this.$route.params.purStatus=="退料已审"){
       this.tabList.TabList.forEach((item,index)=>{
         item.active = item.name == this.$route.params.purStatus;
       })
      } 
      this.getList();
    } 
    /**
     * 返回上一页
     */
    private goBack(){
      this.$router.push("/");
    } 
    /**
     * 查询日期限制
     */
     private selectDateChange(val:any){
      (<any>this.$refs.startDate).setMax(new Date(val));
      (<any>this.$refs.endDate).setMin(new Date(val));
    }
    private Material(info:string){
      if(info){
        this.$router.push(info);
      }      
    }
    private tabClick(index:number){
      this.tabList.setActive(index);
      this.allLoaded=false;
      (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
      this.pager.resetStart();//分页加载还原pageNum值
      this.getList();     
    }
    /**
     * 删除按钮
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
     * 左侧滑动删除
     */
    private handlerSwipe(item:any,active:boolean){
      const status = this.tabList.getActive().status;
      if(status =="1" || status =="3"){
         item.active = active;
      }     
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
        this.goodList=res.data.data;
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
    private addPage(){
      this.addgoods = !this.addgoods
      setTimeout(() => {
          this.addgoods = false
      }, 5000);
    }
   /**
    * 查询领退料
    */
   private queryPage(){
      this.isSearch = !this.isSearch;
      this.isSearch?this.showMask():this.hideMask();
   }
   private toSearch(){
      this.isSearch = false;
      this.hideMask();
      this.cache.save(CACHE_KEY.LEADBACKSHEET_SEARCH,JSON.stringify(this.searchParam));
      this.$router.push('/searchLeadbackMaterial');
   }   
   /**
    * 领料单详情   审核领料单
    */
    private MaterialDetails(item:any){  
      let addBillInfo = {};
      let details={}; 
      addBillInfo={
          billno:item.bill_no,
          warehouse:item.warehouse,
          billType:"领料单",
          causeofloss:"提前一天发货",
          remark:item.remark,    
      }  
      details={  
          bill_no:item.bill_no,
          arrive_date:item.arrive_date,
          storehouse:item.storehouse,
          warehouse:item.warehouse,
          remark:item.remark,
      } 
      /**
       * 领退料审核
       */
      if(this.tabList.getActive().status==1){   
        this.cache.save(CACHE_KEY.LEADBACKSHEET_ADDINFO,JSON.stringify(addBillInfo));
        this.$router.push({name:'AuditoleadbackMaterial',query:{pageType:'requisition'}});  
      }
      if(this.tabList.getActive().status==3){   
        this.cache.save(CACHE_KEY.LEADBACKSHEET_ADDINFO,JSON.stringify(addBillInfo));
        this.$router.push({name:'AuditoleadbackMaterial',query:{pageType:'retreating'}});  
      }
      /**
       * 领退料详情
       */
      if(this.tabList.getActive().status==2){
        this.cache.save(CACHE_KEY.LEADBACKSHEET_DETAILS,JSON.stringify(details));
        this.$router.push({name:'LeadbackMaterialDetails',query:{pageType:'requisition'}}); 
      }
      if(this.tabList.getActive().status==4){
        this.cache.save(CACHE_KEY.LEADBACKSHEET_DETAILS,JSON.stringify(details));
        this.$router.push({name:'LeadbackMaterialDetails',query:{pageType:'retreating'}}); 
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
    .search-dialog .weui-cell{
      width: 100%;
      padding: 0 0;
      
    }
    .ezt-add-content{
      padding-bottom: 0;
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
      width: 20px;
      height: 26px;
      margin-top: 10px;
      display: inline-block;
    }
    //左侧滑动删除
    .ezt-list-show{
      position: relative;
      transition: transform .5s;
      background: #fff;
      z-index: 2;
    }
    .ezt-list-del{
        position: absolute;
        right: -11px;
        width: 50px;
        height: 163px;
        font-size: 25px;
        display: flex;
        align-items: center;
        top: 0;
    }
    .swipe-transform{
      transform: translateX(-50px);
    }
    .addgoods{
      position: absolute;
      top: 44px;
      right: 0;
      width: 120px;
      background: #fff;
      border: 1px solid #ccc;
      ul{

        li{
          border-bottom: 1px solid #ccc;
          color: #000;
          height: 35px;
          line-height: 35px;
          text-align: center;
          cursor: pointer;
        }
        li:last-child{
          border-bottom: none;
        }
      }
    }
</style>
