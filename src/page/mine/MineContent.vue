  <!--首页我的页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="false" title="我的">
      <div slot="action">
          <span>退出</span>
      </div>
    </ezt-header>  
    <div class="ezt-main">   
        <!--内容-->
    </div>
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

</style>
