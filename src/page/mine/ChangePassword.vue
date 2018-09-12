  <!--修改密码-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title="修改密码" @goBack="goBack"></ezt-header>  
    <div class="ezt-main">   
        <!--内容-->
        <div class="ezt-add-content">
            <ul class="ezt-title-search">
                <li>
                    <span class="title-search-name">原密码：</span>
                    <input type="password" class="ezt-middle" placeholder="请输入密码" v-model="password.oldPassword">
                </li>
                 <li>
                    <span class="title-search-name">新密码：</span>
                    <input type="password" class="ezt-middle" placeholder="请输入新密码" v-model="password.newPassword">
                </li>
                 <li>
                    <span class="title-search-name">确认新密码：</span>
                    <input type="password" class="ezt-middle" placeholder="请再次输入新密码" v-model="password.rePassword">
                </li>
            </ul>
            <div class="mine-bot-btn">
                <span class="ezt-lone-btn" @click="confirmModify">确认修改</span>
            </div>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import ErrorMsg from "../../model/ErrorMsg"
import LoginService from "../../service/LoginService"
import { CachePocily } from "../../common/Cache";
import { ECache } from "../../enum/ECache";
import { cacheKey } from "../../config/cacheKey";
import { setTimeout } from 'timers';
@Component({
   components:{
  
   }
})
export default class Index extends Vue{
    private password:any={};
    private service:LoginService;
    private cache = CachePocily.getInstance(ECache.LocCache);
  
    created() {
      this.service = LoginService.getInstance();
    }
    mounted(){
      
    }
    /**
     * 确认修改密码
     */
    private confirmModify(){
        if(!this.password.oldPassword){
            this.$toasted.show("请输入原始密码！");
            return false;
        }
        if(!this.password.newPassword){
            this.$toasted.show("请输入新密码！");
            return false;
        }
        if(!this.password.rePassword){
            this.$toasted.show("请再次输入新密码！");
            return false;
        }
        let user = this.cache.getData(cacheKey.USER_MODEL);
        let userName = JSON.parse(user);
        if(userName.pwd!=this.password.oldPassword){
            this.$toasted.show("原始密码不正确！");
            return false;
        }
        if(this.password.oldPassword==this.password.newPassword){
            this.$toasted.show("新密码不能与原始密码相同！");
            return false;
        }
        if(this.password.newPassword != this.password.rePassword){
            this.$toasted.show("确认密码与新密码不相同！");
            return false;
        }
        this.service.modifyPassword(this.password.oldPassword,this.password.newPassword).then(res=>{            
            this.$toasted.show("修改成功，请重新登录");
            setTimeout(()=>{
                this.$router.replace({path:'/login'})
            },1000)           
        },err=>{       
            this.$toasted.show(err.message);
        })
        
    }
    /**
     * 返回
     */
    private goBack(){
        this.$router.push('/mine');
    }
   
}
</script>

<style lang="less" scoped>
  .mine-bot-btn{
    width: 100%;
    // position: absolute;
    margin-top: 60px;
        .ezt-lone-btn{
        display: inline-block;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        padding: 10px 120px;
        border-radius: 40px;
        background-image: -webkit-gradient(linear, left top, right top, from(#5A12CC), to(#3C82FB));
        background-image: linear-gradient(90deg, #018BFF 0%, #4A39F3 100%);
        -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
        box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);   
    }
  }
  
.ezt-title-search li{
    margin: 0px 10px;
    padding: 10px 0px;
}
</style>
