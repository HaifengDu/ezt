<!--整体页面的头部布局-->
<template>
<div>
  <div class="ezt-page-con"  ref="listContainer" 
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
        <!-- 收货单列表       -->
          <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click="toPage(item,'')">
            <div class="receive-icon-title">
            <span class="receive-icon-dcName"></span>
            <span class="return-list-title">{{item.dc_name}}</span> 
            <span class="receive-status">{{billStatus}}</span>
            </div>
            <div class="receive-icon-content">
              <span class="receive-dc-title">订单编号：<span class="receive-dc-content">{{item.bill_no}}</span></span>
              <!-- <div style="display:flex"> -->
                <span class="receive-dc-title">到货日期：<span class="receive-dc-content">{{item.arrive_date}}</span></span>
                <span class="receive-dc-title">要货日期：<span class="receive-dc-content">{{item.ask_goods_date}}</span></span>
              <!-- </div> -->
              <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
            </div>
            <div class="receive-icon-bottom">
              <div class="glow-1">
                <span>共{{item.material_size}}件货品<span class="receive-total">合计：￥434</span></span>
              </div>
              <div>
                <span class="receive-ys-btn" v-if="tabList.getActive().status==1">验收</span>
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
        <span class="title-search-name ">收货类型：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select">
            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
        <li class="select-list">
        <span class="title-search-name ">来货单位：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select">
            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
      <li>
        <span class="title-search-name">收货日期：</span>
        <span>
          <ezt-canlendar placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
            <span>至</span>
          <ezt-canlendar placeholder="结束时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
        </span>
      </li>
      <li class="select-list">
        <span class="title-search-name ">仓库：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select">
            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
      <li>
        <span class="title-search-name">源单号：</span>
        <input type="text" class="ezt-middle" placeholder="请输入源单号">
      </li>
      <li>
        <span class="title-search-name">单据：</span>
        <input type="text" class="ezt-middle" placeholder="请输入单据号">
      </li>
      <li>
        <span class="title-search-name">物料：</span>
        <input type="text" class="ezt-middle" placeholder="请输入物料名称">
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
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager';
import {TabItem,LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../../helper/maskMixin";
import { INoop, INoopPromise } from '../../../helper/methods';
import { TabList } from '../../../common/ITab';
import { ReceiveGoodService} from '../../../service/ReceiveGoodService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
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
  private InterfaceSysTypeBOH:boolean;
  private cache = CachePocily.getInstance();
  // private selected:String = 'deliver';
  private service: ReceiveGoodService;
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
  private orderType:any=[{
    name:'仓库1',
    id:'01'
  }]
  created() {
    this.tabList.push({
      name:"待收货",
      status:1,
      active:true,
    },{
      name:"已完成",
      status:3,
      active:false
    });
    this.pager = new Pager().setLimit(20)
    this.service = ReceiveGoodService.getInstance();
  }

  mounted(){      
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
  //详情页跳转
  private toPage(item:any,info:string){
    let confirmGoodInfo = {};
    let detailList = {};
    if(info){
        this.$router.push(info);
        return false;
    }
    if(this.tabList.getActive().status==1){
      confirmGoodInfo={
        bill_no:item.bill_no,
        billType:'合同采购',
        warehouse:'01',
        remark:'在途中',         
      }
      this.cache.save(CACHE_KEY.RECEIVE_BILLTYPE,JSON.stringify("配"))//配、直、调、采
      this.cache.save(CACHE_KEY.RECEIVE_ADDINFO,JSON.stringify(confirmGoodInfo));
      this.$router.push('/comfirmAccept');
    }else if(this.tabList.getActive().status==3){
      detailList = {
        dc_name:"配送中心-8店",
        bill_no:"000111aab",         
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
    return this.tabList.getActive().status==1?'待审核':'已完成';
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
  //获取列表
  private getList(){
    const status = this.tabList.getActive().status;
    this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{
      this.showMask();
      this.$vux.loading.show({
        text: '加载中...'
        });
      this.goodList=res.data.data;
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
    this.isSearch = false;
    this.hideMask();
    this.cache.save(CACHE_KEY.RECEIVE_SEARCH,JSON.stringify(this.searchParam));
    this.$router.push('/searchReceiveGood');
  }  
  private goBack(){
    this.$router.push("/");
  } 
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
   
</style>
