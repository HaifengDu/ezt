<!--订货单详情-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title="订货单详情" @goBack="goBack">
       <div slot="action">
       </div>    
    </ezt-header>    
    <div class="ezt-main"> 
        <div class="ezt-backcolor"></div>
         <div class="ezt-detail-cot">
            <!-- 单据信息 -->
            <div class="receive-dc-list detail-order-info">
                <div class="receive-icon-title">
                    <span class="receive-icon-dcName"></span>
                    <span class="return-list-title">item.dc_name</span> 
                    <span class="receive-status">已完成</span>
                    <span class="receive-status" v-if="false">已付：213123</span>
                </div>
                <div class="receive-icon-content">
                    <span class="receive-dc-title">单号：<span class="receive-dc-content">123123</span></span>
                    <div style="display:flex">
                        <span class="receive-dc-title">要货日期：<span class="receive-dc-content">2018-09-12</span></span>
                        <span class="receive-dc-title">到货日期：<span class="receive-dc-content">2018-09-12</span></span>
                    </div>
                    <div style="display:flex;padding-bottom:20px;">
                        <span class="receive-dc-title">备注：<span class="receive-dc-content">不要啦就是你的济南市快递那福克斯地方</span></span>
                    </div>
                    <div class="receive-ys">已收</div>
                </div>
            </div>
            <div class="detail-acount-title">
               物料明细
            </div>  
            <ul>
                <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">item.name
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥item.guige</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：item.code</span>
                            </div>
                            <div class="good-detail-sort">备注：
                                <span class="remarks">
                                    不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方
                                </span>
                            </div>
                             <!-- <span class="turnOn" @click="showOtherWare">
                              <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                             </span>    -->
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>

                  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">item.name
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥item.guige</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：item.code</span>
                            </div>
                            <div class="good-detail-sort">备注：
                                <span class="remarks">
                                    不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方
                                </span>
                            </div>
                             <!-- <span class="turnOn" @click="showOtherWare">
                              <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                             </span>    -->
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>
                  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">item.name
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥item.guige</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：item.code</span>
                            </div>
                            <div class="good-detail-sort">备注：
                                <span class="remarks">
                                    不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方
                                </span>
                            </div>
                             <!-- <span class="turnOn" @click="showOtherWare">
                              <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                             </span>    -->
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>
                  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">item.name
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥item.guige</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：item.code</span>
                            </div>
                            <div class="good-detail-sort">备注：
                                <span class="remarks">
                                    不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方
                                </span>
                            </div>
                             <!-- <span class="turnOn" @click="showOtherWare">
                              <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                             </span>    -->
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>
                  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">item.name
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥item.guige</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：item.code</span>
                            </div>
                            <div class="good-detail-sort">备注：
                                <span class="remarks">
                                    不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方
                                </span>
                            </div>
                             <!-- <span class="turnOn" @click="showOtherWare">
                              <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                             </span>    -->
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>
                  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">item.name
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥item.guige</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：item.code</span>
                            </div>
                            <div class="good-detail-sort">备注：
                                <span class="remarks">
                                    不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方
                                </span>
                            </div>
                             <!-- <span class="turnOn" @click="showOtherWare">
                              <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                             </span>    -->
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>
                  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">item.name
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥item.guige</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：item.code</span>
                            </div>
                            <div class="good-detail-sort">备注：
                                <span class="remarks">
                                    不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方
                                </span>
                            </div>
                             <!-- <span class="turnOn" @click="showOtherWare">
                              <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                             </span>    -->
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>
                  <li class="good-detail-content">
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">item.name
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥item.guige</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：item.code</span>
                            </div>
                            <div class="good-detail-sort">备注：
                                <span class="remarks">
                                    不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方不要啦就是你的济南市快递那福克斯地方
                                </span>
                            </div>
                             <!-- <span class="turnOn" @click="showOtherWare">
                              <span class="icon-trun-on" :class="[{'off':showOther}]"></span>
                             </span>    -->
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>
                
            </ul>             
        </div>  
    </div>
    <ezt-footer>
        <div class="ezt-foot-temporary" slot="confirm">
        <div class="ezt-foot-total">合计：
            <b>品项</b><span>2</span>，
            <b>数量</b><span>2</span>，
            <b>含税金额￥</b><span>3</span>
        </div>
        <div class="ezt-foot-button">
            <a href="javascript:(0)" class="ezt-foot-sub">支付</a>  
        </div>  
        </div>
    </ezt-footer> 
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "./model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import {LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../helper/maskMixin";
import { INoop, INoopPromise } from '../../helper/methods';
import { OrderGoodsService} from '../../service/OrderGoodsService';
declare var mobiscroll:any;
@Component({
   components:{

   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({

     })
   },
   methods:{
     ...mapActions({
     })
   }
})
export default class OrderGoods extends Vue{
    private service: OrderGoodsService;
    private showOther: boolean=false;
    created() {      
       this.service = OrderGoodsService.getInstance();
       
    }

    mounted(){ 
    }

    private goBack(){
        this.$router.push('/orderGood');
    }
    private showOtherWare(){
        this.showOther = !this.showOther;
    }
   
}
</script>

<style lang="less" scoped>
     .receive-icon-content{
         position: relative;
     }
    .ezt-backcolor{
        position: relative;
        height: 136px;
        background-image: linear-gradient(135deg, #018BFF -9%, #4A39F3 79%);
        margin-top: -1px;
    }
    .ezt-detail-cot{
        position: absolute;
        top:0;
        width: 100%;
        // height: calc(100vh - 45px);
        // overflow-y: auto;
        // overflow-x: hidden;
        // bottom: 70px;
    }
    .ezt-main{
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 68px;
    }
    .detail-acount-title{
        font-size: 12px;
        color: #95A7BA;
        letter-spacing: 0;
        text-align: left;
        margin-left: 10px;
    }
    //物料信息
    .good-detail-content{
        text-align: left;
        margin: 8px 10px;
        padding: 12px 10px 12px 15px;
        background: #FFFFFF;
        border: 1px solid #DDECFD;
        box-shadow: 0 0 20px 0 rgba(71,66,227,0.07);
        display: flex;
        flex: row;
        flex-direction: column;
    }
    .good-detail-l{
        display: inline-block;
        flex:.8;
    }
    .good-detail-l>div{
       display:flex;
       flex-direction: row;
    }
    .good-detail-l>div>span{
       flex:1;
    }
    .good-detail-r{
        display: inline-block;
        text-align: right;
        flex: .2;
        border-left: 1px dotted #C0CFE0;
    }
    .good-detail-num{
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 20px;
        color: #FF885E;
        letter-spacing: 0;
    }
    .good-detail-name{
        font-size: 14px;
        color: #395778;
        letter-spacing: 0;
    }
    .good-detail-sort{
        font-size: 13px;
        color: #5F7B9A;
        letter-spacing: 0;
        .remarks{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
    .good-detail-billno,.good-num-t{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
    }
    .good-num-t{
        display: inline-block;
        text-align: center;
        width: 100%;
    }
    .ezt-detail-good{
        display: flex;
        border-bottom: 1px solid #E0EBF9;
        padding-bottom: 10px;
    }
    .receive-status{
        color:#4A39F3;
    }
    .total{
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: #F1F6FF;
        span{
            color: red;
        }
    }
     .turnOn{
        display: inline-block;
        height: 100%;
        flex: .2;
        margin: 10px 10px 0 0;
        float: right;
    }
    .icon-trun-on.off{
        transform: rotate(180deg);
    }  
</style>
