<!--查询结果-->
<template>
<div class="ezt-page-con queryresult">
    <ezt-header :back="true" title="盘库单查询">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>       
    <div class="ezt-main">       
        <div class="content">
            <div class="pkdetails">
              <div class="librarytype">  
                <div v-if="queryResult.list.length==0" class="done-none">
                  <div></div>
                  <span>未查到符合条件的记录</span>
                </div>
                <ul v-if="queryResult.list.length>0">   
                  <li :key="index" v-for="(item,index) in queryResult.list" >      
                      <p><em>{{item.bill_type_name}}</em><span>{{item.bill_no}}</span></p>
                      <div><p>盘点仓库：<span>{{item.warehouse_name}}</span></p></div>
                      <div v-if="!InterfaceSysTypeBOH"><p>盘点日期：<span>{{item.busi_date}}</span></p></div>
                      <div><p>生成损溢：<span>{{item.is_profit_loss == '1'?'是':'否'}}</span></p></div>   
                      <div v-if="!InterfaceSysTypeBOH"><p>未盘处理：<span>{{item.stock_count_mode_name}}</span></p></div>
                      <div class="business">
                          <p>业务日期：<span>{{item.busi_date}}</span></p>
                          <p class="see" @click="see(item,pageType.LibraryDetails)">查看</p>
                      </div>
                  </li>
                </ul>
              </div>
          </div>
        </div>
    </div>    
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import { FactoryService } from "../../../factory/FactoryService"
import { IStockTakingService } from "../../../interface/service/IStockTakingService"
import { CachePocily } from "../../../common/Cache"
import { PageType } from "../../../enum/EPageType"
import CACHE_KEY from '../../../constans/cacheKey'
@Component({  
   components:{  
        
   },   
   computed:{
     ...mapGetters({
          'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',//接口BOH
     }) 
   },
   methods:{ 
     ...mapActions({
       
     })
   }   
})  
export default class stockTaking extends Vue{
    private service: IStockTakingService;
    private InterfaceSysTypeBOH:boolean;
    private cache = CachePocily.getInstance();  
    private pageType = PageType;
    private list:any[] = [];
    private queryResult:any[] = [];
    created() {
      const factory = FactoryService.getInstance().createFactory();
      this.service = factory.createStockTaking();
      if(this.cache.getData(CACHE_KEY.INVENTORY_RESULT)){
            this.queryResult = JSON.parse(this.cache.getData(CACHE_KEY.INVENTORY_RESULT));
      }
    }

    mounted(){
      
    }
    private see(item:any,types:PageType,audit_status:number){
        this.service.getLibraryDetails(item.id,audit_status).then(res=>{ 
          this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
          this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item));
          this.$router.push({name:'LibraryDetails',query:{types:types.toString()}});  
        },err=>{
            this.$toasted.show(err.message)
        })
    } 
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@background:linear-gradient(139deg, #018BFF -2%, #4A39F3 28%);
.queryresult{
    .content{
      width: @width;
      height:@height;
      position: absolute;
      display: flex;
      align-items: center;
      flex-direction: column;
      .pkdetails{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 95%;
        position: absolute;
        margin-top: 10px;
        .librarytype{
          ul{
            text-align: left;
            li{
              width:@width;
              border-radius: 3px;
              background-color:@background-color;
              margin-bottom: 10px;
              >p{
                height: 45px;
                line-height: 45px;
                border-bottom: 1px solid #D2DFEE;
                padding-left: 10px;
                em{
                    background-image: linear-gradient(-135deg, #FFBE4E 0%, #FE9E49 100%);
                    border-radius: 4px;
                    font-style: normal;
                    font-size: 10px;
                    margin-right: 10px;
                    color: #fff;
                    width: 21px;
                    height: 21px;
                    line-height: 21px;
                    text-align: center;
                    display: inline-block;
                    margin-top: 13px;
                    overflow: hidden;
                    float: left;
                }
              }
              div{
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
                p{
                  width: @width;
                  font-size: 12px;
                  color: #5F7B9A;
                  span{
                    font-size: 13px;
                    color: #395778;
                  }
                }
               }
               .business{
                   background: #FFFFFF;
                   box-shadow: 0 0 10px 0 rgba(71,66,227,0.07);
                   height: 50px;
                   line-height: 50px;
                   display: flex;
                   flex-direction: row;
                   justify-content: space-between;
                   margin-top: 10px;
                   align-items: center;
                   .see{
                      border: 1px solid #1188FC;
                      font-size: 12px;
                      color: #1188FC;
                      border-radius: 6px;
                      width: 70px;
                      height: 30px;
                      text-align: center;
                      line-height: 30px;
                      cursor: pointer;
                      margin-right: 10px;
                   }
               }
             }
           }
        }
      }
    }
}
</style>


