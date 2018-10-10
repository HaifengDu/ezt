<template>
    <div class="ezt-page-con">
        <ezt-header title="初始化单详情" :back="true" @goBack="goBack"></ezt-header>
        <div class="ezt-main"> 
            <div class="ezt-backcolor"></div>
            <div class="ezt-detail-cot">
                <!-- 单据信息 -->
                <div class="receive-dc-list detail-order-info">
                    <div class="receive-icon-title">
                        <span class="receive-icon-dcName"></span>
                        <span class="return-list-title">北京仓库01</span> 
                        <span class="receive-status">已完成</span>
                    </div>
                    <div class="receive-icon-content">
                        <span class="receive-dc-title">单号：<span class="receive-dc-content">000092q</span></span>
                        <div style="display:flex">
                            <span class="receive-dc-title">库存初始日：<span class="receive-dc-content">2018-8-3</span></span>
                            <span class="receive-dc-title">税额：<span class="receive-dc-content">￥12.00</span></span>
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
                                <div>
                                    <span class="good-detail-name">{{item.name}}
                                        <span class="good-detail-sort">（{{item.sort}}）</span>
                                    </span>
                                    <span class="good-detail-sort">￥{{item.price}}/{{item.unitName}}</span>
                                </div>
                                <div>
                                    <span class="good-detail-billno">编号：{{item.billNo}}</span>
                                    <span class="good-detail-sort">￥{{item.amt}}</span>
                                </div>
                                 <div>
                                    <span class="good-detail-sort">供应商：{{item.supplier}}</span>
                                    <span class="good-detail-sort">税率：{{item.rate}}</span>
                                </div>
                                <div class="good-detail-sort">备注：{{item.remark}}</div>
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
                <b>数量</b><span>{{TotalNum}}</span>，
                <b>含税金额￥</b><span>{{TotalAmt}}</span>
            </div> 
            </div>
        </ezt-footer>  
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component,Watch} from 'vue-property-decorator';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({

})
export default class InitStock extends Vue{
    private cache = CachePocily.getInstance(ECache.LocCache);
    private goodList:any[]=[];//详情页物品信息
    private detailList:any={};//详情页信息
    created(){
        if(this.cache.getData(CACHE_KEY.INITSTOCK_DETAILLIST)){
            this.detailList = JSON.parse(this.cache.getDataOnce(CACHE_KEY.INITSTOCK_DETAILLIST));
            this.goodList = this.detailList.goodList;
        }
    }
     /**
     * computed demo
     * 物料总数量
     */
        private get TotalNum(){
        return this.goodList.reduce((ori,item)=>{
            return Number(ori)+Number(item.num);       
        },0);
        }
    /**
     * 物料总金额
     */
    private get TotalAmt(){
        return this.goodList.reduce((ori,item)=>{
        return ori+(item.num*item.price);       
        },0).toFixed(2);
    }
    /**
     * 返回
     */
    private goBack(){
        this.$router.push("/initStock");
    }
}
</script>
<style lang="less" scoped>
.ezt-backcolor{
    position: relative;
    height: 60px;
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
    // bottom: 30px;
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
//直拨仓库
.good-warehouse{
    display: flex;
    flex-direction: row;
    .warehouse-list{
        flex: 1;
            text-align: center;
        .warehouse-isDefault{           
            display: inline-block;               
                    
        }            
    }       
}
.good-warehouse-num{
    margin-left: 10px;
    color: #95A7BA;
    letter-spacing: 0;
}
.turnOn{
    display: inline-block;
    height: 100%;
    flex: .2;
    margin-top: 10px;
}
.icon-trun-on.off{
    transform: rotate(180deg);
} 
.ezt-foot-total{
    height: 30px;
    line-height: 30px;
} 
</style>


