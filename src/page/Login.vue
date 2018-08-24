<template>
    <div class="login">
        <div class="logo">
            <i></i>
            <span>E掌通</span>
        </div>    
        <div class="from-main">
            <div class="login-form">
                <div class="login-from-item">
                    <group>
                      <div class="i-index"><img src="../assets/images/merchant.png"/></div>
                      <x-input :max="20" v-model="user.shopname" placeholder="请输入商户"></x-input>
                    </group>
                </div>
                <div class="login-from-item">
                    <group>
                      <div class="i-index"><i class="fa fa-user" aria-hidden="true"></i></div>
                      <x-input :max="20" v-model="user.loginname" placeholder="请输入用户名"></x-input>
                    </group>
                </div>
                <div class="login-from-item">
                     <group>
                      <div class="i-index"><i class="fa fa-lock" aria-hidden="true"></i></div>
                      <x-input :max="20" type="password" v-model="user.pwd" placeholder="请输入密码"></x-input>
                    </group>
                </div>
            </div>
            <div class="login-btn">
                <p @click="login">登录</p>
            </div>
        </div>
        <div class="footer">©北京普照天星科技有限公司</div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import IUser from "../interface/IUserModel"
import ErrorMsg from "../model/ErrorMsg"
import LoginService from "../service/LoginService"
@Component
export default class Login extends Vue{
    private user:IUser={};
    private service:LoginService;
    created() {
        this.service = LoginService.getInstance();
    }

    private clear(key:string){
        this.user[key] = '';
    }

    private login(){
        this.service.login(this.user).then(res=>{
            console.log("登录成功");
            this.$router.replace({path:'/'})
        },err=>{
            this.$toasted.show(err.message);
        });
    }
}
</script>
<style lang="less" scoped>
.login{
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    align-items: center;
    flex-direction: column;
    right: 0;
    bottom: 0;
  .logo{
    display: flex;
    margin-top:60px;
    align-items: center;
    flex-direction: column;
    i{
        background: url("../assets/images/logo.png") 0 0 no-repeat;
        display: block;
        width: 70px;
        height: 70px;
        background-size: 70px 70px;
        margin-bottom: 20px;
    }
    span{
        font-family: ".PingFangSC-Light";
        font-size: 18px;
        color: #273C58;
        opacity: 0.71;
    }
}
.from-main{
    position:absolute;
    bottom: 20%;
    justify-content: center;
    text-align: center;
    width:100%;
    .login-form{
        width:85%;
        margin:0 auto;
        margin-bottom:40px;
        .login-from-item{
            margin-bottom:25px;
            position: relative;
            .i-index{
                position: absolute;
                bottom: 11px;
                img,i{
                    width:1.5rem;
                    height: 1.5rem;
                    color:#87abc6;
                }
                &.index-right{
                    right: 0;
                }
            }
            input{
                border:0;
                height: 1.5rem;
                width:100%;
                margin-left:1.7rem;
                user-select: none;
                outline:none;
            }
        }
    }
    .login-btn p{
        width: 90%;
        height: 50px;
        line-height: 50px;
        border-radius: 30px;
        margin: 0 auto;
        font-size:18px;
        color: #FFFFFF;
        cursor: pointer;
        letter-spacing: 0;
        background-image: linear-gradient(90deg, #3C82FB 0%, #5A12CC 100%);
        box-shadow: 0 3px 10px 0 rgba(60,130,251,0.43);
    }
  }  
  .footer{
    position: absolute;
    bottom: 20px;
    font-size: 12px;
    color: #C1CFDE;
 }
}
</style>
