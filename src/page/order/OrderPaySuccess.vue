<template>
    <div class="ezt-page-con">
        <ezt-header title="订单支付" :back="false"></ezt-header>
        <div class="ezt-main">           
            <div class="ezt-add-content">
                <div class="ezt-paySuccess">
                    <span class="ezt-pay-icon"></span>
                    <div class="ezt-pay-msg ezt-titleColor1 ezt-fontSize5">付款成功</div>
                    <div class="pay-info">
                        <div class="goods-sum ezt-titleColor3 ezt-fontSize3">货品总额：￥{{990.00}}</div>
                        <div class="goods-billno ezt-titleColor3 ezt-fontSize3">单据号：{{'TZ123345478679'}}</div>
                    </div>
                    <div class="pay-action">
                        <span @click="renderUrl('OrderGood')" class="ezt-btnColor5 ezt-fontSize6 pay-back">返回</span>
                        <span @click="renderUrl('OrderDetails')" class="ezt-btnColor4 ezt-fontSize6 pay-detail">订单详情</span>
                    </div>      
                    
                </div>
            </div>            
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from "vue-property-decorator"
@Component({

})
export default class OrderGoods extends Vue{
    
    private renderUrl(val:string){
        let newparam = {};
        newparam = (val == 'OrderGood'? {'purStatus':'待支付'} :{'isPayMent':'false'})
        this.$router.push({name:val,params:newparam})
    }
}
</script>
<style lang="less" scoped>
    .ezt-paySuccess{
        padding-top: 50px;
        .ezt-pay-icon{
            display: inline-block;
            width: 54px;
            height: 54px;
            background: url(../../assets/images/success.png) no-repeat;
            background-size: 54px 54px;
        }
        .pay-info{
            margin-top: 20px;
        }
        .pay-back,.pay-detail{
           
            border-radius: 6px;
        }
        .pay-back{
            padding: 8px 30px;
            border: 1px solid #BACAD9;
            margin-right: 10px;
        }
        .pay-detail{
            padding: 8px 16px;
            border: 1px solid #1188FC;
            margin-left: 10px;
        }
        .pay-action{
            margin-top: 50px;
        }
    }
</style>


