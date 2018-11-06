<!--损溢单查询-->
<template>
  <div class="ezt-page-con SearchSpilledSheet">
    <ezt-header :back="true" title='损溢单查询'>
       <div slot="action">
       </div>   
    </ezt-header>    
    <div class="ezt-main">   
      <div class="ezt-add-content">
        <ul>
          <div v-if="!details" class="done-none">
            <div></div>
            <span>未查到符合条件的记录</span>
          </div>
          <li v-for="(item,index) in details" :key="index">
            <div class="receive-dc-list">
              <div class="receive-icon-title">
                <span class="return-list-title">单号：{{item.bill_no}}</span> 
                <span class="receive-status">{{item.guige}}</span>
              </div>
              <div class="receive-icon-content">
                <div style="display:flex">
                  <span class="receive-dc-title">仓库：
                    <span class="receive-dc-content">{{item.storehouse}}</span>
                  </span>
                  <span class="receive-dc-title">制单日期：
                    <span class="receive-dc-content">{{item.arrive_date}}</span>
                  </span>
                </div>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
                <span class="receive-dc-title">备注：<span class="receive-dc-content">{{item.remark}}</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                  <span>共2件货品<span class="receive-total">损溢金额：￥434</span></span>
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
import ErrorMsg from "../../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import {maskMixin} from "../../../helper/maskMixin"
import { INoop, INoopPromise } from '../../../../helper/methods'
import { SpilledSheetService} from '../../../service/SpilledSheetService'
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
export default class SpilledSheet extends Vue{
    private cache = CachePocily.getInstance();
    private service: SpilledSheetService;
    private searchParam:{}={};
    private details:any[] = [];  //物料明细
    created() {     
       this.service = SpilledSheetService.getInstance();
       this.detailList();
    }

    mounted(){   
      this.detailList();
      if(this.cache.getData(CACHE_KEY.SPILLEDSHEET_SEARCH)){
        this.searchParam = this.cache.getDataOnce(CACHE_KEY.SPILLEDSHEET_SEARCH);
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
