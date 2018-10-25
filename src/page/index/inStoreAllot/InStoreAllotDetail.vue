<!-- 调拨单详情 -->
<template>
    <div class="ezt-page-con">
        <ezt-header :back='true' title="调拨单详情"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-backcolor"></div>
            <div class="ezt-detail-cot">
                 <!-- 单据信息 -->
                <div class="receive-dc-list detail-order-info">
                    <div class="receive-icon-title">
                        <span class="receive-icon-dcName"></span>
                        <span class="return-list-title">{{detailList.dc_name}}</span> 
                        <span class="receive-status">已完成</span>
                    </div>
                    <div class="receive-icon-content">
                        <span class="receive-dc-title">订单编号：<span class="receive-dc-content">{{detailList.bill_no}}</span></span>                       
                        <div>
                            <span class="receive-dc-title">调拨日期：<span class="receive-dc-content">item.arrive_date</span></span>
                            <span class="receive-dc-title">调出仓库：<span class="receive-dc-content">item.arrive_date</span></span>
                            <span class="receive-dc-title">调入仓库：<span class="receive-dc-content">item.arrive_date</span></span>
                            <span class="receive-dc-title">备注：<span class="receive-dc-content">item.arrive_date</span></span>
                        </div>
                    </div>
                </div>
                <div class="detail-acount-title">
                物品清单
                </div>  
                <ul v-if="goodList.length>0">
                    <li class="good-detail-content" v-for="(item,index) in goodList" :key="index">
                        <div class="ezt-detail-good">
                            <div class="good-detail-l">
                                <div class="title">
                                    <span class="good-detail-name">{{item.name}}
                                        <span class="good-detail-sort">（{{item.sort}}）</span>
                                    </span>
                                    <span class="good-detail-sort">￥{{item.price}}/{{item.unitName}}</span>
                                </div>
                                <div class="title">
                                    <span class="good-detail-billno">编号：{{item.billNo}}</span>
                                    <span class="good-detail-sort">￥{{item.amt}}</span>
                                </div>
                                <!-- <div class="good-detail-sort">备注：{{item.remark}}</div> -->
                                <div class="good-detail-item" v-if="item.remark">
                                    <div class="good-detail-sort content">备注：
                                        <div v-fixHeight="item" class="remark-suitable" :class="{'auto':item.flod}">{{item.remark}}</div>
                                        <span @click='handleFold(item)' v-if="item.show">{{item.flod?"收起":"展开"}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="good-detail-r">
                                <span class="good-detail-num">{{item.num}}</span>
                            </div>
                        </div>
                    </li>
                </ul> 
            </div>
        </div>
        <ezt-footer>
            <div class="ezt-foot-temporary" slot="confirm">
            <div class="ezt-foot-total">合计：
                <b>品项</b><span>{{goodList.length}}</span>，
                <b>数量</b><span>{{Total.num}}</span>，
                <b>含税金额￥</b><span>{{Total.Amt.toFixed(2)}}</span>
            </div> 
            </div>
        </ezt-footer> 
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Watch} from "vue-property-decorator";
import { InStoreAllotService} from '../../../service/InStoreAllotService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({

})
export default class allotment extends Vue{
    private cache = CachePocily.getInstance();
    private service: InStoreAllotService;
    private goodList:any[]=[];//详情页物品信息
    private detailList:any={};//详情页信息
    mounted(){
        if(this.cache.getData(CACHE_KEY.INSTOREALLOT_DETAILLIST)){
            this.detailList = JSON.parse(this.cache.getDataOnce(CACHE_KEY.INSTOREALLOT_DETAILLIST));
            this.detailList.goodList = [{
            name:"猪肉",
            sort:"规格",
            price:12,
            unitName:"KG",
            billNo:"003222",
            amt: 360,
            remark:"这是水果111111111111111111111111111111111111111111111111111122222222222222222",
            num:3,
            },{
                name:"大猪蹄子",
                sort:"规格",
                price:22,
                unitName:"KG",
                billNo:"003222",
                amt: 660,
                remark:"这是肉",
                num: 6,
            }]
            this.goodList = this.detailList.goodList;
        }
    }
    created(){
        this.service = InStoreAllotService.getInstance();
    }
    /**
     * computed demo
     * 物料总数量、总金额
     */
    private get Total(){
        return this.goodList.reduce((ori,item)=>{
        ori.num = ori.num+Number(item.num); 
            if(item.price){
                ori.Amt = ori.Amt + (item.num * item.price);
            }else if(item.Amt){
                ori.Amt = ori.Amt + (item.amt);
            }else{
                ori.Amt = 0;
                ori.num = 0;
            }     
        
        return ori;
        },{num:0,Amt:0});
    }
    // 备注出现查看更多
    private handleFold(item:any) {
        this.$set(item,'flod',!item.flod);
    }
    
}
</script>
<style lang="less" scoped>
.hint-sign{
    line-height: 42px;
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
}
    .ezt-main{
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 28px;
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
.good-detail-l .title .good-detail-name,.good-detail-l .title .good-detail-billno{
    flex: 1.3;
}
.good-detail-l>div{
    display:flex;
    flex-direction: row;
    line-height: 22px;
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
    line-height: 3;
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
.good-detail-item .content{       
    word-break: break-all;    
    word-wrap:break-word;   
} 
.good-detail-item .remark-suitable{
    line-height: 25px;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.good-detail-item .remark-suitable.auto{
    height: auto;
     -webkit-line-clamp: initial;
}    
</style>