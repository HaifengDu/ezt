<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="退货单查询"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <div v-if="goodList.length==0" class="done-none">
                  <div></div>
                  <span>未查到符合条件的记录</span>   
                </div>
                <ul v-if="goodList.length>0">
                    <li :key="index" v-for="(item,index) in goodList"  @click="toPage(item,'/supplierReturnDetail')">   
                        <div class="receive-dc-list">
                            <div class="receive-icon-title">
                                <span class="receive-icon-dcName"></span>
                                <span class="return-list-title">{{item.dc_name || item.billNo}}</span> 
                                <span class="receive-status">{{item.arrive_date || item.busiDate}}</span>
                            </div>
                            <div class="receive-icon-content">
                                <span v-if="!InterfaceSysTypeBOH" class="receive-dc-title">单号：<span class="receive-dc-content">{{item.bill_no}}</span></span>
                                <span v-if="!InterfaceSysTypeBOH" class="receive-dc-title">仓库：<span class="receive-dc-content">{{item.mater_name}}</span></span>     
                                <span v-if="InterfaceSysTypeBOH"  class="receive-dc-title">机构名称：<span class="receive-dc-content">{{item.outOrganName}}</span></span>
                                <span v-if="InterfaceSysTypeBOH"  class="receive-dc-title">供应商/配销中心：<span class="receive-dc-content">{{item.businessName}}</span></span>  
                                <span v-if="InterfaceSysTypeBOH"  class="receive-dc-title">退货类型：
                                    <span class="receive-dc-content" v-if="item.outType === 'SCM_OUT_TYPE_DISTRIBUTE'">配送退货</span>
                                    <span class="receive-dc-content" v-if="item.outType === 'SCM_OUT_TYPE_SUPPLIER'">供应商退货</span>
                                    <span class="receive-dc-content" v-if="item.outType === 'SCM_OUT_TYPE_OTHER_RETURN'">其他退货</span>
                                </span>               
                                <div style="display:flex" v-if="!InterfaceSysTypeBOH">
                                    <span class="receive-dc-title">数量：<span class="receive-dc-content">13</span></span>
                                    <span class="receive-dc-title">金额：<span class="receive-dc-content">￥30.00</span></span>
                                </div>
                                <span v-if="InterfaceSysTypeBOH" class="receive-dc-title">创建人：<span class="receive-dc-content">{{item.creator}}</span></span>
                                <span v-if="InterfaceSysTypeBOH" class="receive-dc-title">创建日期：<span class="receive-dc-content">{{item.createDate}}</span></span>
                                <span class="receive-dc-title" v-if="!InterfaceSysTypeBOH">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
                                <span class="receive-dc-title">备注：<span class="receive-dc-content">{{item.remark || item.memo?'item.memo':'无'}}</span></span>
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
import CACHE_KEY from '../../../constans/cacheKey';
import { mapActions, mapGetters } from 'vuex';
import Pager from '../../../common/Pager';
@Component({
    components:{

    },
    computed:{
     ...mapGetters({
       'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',   //true BOH接口  false saas接口
     })
   },
})  
export default class ReturnGood extends Vue{
    private cache= CachePocily.getInstance();
    private goodList:any[] = [];
    private service: ISupplierReturnService;
    private InterfaceSysTypeBOH:boolean;
    private pager:Pager;
    created(){
        const factory = FactoryService.getInstance().createFactory();
        this.service = factory.createSupplierReturn();
        this.pager = new Pager().setLimit(10)
        if(this.cache.getData(CACHE_KEY.SUPPLIERRETURN_RESULT)){
          this.goodList = JSON.parse(this.cache.getDataOnce(CACHE_KEY.SUPPLIERRETURN_RESULT));
        }
    }

    mounted(){  
        if(!this.InterfaceSysTypeBOH){
           this.goodList=[{
                bill_no:'1111000',
                arrive_date:'2018-9-10',
                mater_name:"调出仓库1",
                exportNum:23,
                details:"物品1、物品2",
                remark:"这是水果01",
                dc_name:"配送中心01"   
            }]
        }
    }

    private toPage(item:any,info:any){
        this.service.getGoodDetail(item.id,this.pager.getPage()).then(res=>{ 
            if(info){
                this.cache.save(CACHE_KEY.SUPPLIERRETURN_DETAILLIST,JSON.stringify(res.data));
                this.$router.push(info);
                return false;
            }
        },err=>{
            this.$toasted.show(err.message)
        })
    }
    
}
</script>
<style lang="less" scoped>

</style>


