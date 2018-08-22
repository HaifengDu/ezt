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
                </div>
                <div class="login-from-item">
                    <div class="i-index"><i class="fa fa-user" aria-hidden="true"></i></div>
                    <input type="text" v-model="user.loginname" placeholder="请输入用户名"/>
                </div>
                <div class="login-from-item">
                    <div class="i-index"><i class="fa fa-lock" aria-hidden="true"></i></div>
                    <input type="password" v-model="user.pwd" placeholder="请输入密码"/>
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
@Component
export default class Login extends Vue{
    private user:IUser={};
    
    private check(){
        if(!this.user.shopname){
            return new ErrorMsg(false,"商户名不能为空");
        }
        if(!this.user.loginname){
            return new ErrorMsg(false,"用户名不能为空");
        }
        if(!this.user.pwd){
            return new ErrorMsg(false,"密码不能为空");
        }
        return new ErrorMsg(true)
    }

    private login(){
        const checkResult = this.check();
        if(!checkResult.success){
            this.$toasted.show(checkResult.message as string);
            return;
        }
        console.log("登录")
    }
}
</script>
<style lang="less" scoped>
.logo{
    margin-top:60px;
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


