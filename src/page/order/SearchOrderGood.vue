<!--订货单查询-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='订货单查询'>
       <div slot="action">
       </div>
    </ezt-header>      
    <div class="ezt-main"> 
      <div class="ezt-add-content">
        <div v-if="list.orderList.length==0" class="done-none">
          <div></div>
          <span>未查到符合条件的记录</span>
        </div>
        <ul v-if="list.orderList.length>0">   
          <li :key="index" v-for="(item,index) in list.orderList" >
            <div class="receive-dc-list">   
              <div class="receive-icon-title">  
                <span class="receive-icon-dcName" v-if="!InterfaceSysTypeBOH">配</span>
                <span class="return-list-title" style="margin-left:10px;">{{item.dc_name}} {{item.billNo}}</span> 
                <span class="receive-status" v-if="item.auditStatus == 'SCM_AUDIT_NO'">待审核</span>
                <span class="receive-status" v-if="item.auditStatus == 'SCM_AUDIT_YES'">已完成</span>
              </div>
              <div class="receive-icon-content">
                <span class="receive-dc-title" v-if="!InterfaceSysTypeBOH">单号：
                  <span class="receive-dc-content">{{item.bill_no}}</span>
                </span>
                 <span class="receive-dc-title" v-if="InterfaceSysTypeBOH">要货机构：
                    <span class="receive-dc-content">{{item.organName}}</span>  
                  </span>
                  <span class="receive-dc-title" v-if="InterfaceSysTypeBOH">配送机构：
                    <span class="receive-dc-content">{{item.supplierName}}</span>  
                  </span>
                <span class="receive-dc-title">要货日期：
                    <span class="receive-dc-content">{{item.ask_goods_date || item.orderDate}}</span>  
                  </span>
                  <span class="receive-dc-title">到货日期：
                    <span class="receive-dc-content">{{item.arrive_date || item.arrivalDate}}</span>
                  </span>
                <span class="receive-dc-title" v-if="!InterfaceSysTypeBOH">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
              </div>
              <div class="receive-icon-bottom">
                 <div class="glow-1" v-if="!InterfaceSysTypeBOH">
                  <span>共{{item.material_size}}件货品<span class="receive-total">合计：￥434</span></span>
                </div>
                <div class="glow-1" v-if="InterfaceSysTypeBOH">
                  <span>金额：￥{{item.totalAmt}}</span>
                  <p class="see" @click="see(item)">查看</p>
                </div>
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
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import {maskMixin} from "../../helper/maskMixin"
import { INoop, INoopPromise } from '../../../helper/methods'
import { FactoryService } from '../../factory/FactoryService'
import { IOrderGoodsService } from '../../interface/service/IOrderGoodsService'
import CACHE_KEY from '../../constans/cacheKey'
import { CachePocily } from "../../common/Cache"
import { ECache } from "../../enum/ECache"
import Pager from "../../common/Pager"
declare var mobiscroll:any;
@Component({
   components:{
     
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
          InterfaceSysTypeBOH:'InterfaceSysTypeBOH',
     })
   },
   methods:{
     ...mapActions({
       
     })
   }
})
export default class OrderGoods extends Vue{  
    private cache = CachePocily.getInstance();
    private service: IOrderGoodsService;
    private InterfaceSysTypeBOH:boolean;
    private list:any[] = [];
    private pager:Pager;
    created() { 
      const factory = FactoryService.getInstance().createFactory();
      this.service = factory.createOrderGood();
      this.pager = new Pager().setLimit(20);   
      if(this.cache.getData(CACHE_KEY.ORDER_SEARCH)){
            this.list = JSON.parse(this.cache.getData(CACHE_KEY.ORDER_SEARCH));
      }
    }

    mounted(){   
      // this.detailList();
     
    }
    /**
     * 物料明细
     */
    private see(item:any){
        this.service.getGoodDetail(item.id).then(res=>{ 
           this.cache.save(CACHE_KEY.ORDER_DETAILS,JSON.stringify(res.data));
           this.$router.push({name:"OrderDetails",params:{'isPayMent':'false'}});
        },err=>{
            this.$toasted.show(err.message)
        })
    } 
}
</script>
<style lang="less" scoped>
.ezt-add-content{
  padding-bottom: 0;
}
.receive-icon-dcName{
  background: none;
}
</style>
