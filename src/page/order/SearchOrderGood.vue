<!--订货单查询-->
<template>
  <div class="ezt-page-con"  
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" 
        infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
    <ezt-header :back="true" title='订货单查询'>
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main"> 
      <div class="ezt-add-content">
        <div v-if="details.length==0" class="done-none">
          <div></div>
          <span>未查到符合条件的记录</span>
        </div>
        <ul v-if="details.length>0">   
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
                <span class="receive-dc-title">要货日期：
                  <span class="receive-dc-content">{{item.ask_goods_date}}</span>
                </span>
                <span class="receive-dc-title">到货日期：
                  <span class="receive-dc-content">{{item.arrive_date}}</span>
                </span>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                  <span>共<span>2</span>件货品<span class="receive-total">合计：￥434</span></span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <span v-show="allLoaded">已全部加载</span> 
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
import { OrderGoodsService} from '../../service/OrderGoodsService'
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
    private allLoaded:boolean = false; //分页数据加载更多
    private pager:Pager;
    created() {     
       this.service = OrderGoodsService.getInstance();
       this.pager = new Pager().setLimit(20)
    }

    mounted(){   
      this.detailList();
      if(this.cache.getData(CACHE_KEY.INITSTOCK_SEARCH)){
        this.searchParam = this.cache.getDataOnce(CACHE_KEY.INITSTOCK_SEARCH);
      }
    }
    /**
     * 物料明细
     */
    private detailList(){
      this.service.getGoodResult(this.pager.getPage()).then(res=>{
          this.$vux.loading.show({
              text: '加载中...'
          });
          this.details = res.data.data;
          setTimeout(()=>{
              this.$vux.loading.hide();
          },400); 
      },err=>{
          this.$toasted.show(err.message);
      });
    }
    /**
     * 下拉加载更多
     */
    private loadMore() {
        if(!this.allLoaded){
            this.$vux.loading.show({
                text:'加载中..'
            });
            this.pager.setNext(); 
            this.service.getGoodResult(this.pager.getPage()).then(res=>{  
                if(this.pager.getPage().limit>res.data.data.length){
                     this.allLoaded=true;
                }
                this.details=this.details.concat(res.data.data);
                setTimeout(()=>{
                    this.$vux.loading.hide();
                },500); 
            },err=>{
                this.$toasted.show(err.message);
            })
        }    
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
