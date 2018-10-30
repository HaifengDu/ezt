<!--领/退料单查询-->
<template>
  <div class="ezt-page-con SearchLeadbackMaterial">
    <ezt-header :back="true" title='领/退料单查询'>
       <div slot="action">
       </div>   
    </ezt-header>    
    <div class="ezt-main"> 
      <div class="ezt-add-content">
        <ul>   
          <li v-for="(item,index) in details" :key="index">
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
      </div>      
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import {maskMixin} from "../../../helper/maskMixin"
import { INoop, INoopPromise } from '../../../../helper/methods'
import { LeadbackMaterialService } from '../../../service/LeadbackMaterialService'
import CACHE_KEY from '../../../constans/cacheKey'
import { CachePocily } from "../../../common/Cache"
import { ECache } from "../../../enum/ECache"
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
export default class leadbackMaterial extends Vue{
    private cache = CachePocily.getInstance();
    private service: LeadbackMaterialService;
    private details:any[] = [];  //物料明细
    private searchParam:{}={};
    created() {     
       this.service = LeadbackMaterialService.getInstance();
       this.detailList();
    }
    mounted(){   
      this.detailList();
      if(this.cache.getData(CACHE_KEY.LEADBACKSHEET_SEARCH)){
        this.searchParam = this.cache.getData(CACHE_KEY.LEADBACKSHEET_SEARCH);
      }
      console.log(this.searchParam,'00000');   
    }
    /**
     * 物料明细
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
 .return-list-title{
   margin-left: 10px;
 }
 .ezt-add-content{
   padding-bottom: 0;
 }
</style>
