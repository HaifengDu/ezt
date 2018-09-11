<!--盘库详情-->
<template>
<div class="ezt-page-con librarydetails">
    <ezt-header :back="true" title="盘库详情" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">       
        <div class="content">
            <div class="pkdetails">
              <div class="librarytype">
                <ul>
                  <li>  
                      <div><p>盘点仓库：<span>{{warehouse_name}}</span></p></div>
                      <div><p>盘点日期：<span>{{busi_date}}</span></p></div>
                      <div><p>盘库方式：<span></span></p></div>
                      <div><p>盘点类型：<span>{{bill_type_name}}</span></p></div>
                      <div><p>未盘处理：<span>{{stock_count_mode_name}}</span></p></div>
                  </li>
                </ul>
              </div>   
              <div class="inventory">
                <div class="pkmx">
                      <div class="line">
                          <div class="title">盘库明细</div>
                      </div>
                  </div>
                  <ul>
                    <!-- <li :key="index" v-for="(item,index) in inventoryDetails">
                      <p class="name">{{item.material_name}}<span class="code">编码：<em>{{item.material_num}}</em></span></p>
                      <div><p>规格：<span>{{item.material_model}}</span></p><p>账面数量：<span>{{item.acc_qty}}</span></p></div>
                      <div><p>理论库存：<span>{{item.thery_qty}}</span></p><p>理论消耗：<span>{{item.consume_qty}}</span></p></div>
                      <div><p>整箱数量：<span>{{item.zxsl}}</span></p><p>散装数量：<span>{{item.szsl}}</span></p></div>
                    </li> -->
                     <li :key="index" v-for="(item,index) in inventoryDetails">
                      <p class="name">{{item.material_name}}</p>
                      <div><p>编码：<span>{{item.material_num}}</span></p><p>规格：<span>{{item.material_model}}</span></p></div>
                      <div><p>账面数量：<span>{{item.acc_qty}}</span></p><p>理论库存：<span>{{item.thery_qty}}</span></p></div>
                      <div><p>理论消耗：<span>{{item.consume_qty}}</span></p><p>采购单位：<span>{{item.pur_conversion}}</span></p></div>
                      <div><p>库存主单位：<span>{{item.disperse_num}}</span></p><p>消耗单位：<span>{{item.consume_num}}</span></p></div>
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
import Pager from '../../../common/Pager'
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import StockTakingService from '../../../service/StockTakingService'
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       'inventoryDetails':'stockTaking/inventoryDetails',//盘点详情
     }) 
   },
   methods:{ 
     ...mapActions({
       'setInventoryDetails':"stockTaking/setInventoryDetails",
     }),

   }   
})  
export default class stockTaking extends Vue{
    private pager:Pager;   
    private service: StockTakingService;
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private getLibraryDetails:INoopPromise;
    private warehouse_name:string;  
    private busi_date:string;  
    private bill_type_name:string;
    private stock_count_mode_name:string;
    created() {
      this.service = StockTakingService.getInstance();
      this.warehouse_name = this.$route.params.warehouse_name
      this.busi_date = this.$route.params.busi_date
      this.bill_type_name = this.$route.params.bill_type_name
      this.stock_count_mode_name = this.$route.params.stock_count_mode_name
    }

    mounted(){
      
    }
    private goBack(){
      this.$router.back();
    }
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@background:linear-gradient(139deg, #018BFF -2%, #4A39F3 28%);
.librarydetails{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    width: @width;
    height: @height;
    background-color: #F1F6FF;
    .content{
      width: @width;
      height:@height;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-top: 10px;
      .pkdetails{
        display: flex;   
        flex-direction: column;
        justify-content: flex-start;
        border-radius: 4px;
        width: 95%;
        background-color:@background-color;
        .librarytype{
          ul{
            text-align: left;
            padding: 10px 0 10px 15px;
            li{
              width:@width;
              div{
                height: 25px;
                line-height: 25px;
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
             }
           }
        }
        .inventory{
          background-color: @background-color;
           .pkmx{
              position: relative;
              .line{
                position: absolute;
                top: 1px;
                width: 100%;
                text-align: center;
                margin: 0 auto;
                .title{
                  width: 100%;
                  font-size: 12px;
                  color: #95A7BA;
                }
              }
            }
            ul{
            text-align: left;
            padding: 10px 10px 10px 15px;
            margin-top: 20px;
              li{
                width:@width;
                padding-bottom: 10px;
                margin-bottom: 10px;
                border-bottom: 1px solid #DDECFD;
                .name{
                  font-size: 15px;
                  color: #395778;
                  margin-bottom: 10px;
                  }
                .code{
                    font-size: 11px;
                    color: #A3B3C2;
                    margin-left: 10px;
                    em{
                      font-style: normal;
                    }
                }
              div{
                display: flex;
                height: 25px;
                line-height: 25px;
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
            }
            li:last-child{
              border-bottom: none;
            }
         }
        }
      }
    }
}
</style>


