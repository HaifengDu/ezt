<!--收货新增页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='收货单查询'>
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main"> 
      <div class="ezt-add-content">
        <ul>
          <li>
              <!-- 收货单列表       -->
            <div class="receive-dc-list">
              <div class="receive-icon-title">
                <span class="receive-icon-dcName"></span>
                <span class="return-list-title">dc_name}}</span> 
                <span class="receive-status">已完成</span>
              </div>
              <div class="receive-icon-content">
                <span class="receive-dc-title">订单编号：<span class="receive-dc-content">item.bill_no</span></span>
                <div style="display:flex">
                  <span class="receive-dc-title">到货日期：<span class="receive-dc-content">item.arrive_date</span></span>
                  <span class="receive-dc-title">要货日期：<span class="receive-dc-content">item.ask_goods_date</span></span>
                </div>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">item.details</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                  <span>共2件货品<span class="receive-total">合计：￥434</span></span>
                </div>
              </div>
            </div>
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
import {TabItem} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../../helper/maskMixin";
import { INoop, INoopPromise } from '../../../helper/methods';
import { ReceiveGoodService} from '../../../service/ReceiveGoodService';
import CACHE_KEY from '../../../constans/cacheKey'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
declare var mobiscroll:any;
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
      //  'goodList':'receiveGood/goodList'
     })
   },
  //  methods:{
  //    ...mapActions({
  //      'getGoodList':"receiveGood/getGoodList"
  //    })
  //  }
})
export default class ReceiveGood extends Vue{
    private cache = CachePocily.getInstance(ECache.LocCache);
    private service: ReceiveGoodService;
    private pager:Pager;
    private hideMask:()=>void;
    private showMask:()=>void;
    private searchParam:{}={};
    created() {     
       this.pager = new Pager()
       this.service = ReceiveGoodService.getInstance();
    }

    mounted(){  
      if(this.cache.getData(CACHE_KEY.RECEIVE_SEARCH)){
        this.searchParam = this.cache.getDataOnce(CACHE_KEY.RECEIVE_SEARCH);
      }
      console.log(this.searchParam,'00000');
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
