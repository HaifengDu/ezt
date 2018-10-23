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
          <li>
            <div class="receive-dc-list">
              <div class="receive-icon-title">
                <span class="return-list-title">单号：21241479</span> 
                <span class="receive-status">报损</span>
              </div>
              <div class="receive-icon-content">
                <div style="display:flex">
                  <span class="receive-dc-title">仓库：
                    <span class="receive-dc-content">item.ask_goods_date</span>
                  </span>
                  <span class="receive-dc-title">制单日期：
                    <span class="receive-dc-content">2018-10-13</span>
                  </span>
                </div>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">item.details</span></span>
                <span class="receive-dc-title">备注：<span class="receive-dc-content">item.details</span></span>
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
    created() {     
       this.service = SpilledSheetService.getInstance();
    }

    mounted(){   
      if(this.cache.getData(CACHE_KEY.SPILLEDSHEET_SEARCH)){
        this.searchParam = this.cache.getDataOnce(CACHE_KEY.SPILLEDSHEET_SEARCH);
      }
      console.log(this.searchParam,'00000');   
    }
   
}
</script>
<style lang="less" scoped>
  .ezt-title-search{
    background: #fff;
  }
 .ezt-title-search li{
    padding: 10px;
    border-bottom: 1px solid #E0EBF9;
    text-align: left;
    display: flex;
    flex-direction: row;
 }
 .ezt-title-search li:last-child{
   background:none;
   padding: 4px 0px;
 }
 .title-search-name{
   flex:1;
 }
 .ezt-two-btn{
    width: 40px;
    margin: 0 auto;
    border-radius: 8px;
    padding: 6px 11px;
    text-align: center;
 }
 .icon-trun-on{
   margin-left: 10px;
 }
 .return-list-title{
   margin-left: 10px;
 }
</style>
