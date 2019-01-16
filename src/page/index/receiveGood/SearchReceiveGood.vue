<!--收货新增页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='收货单查询'>
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main"> 
      <div class="ezt-add-content" ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
        <ul>
          <li>
            <!--无任何数据时 -->
            <div v-if="goodList.length==0" class="done-none">
              <div></div>
              <span>查无结果</span>
            </div> 
              <!-- 收货单列表       -->
            <div class="receive-dc-list" v-if="goodList.length>0" v-for="(item,index) in goodList" :key="index" @click="toPage(item,'')">
              <div class="receive-icon-title">
                <span class="receive-icon-dcName type">{{item.type == 'SCM_RECEIVE_TYPE_INVOICE'? '配' : "无"}}</span>
                <span class="return-list-title">{{item.dc_name || item.outOrganName}}</span> 
                <span class="receive-status">已完成</span>
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
                  <span>金额：￥{{item.totalAmt}}</span>
                </div>
              </div>
            </div>
            <span v-show="allLoaded">没有更多数据</span>  
          </li>
        </ul>
      </div>      
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager';
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../../helper/maskMixin";
import { FactoryService } from '../../../factory/FactoryService';
import { IReceiveGoodService } from '../../../interface/service/IReceiveGoodService';
import CACHE_KEY from '../../../constans/cacheKey'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
@Component({
  mixins:[maskMixin],
  computed:{
    ...mapGetters({
      'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',
    })
  },
})
export default class ReceiveGood extends Vue{
  private cache = CachePocily.getInstance();
  private service: IReceiveGoodService;
  private pager:Pager;
  private hideMask:()=>void;
  private showMask:()=>void;
  private searchParam:{}={};
  private goodList: any[]=[];
  private InterfaceSysTypeBOH:boolean;
  /**
   * 数据是否已经全部加载完
   */
  private allLoaded:boolean= false;
  created() {     
    this.pager = new Pager()
    const factory = FactoryService.getInstance().createFactory();
    this.service = factory.createReceiveGood();
  }

  mounted(){  
    if(this.cache.getData(CACHE_KEY.RECEIVE_SEARCH)){
      this.searchParam = JSON.parse(this.cache.getData(CACHE_KEY.RECEIVE_SEARCH));
      this.service.searchList(this.searchParam,this.pager.getPage()).then(res=>{
        if(res){
          this.goodList = res.data.list; 
        }
      })
    }
    console.log(this.searchParam,'00000');
  }

  //详情页跳转
  private toPage(item:any,info:string){
    let confirmGoodInfo = {};
    let detailList = {};
    detailList = {
      dc_name:item.dc_name || item.outOrganName,
      bill_no:item.bill_no||item.billNo,   
      id: item.id,  
      submitType:item.type        
    }
    this.cache.save(CACHE_KEY.RECEIVE_DETAILLIST,JSON.stringify(detailList));
    this.$router.push('/checkDetail');
  }  
  
  //下拉加载更多
  private loadMore() {
    if(!this.allLoaded && this.goodList.length >= this.pager.getPage().limit){
      this.showMask();
      this.$vux.loading.show({
        text:'加载中..'
      });
      this.pager.setNext();
      this.service.searchList(this.searchParam,this.pager.getPage()).then(res=>{  
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
}
</script>

<style lang="less" scoped>
  .ezt-title-search{
    background: #fff;
  }
 .ezt-title-search li{
    padding: 10px;
    border-bottom: 1px solid #E0EBF9;
    text-align: left;
    display: flex;
    flex-direction: row;
 }
 .ezt-title-search li:last-child{
   background:none;
   padding: 4px 0px;
 }
 .title-search-name{
   flex:1;
 }
 .ezt-two-btn{
    width: 40px;
    margin: 0 auto;
    border-radius: 8px;
    padding: 6px 11px;
    text-align: center;
 }
 .icon-trun-on{
   margin-left: 10px;
 }
</style>
