<template>
  <div class="ezt-container">
        <!--tab切换的不同页面对应内容-->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="index">
          <index-content></index-content><!--首页-->        
      </mt-tab-container-item>
      <mt-tab-container-item id="order">
          <order-content></order-content><!--订单-->
      </mt-tab-container-item>
      <mt-tab-container-item id="chart">
          <chart-content></chart-content><!--报表--><!--报表-->
      </mt-tab-container-item>
      <mt-tab-container-item id="mine">
          <mine-content></mine-content><!--报表--><!--报表-->
      </mt-tab-container-item>
    </mt-tab-container>
    <!--首页底部 tab切换-->
    <div class="ezt-bottom">
      <mt-tabbar v-model="selected">
        <mt-tab-item id="index">
          <a slot="icon" class="index-css"></a>
          首页
        </mt-tab-item>
        <mt-tab-item id="order">
          <a slot="icon" class="order-css"></a>
          订单
        </mt-tab-item>
        <mt-tab-item id="chart">
          <a slot="icon" class="chart-css"></a>
          报表
        </mt-tab-item>
        <!-- <mt-tab-item id="mine">
          <a slot="icon" class="mine-css"></a>
          我的
        </mt-tab-item> -->
      </mt-tabbar>
    </div>
    
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import indexContent from './index/IndexContent.vue'
import chartContent from './chart/ChartContent.vue'
import mineContent from './mine/MineContent.vue'
import orderContent from './order/OrderContent.vue'
declare var mobiscroll:any;
@Component({
   components:{
     'index-content':indexContent,    
     'order-content':orderContent,
     'chart-content':chartContent,
     'mine-content':mineContent,
   }
})
export default class Index extends Vue{
   private selected:String = 'index';
    created() {
        console.log(this.selected,'selected')
    }
    mounted(){
      //日历
      mobiscroll.date(this.$refs.canlendar, {
          theme: 'material', 
          display: 'bottom',
          lang: 'zh',
          dateFormat:'yyyy-mm-dd',
          onSet: function(val:string){
              console.log(val,'99')
          }
      });
    }
   
}
</script>
<style lang="less" scoped>
  .mint-tabbar > .mint-tab-item.is-selected{
    background: none;
  }
  .ezt-bottom{
    z-index: 3;
  }
</style>
