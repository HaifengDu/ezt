<!--订单模块首页-->
<template>
<div>
   <div class="ezt-page-con orderList"  ref="listContainer" v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
    <ezt-header :back="false" title="订货">
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
            <li @click="toPage('/addOrderGood')">配送要货</li>
            <li>供应商订货</li>
          </ul>
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
        <!-- 订货单列表  -->
          <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index">
            <div class="ezt-list-show" v-swipeleft="handlerSwipe.bind(this,item,true)"  v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}" >
              <div class="receive-icon-title">
                <span class="receive-icon-dcName">配</span>
                <span class="return-list-title">{{item.dc_name}}</span> 
                <span class="receive-status" v-if="tabList.getActive().status==0"  @click.stop="toexamine('examine',item)">审核未通过</span>
                <span class="receive-status" @click.stop="morelist('add',item)" v-if="tabList.getActive().status==1 || (tabList.getActive().status==2&&!InterfaceSysTypeBOH)">再来一单>></span>
              </div>
              <div class="receive-icon-content" @click="orderdetails('payMent')">
                <span class="receive-dc-title">单号：<span class="receive-dc-content">{{item.bill_no}}</span></span>
                <!-- <div style="display:flex"> -->
                  <span class="receive-dc-title">要货日期：
                    <span class="receive-dc-content">{{item.ask_goods_date}}</span>  
                  </span>
                  <span class="receive-dc-title">到货日期：
                    <span class="receive-dc-content">{{item.arrive_date}}</span>
                  </span>
                <!-- </div> -->
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                  <span>共{{item.material_size}}件货品<span class="receive-total">合计：￥434</span></span>
                </div>
                <!-- <div>
                  <span class="receive-ys-btn" v-if="tabList.getActive().status==1">验收</span>
                </div> -->
                <div class="receive-ys"  v-if="tabList.getActive().status==3">已收</div>
              </div>
            </div>
            <div class="ezt-list-del" @click="deleteBill(item)">
              <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>
         <span v-show="allLoaded">已全部加载</span>          
      </div>
    </div>
    <ezt-footer>
      <ul slot="confirm" class="ezt-footer-tab">
        <li @click="toPage('/')" >
          <span class="footer-index"></span>
          <div>首页</div>
        </li>
        <li @click="toPage('/orderGood')" class="active">
          <span class="footer-order"></span>
          <div>订货</div>
        </li>
        <li @click="toPage('/chartContent')">
          <span class="footer-chart"></span>
          <div>报表</div>
        </li>
      </ul>
    </ezt-footer>
  </div>
  <!-- 查询订货 -->  
  <div v-show="isSearch" class="search-dialog orderList">
      <ul class="ezt-title-search">
       <li class="select-list">
        <span class="title-search-name ">订货类型：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select" v-model="searchParam.orderType">
            <option style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
      <li class="select-list">
        <span class="title-search-name ">供货机构：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select" v-model="searchParam.supplyAgency">
            <option style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
       <li class="select-list" v-if="!InterfaceSysTypeBOH">
        <span class="title-search-name ">支付类型：</span> 
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select" v-model="searchParam.paymentType">
            <option style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in paymentType">{{item.name}}</option>
          </select>
        </span>
      </li> 
      <li>   
        <span class="title-search-name">业务日期：</span>
        <span>
          <ezt-canlendar placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
            <span>至</span>   
          <ezt-canlendar placeholder="结束时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
        </span>
      </li>
      <li>
        <x-input title="单据或物料：" v-model="searchParam.materiel" placeholder="输入单据号和物料名称查询"></x-input>
      </li>
      <li>
        <div class="ezt-two-btn" @click="toSearch">查询</div>
      </li>
    </ul>
  </div> 
  <!-- 判断供货物料是否发生变化。当最新供货物料发生变化，源订单中部分物品当前已停止供应时 -->
   <!-- <confirm v-model="isMaterielChange" confirm-text="继续下单" @on-confirm="onConfirm">
        <p style="text-align:center;"> ***【供货机构名称】的****【物料名称】已停止供货，请确认是否跳过此物料继续下单。</p>
   </confirm> -->
  <!-- 当源订单所有物品均以停供时 -->
   <!-- <confirm v-model="isCommodity" confirm-text="手工订货" @on-confirm="onConfirm">
        <p style="text-align:center;">您选择的订单物料已停止供货，请选择其它方式订货。</p>
   </confirm> -->
   <!--待审核状态下的列表数据删除提示 -->
   <!-- <confirm v-model="isDelete" @on-confirm="Confirm" @on-cancel="Cancel">
        <p style="text-align:center;">是否要删除该单据？</p>
   </confirm> -->
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "./model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../common/Pager';
import {TabItem,LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../helper/maskMixin";
import { INoop, INoopPromise } from '../../helper/methods';
import { TabList } from '../../common/ITab';
import {OrderGoodsService} from '../../service/OrderGoodsService';
import { CachePocily } from "../../common/Cache";
import {ECache} from '../../enum/ECache';
import CACHE_KEY from '../../constans/cacheKey'
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
         InterfaceSysTypeBOH:'InterfaceSysTypeBOH',
     })
   },
   methods:{
     ...mapActions({

     })
   }
})
export default class OrderGoods extends Vue{
    private cache = CachePocily.getInstance();
    private InterfaceSysTypeBOH:boolean;
    private pager:Pager;
    private service: OrderGoodsService;
    private tabList:TabList = new TabList();
    private goodList:any[] = [];//列表页list数据
    private allLoaded:boolean= false;//数据是否已经全部加载完
    private addMaskClickListener:(...args:any[])=>void;
    private hideMask:()=>void;
    private showMask:()=>void;
    private addgoods:boolean = false;  //显示配送要货
    private isSearch:boolean = false; //订货查询
    private searchParam:any={};//搜索时的查询条件
    private orderType:any=[{
      name:'仓库1',
      id:'01'
    }]
    private paymentType:any=[{
      name:'月结',
      id:'01',
      },{
      name:'下单即支付',
      id:'02',
      },{
      name:'货到付款',
      id:'03',
      },
    ]
    created() {
      this.tabList.push({
        name:"待审核",
        status:0,
        active:true,
      })
       this.service = OrderGoodsService.getInstance();
       this.pager= new Pager();
       this.pager.setLimit(20);
       this.getList();  
       this.searchParam = {};   
       /**
        * saas有待支付
        */
        if(!this.InterfaceSysTypeBOH){
          this.tabList.push({
            name:"待支付",
            status:1,
            active:false
          },{
            name:"已完成",
            status:2,
            active:false
          })
        }else{    //BOH没有待支付
          this.tabList.push({          
            name:"已完成",
            status:2,
            active:false      
          })
        } 
    }
    mounted(){      
      this.getList();
      this.addMaskClickListener(()=>{  //点击遮罩隐藏下拉
        this.isSearch=false; 
        this.hideMask();
      });
      if(this.$route.params.purStatus=="待支付"){//tab 哪个是选中状态
        this.tabList.TabList.forEach((item,index)=>{
          if(item.name == this.$route.params.purStatus){
            item.active = true;
          }else{
            item.active = false;
          }
        })
      }  
    } 
    private tabClick(index:number){
      this.tabList.setActive(index);
      this.allLoaded=false;
      (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
      this.pager.resetStart();//分页加载还原pageNum值
      this.getList();     
    }  
    // 点击删除按钮
    private deleteBill(item:any){
      let _this = this;
      this.$vux.confirm.show({
        // 组件除show外的属性
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
        content:'是否要删除该单据？'
      })
    }
    //下拉加载更多
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
        (this.goodList||[]).forEach(item=>this.$set(item,'active',false));
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
     * 左侧滑动删除
     */
    private handlerSwipe(item:any,active:boolean){
      const status = this.tabList.getActive().status;
      if(status =="1"){
         item.active = active;
      }     
    }
    private addPage(){
      this.addgoods = !this.addgoods
      setTimeout(() => {
          this.addgoods = false
      }, 5000);
    }
    //首页菜单跳转
    private toPage(info:string){
      if(info){
        this.$router.push(info);
      }      
    }
   // 查询订货
   private queryPage(){
      this.isSearch = !this.isSearch;
      this.isSearch?this.showMask():this.hideMask();
   }
   private toSearch(){
      this.isSearch = false;
      this.hideMask();
      this.cache.save(CACHE_KEY.INITSTOCK_SEARCH,JSON.stringify(this.searchParam));
      this.$router.push('/searchOrderGood');
   }
   // 跳转详情页面
    private orderdetails(info:any){
      if(this.tabList.getActive().status==2){//已完成，只查看详情
        this.$router.push({name:"OrderDetails",params:{'isPayMent':'false'}});
      }
      if(this.tabList.getActive().status ==1 && info == 'payMent'){//待支付，有支付
        this.$router.push({name:"OrderDetails",params:{'isPayMent':'true'}});
      }
    }   
    // 审核要货单
    private toexamine(type:any,item:any){   
      let OrderModule = {}; 
      if(this.tabList.getActive().status==0){
         OrderModule={
          billno:item.bill_no,
          unit:'供应商1号',
          orderDate:item.ask_goods_date,   
          arriveDate:item.arrive_date,
          remark:'提前一天联系供应商',        
        }   
        this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(OrderModule));
        this.$router.push({name:'AuditInvoice',query:{type:type}});  
      }
     }     
    //  再来一单 
    private morelist(type:any,item:any){
      let addInfo = {};
      let _this = this;
       if(this.tabList.getActive().status==1 || this.tabList.getActive().status==2){
        addInfo={
          type:type,
          billno:item.bill_no,
          unit:'供应商1号',
          orderDate:item.ask_goods_date,   
          arriveDate:item.arrive_date,
          remark:'提前一天联系供应商',
        }
        if(true){
          /**
           * 部分物品停货
           */
          this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {
              
            },
            onConfirm () {
              _this.$set(addInfo,'billTypes','handlers');
              // addInfo.billTypes = 'handlers';
              _this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(addInfo));
              _this.$router.push({name:'AuditInvoice',query:{type:type}}); 
            },
            content:'***【供货机构名称】的****【物料名称】已停止供货，请确认是否跳过此物料继续下单。',
            confirmText:"继续下单"
          })
        }else{
           /**
           * 所有物品停货
           */
          this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {
            
            },
            onConfirm () {
              // addInfo.billTypes = 'handlers'
              _this.$set(addInfo,'billTypes','handlers');
              _this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(addInfo));
              _this.$router.push('/addOrderGood'); 
            },
            content:'您选择的订单物料已停止供货，请选择其它方式订货。',
            confirmText:"手工订货"
          })
        }
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
    .ezt-action-point{
      margin-top: 10px;
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
    }
    .ezt-action-point{
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
    .ezt-list-del{
       position: absolute;
        right: 12px;
        top: 42px;
        // background: pink;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 22px;
    }
    .swipe-transform{
      transform: translateX(-50px);
    }
    //
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
    .receive-icon-dcName, .receive-icon-orderName {
        display: inline-block;
        vertical-align: middle;
        margin: 0px 3px 0px 10px;
        opacity: 0.7;
        border-radius: 4px;
        font-size: 12px;
        color: #fff;
        width: 20px;
        height: 20px;
        line-height: 22px; 
        text-align: center;
        font-style: normal;
      }

      .receive-icon-dcName {
        background: linear-gradient(-139deg, #FFB38F 0%, #FF9FA7 100%);
      }

      .receive-icon-orderName {
        background: linear-gradient(-135deg, #FFBE4E 0%, #FE9E49 100%);
      }

      // 订货查询
      .search-dialog{
        width: 100%; 
        position:absolute;
        top:45px; 
        z-index:10001;
      }
</style>
