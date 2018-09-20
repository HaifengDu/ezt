<!--订货单查询-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='订货单查询' @goBack="goBack">
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main"> 
      <div class="ezt-add-content">
        <ul>
          <li>
             <!-- 订货单列表  -->
            <div class="receive-dc-list">
              <div class="receive-icon-title">
                <span class="receive-icon-dcName">配</span>
                <span class="return-list-title">dc_name}}</span> 
                <!-- <span class="receive-status">已完成</span> -->
              </div>
              <div class="receive-icon-content">
                <span class="receive-dc-title">单号：
                  <span class="receive-dc-content">item.bill_no</span>
                </span>
                <div style="display:flex">
                  <span class="receive-dc-title">要货日期：
                    <span class="receive-dc-content">item.ask_goods_date</span>
                  </span>
                  <span class="receive-dc-title">到货日期：
                    <span class="receive-dc-content">item.arrive_date</span>
                  </span>
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
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../helper/maskMixin";
import { INoop, INoopPromise } from '../../../helper/methods';
import { OrderGoodsService} from '../../service/OrderGoodsService';
declare var mobiscroll:any;
@Component({
   components:{
     
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
export default class OrderGoods extends Vue{
    private service: OrderGoodsService;
    private searchParam:String = "";

    created() {     
       this.service = OrderGoodsService.getInstance();
    }

    mounted(){      
      this.searchParam = this.$route.params.obj;
      console.log(this.searchParam,'00000');
    }
   
    private goBack(){
      this.$router.push('/orderGood');
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
</style>
