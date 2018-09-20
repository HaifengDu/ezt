  <!--首页的报表页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="false" title="报表">
      <div slot="action">
          <span>搜索</span>
      </div>
    </ezt-header>  
    <div class="ezt-main">  
        <!--内容-->
       
    </div>
    <ezt-footer>
      <ul slot="confirm" class="ezt-footer-tab">
        <li @click="renderUrl('/')">
          <span class="footer-index"></span>
          <div>首页</div>
        </li>
        <li @click="renderUrl('/orderGood')">
          <span class="footer-order"></span>
          <div>订货</div>
        </li>
        <li @click="renderUrl('/chartContent')" class="active">
          <span class="footer-chart"></span>
          <div>报表</div>
        </li>
      </ul>
    </ezt-footer>
  </div>

</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator'
@Component({

})
export default class Chart extends Vue{

     //首页菜单跳转
    private renderUrl(info:string){
      if(info){
        this.$router.push(info);
      }     
    }
}
</script>

