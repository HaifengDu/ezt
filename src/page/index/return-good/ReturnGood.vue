<!--整体页面的头部布局-->
<template>
<div class="ezt-page-con">
    <ezt-header :back="true" title="退货">
       <div slot="action">
           <span>退货</span>
       </div>
    </ezt-header>    
    <div class="ezt-main">
      <div class="ezt-add-content">
        <!-- 退货单列表 布局-->
        <div class="return-dc-list">
          <div>
            <span class="return-list-title">入库编号：111111</span>
            <span class="return-turn-icon"></span>
          </div>
          <div class="return-list-content">
            <div class="return-cot-l">
                <span class="return-dc-content"><p class="return-dc-title">配送中心：</p>222</span>
                <span class="return-dc-content"><p class="return-dc-title">单据金额：</p>333</span>
                <span class="return-dc-content"><p class="return-dc-title">调整时间：</p>444</span>
            </div>
            <span class="return-ys-btn">申请退货</span>
          </div>
        </div>
        <!-- 收货单列表 布局-->
        <div class="receive-dc-list">
          <div class="receive-icon-title">
            <span class="receive-icon-dcName"></span>
            <span class="return-list-title">'item.dc_name'</span> 
            <span class="receive-status">待审核</span>
            </div>
          <div class="receive-icon-content">
            <span class="receive-dc-title">订单编号：<span class="receive-dc-content">'item.bill_no'</span></span>
            <div style="display:flex">
              <span class="receive-dc-title">到货日期：<span class="receive-dc-content">'item.arrive_date'</span></span>
              <span class="receive-dc-title">要货日期：<span class="receive-dc-content">'item.ask_goods_date'</span></span>
            </div>
            <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">'item.details'</span></span>
          </div>
          <div class="receive-icon-bottom">
            <div class="glow-1">
              <span>共item.material_size件货品<span class="receive-total">合计：￥434</span></span>
            </div>
            <div>
              <span class="receive-ys-btn">验收</span>
            </div>
          </div>
        </div>
        <!-- 退货清单、收货详情物品列表 开始 -->
        <div class="detail-content-list">
          <div class="detail-detaillist-title">
            <div>item</div>
            <span>编码：item.material_num</span>
          </div>
          <div class="detail-detaillist-cot" >
            <div class="detail-list-left">单价：<span class="detail-list-right">￥11</span></div>
            <div class="detail-list-left">规格：<span class="detail-list-right">￥22</span></div>
          </div>
          <div class="detail-detaillist-bot" >
            <span class="detail-list-left">应收：{{3}}</span>
            <span class="detail-act-right"><span>实收：</span><input type="number" value='222'></span>
          </div>
        </div>      
      </div>
      
    </div>    
    <ezt-footer :isShow="true">
      <div slot="comfirm">
        提交
      </div>
    </ezt-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
declare var mobiscroll:any;
@Component({
   components:{
  
   }
})
export default class Index extends Vue{
  
    created() {
      
    }
    mounted(){
      
    }
   
}
</script>

<style lang="less" scoped> 
  .ezt-add-content{
    // position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 70px;
    width: 100%;
    height: 100%;
  }

</style>
