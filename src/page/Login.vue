<template>
    <div class="login">
        <div class="logo">
            <i></i>
            <span>E掌通</span>
        </div>    
        <div class="from-main">
            <div class="login-form">
                <div class="login-from-item" v-if="!InterfaceSysTypeBOH">
                    <div>
                      <div class="i-index"><img src="../assets/images/merchant.png"/></div>
                      <x-input :max="20" v-model="user.shopname" placeholder="请输入商户"></x-input>
                    </div>
                </div>
                <div class="login-from-item">
                    <div>
                      <div class="i-index"><i class="fa fa-user" aria-hidden="true"></i></div>
                      <x-input :max="20" v-model="user.loginname" placeholder="请输入用户名"></x-input>
                    </div>
                </div>
                <div class="login-from-item">
                     <div>
                      <div class="i-index"><i class="fa fa-lock" aria-hidden="true"></i></div>
                      <x-input :max="20" type="password" v-model="user.pwd" placeholder="请输入密码"></x-input>
                    </div>
                </div>
            </div>           
        </div>        
        <div class="login-btn">
            <p @click="login">登录</p>
        </div>
        <div class="footer">©北京普照天星科技有限公司</div>
    </div>
</template>  
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import IUser from "../interface/IUserModel"
import ErrorMsg from "../model/ErrorMsg"
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { FactoryService } from "../factory/FactoryService";
import { ILoginService } from "../interface/service/ILoginService";
import noInput from "../mixin/noInput";

@Component({
    computed:{
    ...mapGetters({
        InterfaceSysTypeBOH:'InterfaceSysTypeBOH'
    }),
   },
    mixins:[noInput]
})
export default class Login extends Vue{
    private InterfaceSysTypeBOH:boolean;
    private user:IUser={};
    private service:ILoginService;
    created() {
        const factory = FactoryService.getInstance().createFactory();
        this.service = factory.createLogin();
    }

    private clear(key:string){
        this.user[key] = '';
    }

    private login(){
        this.service.login(this.user).then(res=>{//SAAS登录 
            console.log("登录成功");
            this.$router.replace({path:'/'})
        },err=>{       
            this.$toasted.show(err.message);
        });    
        // if(!this.InterfaceSysTypeBOH){
        //     this.service.login(this.user).then(res=>{//SAAS登录 
        //         console.log("登录成功");
        //         this.$router.replace({path:'/'})
        //     },err=>{       
        //         this.$toasted.show(err.message);
        //     });
        // }else{
        //     this.BOHservice.login(this.user).then(res=>{//BOH登录 
        //         console.log("登录成功");
        //         this.$router.replace({path:'/'})
        //     },err=>{       
        //         this.$toasted.show(err.message);
        //     });
        // }        
    }
}
</script>
<style lang="less" scoped>
.login{
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100%;
  .logo{
    display: flex;
    margin:40px 0px 40px 0px;
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
    // position:absolute;
    bottom: 20%;
    justify-content: center;
    text-align: center;
    width:100%;
    .login-form{
        width:85%;
        margin:0 auto;
        margin-bottom:40px;
        .login-from-item{
            margin-bottom:8px;
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
  }  
  .login-btn{
    width: 100%;
    // position: absolute;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 6px;
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
  .footer{
    // position: absolute;
    margin-top: 20px;
    font-size: 12px;
    color: #C1CFDE;
 }
}
.login-from-item>div{
    border-bottom: 1px solid #ccc;
}
</style>
