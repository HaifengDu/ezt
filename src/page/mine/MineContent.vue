  <!--首页我的页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title="我的" @goBack="goBack"></ezt-header>  
    <div class="ezt-main">   
        <!--内容-->
         <div class="ezt-add-content">
           <div class="mine-info">
             <a class="mine-css"></a>
             <div class="mine-info-r">
               <span class="mine-title-name">{{user.auth.username||'--'}}</span>
               <span class="mine-store-name">{{user.auth.store_name||'--'}}</span>
             </div>
           </div>
           <div class="mine-action">
            <div class="mine-action-title">
              <span class="mine-funds return-dc-content">资金管理</span>
              <span class="return-dc-title">余额：<span class="ezt-money-font">￥{{balancAmt}}</span></span>
            </div>
            <ul class="mine-action-name">
              <li>
                <div class="chongzhi"></div>
                <span>充值</span>
              </li>
              <li>
                <div class="jyjl"></div>
                <span>交易记录</span>
              </li>
            </ul>
           </div>
           <ul class="mine-action-list">
             <li class="mine-modify" @click="renderUrl('/changePsd')">
                <span class="title-search-name">修改密码</span>
                <span class="title-search-right">
                  <i class="fa fa-angle-right" aria-hidden="true"></i>
                </span>
             </li>
             <li class="mine-modify" @click="renderUrl('/systemSetting')">
                <span class="title-search-name">系统设置</span>
                <span class="title-search-right">
                  <i class="fa fa-angle-right" aria-hidden="true"></i>
                </span>
             </li>
           </ul>
           <div class="mine-bot-btn" @click="logout">
             <span class="ezt-lone-btn">退出</span>
           </div>
         </div>
    </div>
     <!-- 返回时提示保存信息 -->
      <confirm v-model="isExit" @on-confirm="onConfirm">
        <p style="text-align:center;"> 返回后，本次操作记录将丢失，请确认是否离开？</p>
      </confirm>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import IUser from "../../interface/IUserModel"
import LoginService from "../../service/LoginService"
import {mapGetters} from "vuex";
declare var mobiscroll:any;
@Component({
   components:{
  
   },
  computed:{
    ...mapGetters({
      "user":"user"
    })
  }
})
export default class Mine extends Vue{
  private users:IUser;
  private service:LoginService;
  private balancAmt:number=0;
  private isExit:boolean=false;
  
  created() {
    this.service = LoginService.getInstance();     
    this.checkBalance();
  }
  mounted(){
    
  }
  //去修改密码
  private renderUrl(info:string){
    this.$router.push(info);
  }
  //退出
  private logout(){
    this.isExit= true;   
  }
  private onConfirm(){
    this.service.logout().then(res=>{
      this.$router.replace({path:'/login'});
    });
  }
  /**
   * 查询余额
   */
  private checkBalance(){
    this.service.checkBalance().then(res=>{
      this.balancAmt=res.data.data[0].balance_amount
    })
  }
  //后退
  private goBack(){
    this.$router.push("/")
  }
   
}
</script>

<style lang="less" scoped>
  .mine-bot-btn{
    width: 100%;
    position: absolute;
    margin-top: 20px;
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
  }
 
 /* 我的用户头像 */
  .mine-css{
    display: inline-block;
    width: 40px;
    height: 40px;
    background: url(../../assets/images/user_logo.png) 0 0 no-repeat;
    background-size: 40px 40px;
    margin: 0px 10px 0px 14px;;
  }
  .mine-info{
    background-image: linear-gradient(139deg, #01A1FF -41%, #3945F3 82%);
    background-color: transparent;
    display: flex;
    flex-direction: row;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  .mine-info-r{
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  .mine-title-name{
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;
  }
  .mine-store-name{
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
  }
  .mine-action-title{
    border-bottom: 1px solid #ccc;
    padding-bottom: 6px;
    display:flex;
    flex-direction: row;
  }

  .mine-action{
    background: #FFFFFF;
    margin: 10px 0;
    display:flex;
    text-align: left;
    padding: 14px;
  }
  .mine-action{
    flex-direction: column;
  }
  .mine-action-name{
    display: flex;
    flex-direction: row;
     display: flex;
    flex-direction: row;
    flex: 1;
    line-height: 170%;    
    // padding: 16px;
    margin-top: 16px;
  }
  .mine-action-name li {
    width: 33%;
    float: left;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    // border-right: 1px solid #E1ECFF;
    // border-bottom: 1px solid #E1ECFF;
  }
  .mine-funds{
    border-left: 5px solid #0d7dfd;
    padding-left: 4px;   
    flex:5; 
  }
  .return-dc-title{
    flex:10;
  }
  .mine-action-name li{
    flex:1;
  }
  .chongzhi{
    width: 25px;
    height: 25px;
    background: url(../../assets/images/user1.png) 0 0 no-repeat;
    background-size: 25px 25px;
  }
  .jyjl{
    width: 25px;
    height: 25px;
    background: url(../../assets/images/user2.png) 0 0 no-repeat;
    background-size: 25px 25px;
  }
  .mine-action-list{
    background: #fff;
    margin: 10px 0px;
    .mine-modify{
      padding: 10px;
      display:flex;
      text-align: left;
    }  
    li{
      border-top: 1px solid #ccc;
    }
    li:nth-child(1){
      border-top: none;
    }
  }
</style>
