<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="审核供应商退货单" @goBack="goBack" :isInfoGoback="true"></ezt-header>
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
    /**
     * 返回上一页
     */
    private goBack(){
        this.$router.push('/returnGood')
    }
    
}
</script>
<style lang="less" scoped>

</style>


