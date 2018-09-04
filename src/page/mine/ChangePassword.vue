  <!--修改密码-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title="修改密码"></ezt-header>  
    <div class="ezt-main">   
        <!--内容-->
        <div class="ezt-add-content">
            <ul class="ezt-title-search">
                <li>
                    <span class="title-search-name">原密码：</span>
                    <input type="password" class="ezt-middle" placeholder="输入旧密码">
                </li>
                 <li>
                    <span class="title-search-name">新密码：</span>
                    <input type="password" class="ezt-middle" placeholder="请设置新密码">
                </li>
                 <li>
                    <span class="title-search-name">确认新密码：</span>
                    <input type="password" class="ezt-middle" placeholder="确认密码">
                </li>
            </ul>
            <div class="mine-bot-btn">
                <span class="ezt-lone-btn">确认修改</span>
            </div>
        </div>
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
  .mine-bot-btn{
    width: 100%;
    // position: absolute;
    margin-top: 60px;
  }
  .ezt-lone-btn{
    display: inline-block;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;
    padding: 10px 130px;
    border-radius: 40px;
    background-image: -webkit-gradient(linear, left top, right top, from(#5A12CC), to(#3C82FB));
    background-image: linear-gradient(90deg, #018BFF 0%, #4A39F3 100%);
    -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
    box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);   
}
.ezt-title-search li{
    margin: 0px 10px;
    padding: 10px 0px;
}
</style>
