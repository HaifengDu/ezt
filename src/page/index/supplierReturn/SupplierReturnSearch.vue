<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="退货单查询"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul>
                    <li>
                        <!-- 收货单列表       -->
                        <div class="receive-dc-list">
                            <div class="receive-icon-title">
                                <span class="receive-icon-dcName"></span>
                                <span class="return-list-title">dc_name}}</span> 
                                <span class="receive-status">07-12</span>
                            </div>
                            <div class="receive-icon-content">
                                <span class="receive-dc-title">单号：<span class="receive-dc-content">item.bill_no</span></span>
                                <span class="receive-dc-title">仓库：<span class="receive-dc-content">仓库1</span></span>                
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
import {SupplierReturnService} from '../../../service/SupplierReturnService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{
   },
})
export default class ReturnGood extends Vue{
   
    
}
</script>
<style lang="less" scoped>

</style>


