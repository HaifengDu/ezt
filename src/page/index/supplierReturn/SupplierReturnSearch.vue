<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="退货单查询"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul>
                    <li>
                        <!-- 收货单列表       -->
                        <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click="toPage(item,'/supplierReturnDetail')">
                            <div class="receive-icon-title">
                                <span class="receive-icon-dcName"></span>
                                <span class="return-list-title">{{item.dc_name}}</span> 
                                <span class="receive-status">07-12</span>
                            </div>
                            <div class="receive-icon-content">
                                <span class="receive-dc-title">单号：<span class="receive-dc-content">{{item.bill_no}}</span></span>
                                <span class="receive-dc-title">仓库：<span class="receive-dc-content">{{item.mater_name}}</span></span>                
                                <div style="display:flex">
                                <span class="receive-dc-title">数量：<span class="receive-dc-content">13</span></span>
                                <span class="receive-dc-title">金额：<span class="receive-dc-content">￥30.00</span></span>
                                </div>
                                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">item.details</span></span>
                                <span class="receive-dc-title">备注：<span class="receive-dc-content">item.remark</span></span>
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
import {Component,Watch} from 'vue-property-decorator';
import { FactoryService } from '../../../factory/FactoryService';
import { ISupplierReturnService } from '../../../interface/service/ISupplierReturnService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{
   },
})
export default class ReturnGood extends Vue{
    private cache= CachePocily.getInstance();
    private searchParam: any ={};
    private goodList: any[]=[];
    private service: ISupplierReturnService;
    mounted(){  
        if(this.cache.getData(CACHE_KEY.SUPPLIERRETURN_SEARCH)){
            this.searchParam = this.cache.getDataOnce(CACHE_KEY.SUPPLIERRETURN_SEARCH);
        }
        this.goodList=[{
            bill_no:'1111000',
            arrive_date:'2018-9-10',
            mater_name:"调出仓库1",
            exportNum:23,
            details:"物品1、物品2",
            remark:"这是水果01",
            dc_name:"配送中心01"

        }]
        console.log(this.searchParam,'00000');
    }

    created(){
        const factory = FactoryService.getInstance().createFactory();
        this.service = factory.createSupplierReturn();
    }

    private toPage(item:any,info:any){
        let confirmList ={};
        confirmList={
            bill_no:'uuuuuu99',
            dc_name:'北京配送中心1'
        }
        if(info){
            this.cache.save(CACHE_KEY.SUPPLIERRETURN_DETAILLIST,JSON.stringify(confirmList));
            this.$router.push(info);
            return false;
        }
    }
    
}
</script>
<style lang="less" scoped>

</style>


