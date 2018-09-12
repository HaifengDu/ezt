<!--查询结果-->
<template>
<div class="ezt-page-con queryresult">
    <ezt-header :back="true" title="查询结果" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>       
    <div class="ezt-main">       
        <div class="content">
            <div class="pkdetails">
              <div class="librarytype">  
                <div v-if="!queryResult" class="done-none">
                  <div></div>
                  <span>目前还没有任何订单</span>
                </div> 
                <ul v-if="queryResult">
                  <li :key="index" v-for="(item,index) in queryResult">   
                      <p><em>{{item.bill_type_name}}</em><span>{{item.warehouse_name}}</span></p>
                      <div><p>盘点仓库：<span>{{item.warehouse_name}}</span></p></div>
                      <div><p>盘点日期：<span>{{item.busi_date}}</span></p></div>
                      <div><p>生成损溢：<span v-if="is_profit_loss == 1">是</span><span v-if="is_profit_loss == 0">否</span></p></div>
                      <div><p>未盘处理：<span>{{item.stock_count_mode_name}}</span></p></div>
                      <div class="business">
                          <p>业务日期：<span>2018-12-13</span></p>
                          <p class="see" @click="see('/librarydetails')">查看</p>
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
import Pager from '../../../common/Pager'
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import StockTakingService from '../../../service/StockTakingService'
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       'queryResult':'stockTaking/queryResult',//查询结果
     }) 
   },
   methods:{ 
     ...mapActions({
       'setQueryResult':"stockTaking/setQueryResult",
     })

   }   
})  
export default class stockTaking extends Vue{
    private service: StockTakingService;
    private pager:Pager;   
    private list:any[] = [];
    private queryResult:any[] = [];
    created() {
      this.service = StockTakingService.getInstance();
    }

    mounted(){
      
    }
    private goBack(){
      this.$router.back();
    }

    // 盘库详情
    private see(info:string){
      this.$router.push(info)
    }
    

  
      
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@background:linear-gradient(139deg, #018BFF -2%, #4A39F3 28%);
.queryresult{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    width: @width;
    height: @height;
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
        background-color:@background-color;
        position: absolute;
        margin-top: 10px;
        .librarytype{
          ul{
            text-align: left;
            li{
              width:@width;
              border-radius: 3px;
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


