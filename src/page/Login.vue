<template>
    <div>
        <div class="logo">
            <img src="../assets/images/logo.png">
            <div>E掌通</div>
        </div>
        <div class="from-main">
            <div class="login-form">
                <div class="login-from-item">
                    <div class="i-index"><img src="../assets/images/merchant.png"/></div>
                    <input type="text" v-model="user.shopname" placeholder="请输入商户"/>
                    <div class="i-index index-right" @click="clear('shopname')"><i class="fa fa-times" aria-hidden="true"></i></div>
                </div>
                <div class="login-from-item">
                    <div class="i-index"><i class="fa fa-user" aria-hidden="true"></i></div>
                    <input type="text" v-model="user.loginname" placeholder="请输入用户名"/>
                    <div class="i-index index-right" @click="clear('loginname')"><i class="fa fa-times" aria-hidden="true"></i></div>
                </div>
                <div class="login-from-item">
                    <div class="i-index"><i class="fa fa-lock" aria-hidden="true"></i></div>
                    <input type="password" v-model="user.pwd" placeholder="请输入密码"/>
                    <div class="i-index index-right" @click="clear('pwd')"><i class="fa fa-times" aria-hidden="true"></i></div>
                </div>
            </div>
            <div class="login-btn">
                <el-button @click="login" type="primary" round>登录</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator";
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
            this.$router.replace("/");
        },err=>{
            this.$toasted.show(err.message);
        });
    }
}
</script>
<style lang="less" scoped>
.logo{
    margin-top:60px;
    text-align: center;
    img{
        width: 7.5rem;
        height: 7.5rem;
        background-repeat: no-repeat;
    }
}
.from-main{
    position:absolute;
    bottom: 10%;
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
            border-bottom: 1px solid #aaa;
            .i-index{
                position: absolute;
                bottom: -5px;
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
    .login-btn button{
        width: 75%;
    }
}
</style>


