<!--订货单查询-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='订货单查询'>
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main"> 
      <div class="ezt-add-content">
        <ul>   
          <li v-for="(item,index) in details" :key="index">
            <div class="receive-dc-list">
              <div class="receive-icon-title">
                <span class="receive-icon-dcName">配</span>
                <span class="return-list-title">{{item.dc_name}}</span> 
                <!-- <span class="receive-status">已完成</span> -->
              </div>
              <div class="receive-icon-content">
                <span class="receive-dc-title">单号：
                  <span class="receive-dc-content">{{item.bill_no}}</span>
                </span>
                <div style="display:flex">
                  <span class="receive-dc-title">要货日期：
                    <span class="receive-dc-content">{{item.ask_goods_date}}</span>
                  </span>
                  <span class="receive-dc-title">到货日期：
                    <span class="receive-dc-content">{{item.arrive_date}}</span>
                  </span>
                </div>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                  <span>共2件货品<span class="receive-total">合计：￥434</span></span>
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
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../helper/maskMixin";
import { INoop, INoopPromise } from '../../../helper/methods';
import { OrderGoodsService} from '../../service/OrderGoodsService';
import CACHE_KEY from '../../constans/cacheKey'
import { CachePocily } from "../../common/Cache";
import { ECache } from "../../enum/ECache";
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
    private cache = CachePocily.getInstance();
    private service: OrderGoodsService;
    private details:any[] = [];  //物料明细
    private searchParam:{}={};
    created() {     
       this.service = OrderGoodsService.getInstance();
       this.detailList();
    }

    mounted(){   
      this.detailList();
      if(this.cache.getData(CACHE_KEY.INITSTOCK_SEARCH)){
        this.searchParam = this.cache.getDataOnce(CACHE_KEY.INITSTOCK_SEARCH);
      }
      console.log(this.searchParam,'00000');   
    }
    /**
     * 搜索明细
     */
    private detailList(){
      this.service.getGoodDetail().then(res=>{
            this.details=res.data.data;
            console.log(JSON.stringify(this.details))
          },err=>{
            this.$toasted.show(err.message);
        });
    }
}
</script>
<style lang="less" scoped>
.receive-icon-dcName{
  background: none;
}
</style>
