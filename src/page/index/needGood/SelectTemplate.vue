<template>
     <div>
       <div class="selectTemplate">
        <div class="templateList">
          <mt-radio
            :max="1"
            align="right"
            v-model="dataItem.name"
            :options="templatelist">
          </mt-radio>
        <div class="nextstep" @click="nextstep">下一步</div>
        </div>
     </div>
   </div>
</template>
<script lang="ts">
import Vue from 'vue'
// import {Component} from "vue-property-decorator"
// import IUser from "../interface/IUserModel"
// import ErrorMsg from "../model/ErrorMsg"
// import loginService,{ LoginService } from "../service/LoginService"
// @Component 

export default class Login extends Vue{
    // private templatelist:Itemplatelist=[];
    // private user:IUser={};
    // private service:LoginService;
    // created() {
    //     this.service = LoginService.getInstance();
    // }

    // private clear(key:string){
    //     this.user[key] = '';
    // }

    // private login(){
    //     this.service.login(this.user).then(res=>{
    //         console.log("登录成功");
    //         this.$router.push({path:'/FormItem'})
    //     },err=>{
    //         this.$toasted.show(err.message);
    //     });
    // }
}
</script>
<style lang="less" scoped>
 .selectTemplate{
      position: absolute;
      left:0;
      top:0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #F1F6FF;
     .templateList{
         width: 100%;
         height: 100%;
         position: relative;
     }
     .nextstep{
        position: absolute;
        bottom: 0;
        line-height: 48px;
        width: 100%;
        height: 46px;
        color: #1188FC;
        background-color: #fff;
        cursor: pointer;
     }
  }
</style>
