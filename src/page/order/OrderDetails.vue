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
                </div>
                <div class="receive-icon-content">
                    <span class="receive-dc-title">单号：<span class="receive-dc-content">{item.bill_no}</span></span>
                    <div style="display:flex">
                        <span class="receive-dc-title">要货日期：<span class="receive-dc-content">item.arrive_date</span></span>
                        <span class="receive-dc-title">到货日期：<span class="receive-dc-content">item.ask_goods_date</span></span>
                    </div>
                    <div style="display:flex;padding-bottom:20px;">
                        <span class="receive-dc-title">备注：<span class="receive-dc-content">item.arrive_date</span></span>
                    </div>
                    <div class="receive-ys">已收</div>
                </div>
            </div>
            <div class="detail-acount-title">
               物料明细
            </div>  
            <ul>
                <li class="good-detail-content" v-for="(item,index) in goodDetails" :key="index" >
                    <div class="ezt-detail-good">
                        <div class="good-detail-l">
                            <div>
                                <span class="good-detail-name">猪肉
                                    <span class="good-detail-sort">（规格）</span>
                                </span>
                                <span class="good-detail-sort">￥12.0001/KG</span>
                            </div>
                            <div>
                                <span class="good-detail-billno">编号：003222</span>
                            </div>
                            <div class="good-detail-sort">备注：这是水果这是水果这是水果这是水果这是水果这是水果这是水果这是水果</div>
                        </div>
                        <div class="good-detail-r">
                            <span class="good-detail-num">3</span>
                        </div>
                    </div>
                </li>
            </ul> 
        </div>  
    </div>
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
    created() {     
       this.service = OrderGoodsService.getInstance();
    }

    mounted(){ 
    }
   
    private goBack(){
        this.$router.push('/orderGood');
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
        height: calc(100vh - 45px);
        overflow-y: auto;
        overflow-x: hidden;
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
        background-image: linear-gradient(-134deg, #4DBCFE 0%, #646EFF 100%);
        box-shadow: 0 2px 6px 0 rgba(130,182,255,0.70);
        border-radius: 4px;
        color: #fff;
        padding: 4px 10px;
    }
</style>
