<!--领/退料单查询-->
<template>
  <div class="ezt-page-con SearchLeadbackMaterial"  
        ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" 
        infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
    <ezt-header :back="true" title='领/退料单查询'>
       <div slot="action">
       </div>      
    </ezt-header>    
    <div class="ezt-main"> 
      <div class="ezt-add-content">
        <ul>  
          <div v-if="details.length==0" class="done-none">
            <div></div>
            <span>未查到符合条件的记录</span>
          </div> 
          <li v-if="details.length>0" v-for="(item,index) in details" :key="index">
            <div class="receive-dc-list">
              <div class="receive-icon-title">
                <span class="return-list-title">单号：{{item.bill_no}}</span> 
                <span class="receive-status">{{item.arrive_date}}</span>
              </div>
              <div class="receive-icon-content">
                <div style="display:flex">
                  <span class="receive-dc-title">领/退料库：
                    <span class="receive-dc-content">{{item.dc_name}}</span>
                  </span>
                  <span class="receive-dc-title">数量：
                    <span class="receive-dc-content">{{item.number}}</span>
                  </span>
                </div>
                <div style="display:flex">
                  <span class="receive-dc-title">主仓库：
                    <span class="receive-dc-content">{{item.storehouse}}</span>
                  </span>
                  <span class="receive-dc-title">单据金额：
                    <span class="receive-dc-content">{{item.unit}}</span>
                  </span>
                </div>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
                <span class="receive-dc-title">备注：<span class="receive-dc-content">{{item.remark}}</span></span>
              </div>
            </div>
          </li>
        </ul>
        <span v-show="allLoaded">没有更多数据</span> 
      </div>      
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../../helper/methods'
import { FactoryService } from "../../../factory/FactoryService"
import { ILeadbackMaterialService } from "../../../interface/service/ILeadbackMaterialService"
import CACHE_KEY from '../../../constans/cacheKey'
import { CachePocily } from "../../../common/Cache"
import { ECache } from "../../../enum/ECache"
import Pager from "../../../common/Pager";
@Component({
   components:{
     
   },
   computed:{
     ...mapGetters({
      
     })
   },
   methods:{
     ...mapActions({
       
     })
   }   
})
export default class leadbackMaterial extends Vue{
    private cache = CachePocily.getInstance();
    private service: ILeadbackMaterialService;
    private details:any[] = [];  //物料明细
    private searchParam:{}={};
    private pager:Pager;   
    private allLoaded:boolean = false; //数据是否全部加载完
    created() {     
      const factory = FactoryService.getInstance().createFactory();
      this.service = factory.createLeadbackMaterial();
      this.pager = new Pager().setLimit(20)
    }
    mounted(){   
      this.detailList();
      if(this.cache.getData(CACHE_KEY.LEADBACKSHEET_SEARCH)){
        this.searchParam = this.cache.getDataOnce(CACHE_KEY.LEADBACKSHEET_SEARCH);
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
 .return-list-title{
   margin-left: 10px;
 }
 .ezt-add-content{
   padding-bottom: 0;
 }  
</style>
