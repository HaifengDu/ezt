<!-- 查询调拨单 -->
<template>
    <div class="ezt-page-con">
        <ezt-header :back='true' title="调拔出库单查询"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul>
                    <li>
                        <!-- 收货单列表       -->
                        <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click="toPage(item,'/inStoreAllotDetail')">
                            <div class="receive-icon-title">
                                <span class="receive-icon-dcName"></span>
                                <span class="receive-dc-title">单号：<span class="receive-dc-content">{{item.bill_no}}</span></span> 
                                <span class="receive-status">{{item.arrive_date}}</span>
                            </div>
                            <div class="receive-icon-content">                        
                                <div style="display:flex">
                                    <span class="receive-dc-title">调出：<span class="receive-dc-content">{{item.mater_name}}</span></span>
                                    <span class="receive-dc-title">调出数量：<span class="receive-dc-content">{{item.exportNum}}</span></span>
                                </div>
                                <div style="display:flex">
                                    <span class="receive-dc-title">调入：<span class="receive-dc-content">{{item.mater_name}}</span></span>
                                    <span class="receive-dc-title">单据金额：<span class="receive-dc-content">￥{{item.exportNum}}</span></span>
                                </div>
                                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
                                <span class="receive-dc-title">备注：<span class="receive-dc-content">{{item.remark}}</span></span>
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
import {Component, Watch} from "vue-property-decorator"
import CACHE_KEY from '../../../constans/cacheKey'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
@Component({

})
export default class allotment extends Vue{
    private cache= CachePocily.getInstance();
    private searchParam: any ={};
    private goodList: any[]=[];
    mounted(){  
        if(this.cache.getData(CACHE_KEY.INSTOREALLOT_SEARCH)){
            this.searchParam = this.cache.getDataOnce(CACHE_KEY.INSTOREALLOT_SEARCH);
        }
        this.goodList=[{
            bill_no:'1111000',
            arrive_date:'2018-9-10',
            mater_name:"调出仓库1",
            exportNum:23,
            details:"物品1、物品2",
            remark:"这是水果01"

        }]
        console.log(this.searchParam,'00000');
    }

    private toPage(item:any,info:any){
        let confirmList ={};
        confirmList={
            bill_no:'uuuuuu99',
            dc_name:'北京配送中心1'
        }
        if(info){
            this.cache.save(CACHE_KEY.INSTOREALLOT_DETAILLIST,JSON.stringify(confirmList));
            this.$router.push(info);
            return false;
        }
    }
}
</script>
<style lang="less" scoped>
//物料信息
.good-detail-content{
    position: relative;
    overflow: hidden;
    text-align: left;
    margin: 8px 10px;
    padding: 12px 10px 12px 15px;
    background: #FFFFFF;
    border: 1px solid #DDECFD;
    box-shadow: 0 0 20px 0 rgba(71,66,227,0.07);
    display: flex;
    flex: row;
    flex-direction: column;
    .good-detail-l{
        display: inline-block;
        flex:.8;
    }
    .good-detail-l>div{
        display:flex;
        flex-direction: row;
    }
    .good-detail-l>div>span{
        // padding: 5px 0px;
        align-items: baseline;
        flex: 1;
    }
    .good-detail-r{
        display: inline-block;
        display:flex;
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
        display: flex;
        line-height: 16px;
    }
    .good-detail-sort{
        font-size: 13px;
        color: #5F7B9A;
        letter-spacing: 0;
        display: flex;
        flex-direction: row;
    }
    .good-detail-nobreak{
        display:flex;
        flex:1;
        padding: 6px 0px 6px 0px;      
    }
    .ezt-dense-box{
        align-items: center;
        flex: 1 !important;
    }
    .good-detail-billno{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
        padding: 0px 0px 5px;
    }
    .ezt-detail-good{
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        transition: transform .5s;
        background: #fff;
        z-index: 2;
    }
}
</style>