<!--实盘录入-->
<template>
<div class="ezt-page-con realdiscentry">   
    <ezt-header :back="true" title="实盘录入" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">       
        <div class="content">
          <div class="list">
           <div class="checklist">
              <ul>
                <li :key="index" v-for="(item,index) in inventoryDetails">
                  <div class="title"><p>{{item.material_name}}<span>编码：<em>{{item.material_num}}</em></span></p></div>
                  <div><p>规格：<span>{{item.material_model}}</span></p><p>账面数量：<span>{{item.acc_qty}}</span></p></div>
                  <div><p>理论库存：<span>{{item.thery_qty}}</span></p><p>理论消耗：<span>{{item.consume_qty || '0'}}</span></p></div>
                  <div class="purchase">
                      <div>
                        <p><span><input type="number" v-model="item.whole_num" oninput="if(value.length>7)value=value.slice(0,7)"  placeholder="采购单位">斤</span></p>
                        <p><span><input type="number" v-model="item.disperse_num" oninput="if(value.length>7)value=value.slice(0,7)" placeholder="库存主单位">斤</span></p>
                      </div>
                      <div>
                        <p><span><input type="number" v-model="item.consume_num"  oninput="if(value.length>7)value=value.slice(0,7)" placeholder="消耗单位">只</span></p>
                      </div>
                  </div>
                </li>
              </ul>
           </div>
          </div>
          <div class="temporary" slot="confirm">
            <div class="total">货品数量合计：<span v-html="total"></span></div>
            <div class="button">
              <div class="storage" @click="storage">暂存</div><div class="sub" @click="sub">提交</div>
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
     })

   }   
})  
export default class stockTaking extends Vue{
    private pager:Pager;   
    private service: StockTakingService;
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private getLibraryDetails:INoopPromise;
    private ids:string;
    private stock_count_mode:any; //未盘处理方式
    private inventoryDetails:any; //列表详情
    private total:any = []; //合计
    private getRealdiscEntry:INoopPromise //实盘录入接口
    created() {
      this.service = StockTakingService.getInstance();
      this.total = JSON.stringify(this.inventoryDetails.length)
      
    }

    mounted(){
      
    }

    private goBack(){
      this.$router.back();
    }

  /**
   * watch demo
   */
    @Watch("list",{
      deep:true
    })
    private listWatch(newValue:any[],oldValue:any[]){

    }

    /**
     * computed demo
     */
      // private get Total(){
      //   return this.list.reduce((ori,item)=>{
      //     return ori.uprice+item;
      //   },0);
      // }
      // 暂存
      private storage(){
        const whole_num = this.inventoryDetails[0].whole_num
        const id = this.inventoryDetails[0].id
        const consume_num = this.inventoryDetails[0].consume_num
        const disperse_num = this.inventoryDetails[0].disperse_num
        const ids = this.$route.params.ids
        const is_stock_report = 0  //0是暂存   1是提交
        const stock_count_mode = this.$route.params.stock_count_mode
        this.service.getRealdiscEntry(whole_num,id,consume_num,disperse_num,ids,is_stock_report,stock_count_mode).then(res=>{  
            this.inventoryDetails = res.data.data;
            this.setInventoryDetails(this.inventoryDetails); 
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)
        })
      }
      // 提交
      private sub(){  
      const whole_num = this.inventoryDetails[0].whole_num
      const id = this.inventoryDetails[0].id
      const consume_num = this.inventoryDetails[0].consume_num
      const disperse_num = this.inventoryDetails[0].disperse_num
      const ids = this.$route.params.ids
      const is_stock_report = 1  //0是暂存   1是提交
      const stock_count_mode = this.$route.params.stock_count_mode
      this.service.getRealdiscEntry(whole_num,id,consume_num,disperse_num,ids,is_stock_report,stock_count_mode).then(res=>{  
          this.inventoryDetails = res.data.data;
          this.setInventoryDetails(this.inventoryDetails); 
          this.$router.push('/stocktaking')
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
@border-radius:3px;
.realdiscentry{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    width: @width;
    height: @height;
    .content{
      width: @width;
      display: flex;
      align-items: center;
      flex-direction: column;
      position: relative;
      .list{
        width: 95%;
        padding-bottom: 70px;
      .checklist{
        display: flex;
        align-items: center;
        flex-direction: column;
        ul{
           width: @width;
           display: flex;
           line-height: 30px;
           margin-top: 10px;
           flex-direction: column;
           li{
              display: flex;
              flex-direction: column;
              line-height: 25px;
              background-color:@background-color;
              margin-bottom: 10px;
               border-radius: @border-radius;
               div{
                  text-align: left;
                  display: flex;
                  justify-content: space-between;
                  padding: 0 10px;
                   p{
                    font-size: 12px;
                    color: #5F7B9A;
                  span{
                    font-size: 13px;
                    color: #395778; 
                  }
                }
              }
              .purchase{
                flex-direction: column;
                margin-top: 10px;
                padding-top: 10px;
                box-shadow: 0 0 10px 0 rgba(71,66,227,0.07);
                input{
                    width: 105px;
                  }
                div{
                    margin-bottom: 10px;
                    border-bottom: 1px solid #D2DFEE; 
                    padding:0 0 10px 0;
                    
                  p{
                    font-size: 13px;
                    color: #395778; 
                    width: 46%;
                    border-right: 1px solid #D2DFEE;
                  }
                  p:last-child{
                    border-right: none;
                  }
                }
                div:last-child{
                   border-bottom:none;
                   margin-bottom:0;
                    p{
                    border-right:none; 
                  }
                }
              }
              .title{
                padding-top: 10px;
                p{
                  font-size: 15px;
                  span{
                      font-size: 11px;
                      color: #A3B3C2;
                      margin-left: 10px;
                      em{
                      font-style: normal;
                      }
                  }
                }
              }
           }
        }
      }
     }
      .temporary{
        width: 102%;
        height: 76px;
        background: #FFF8DD;
        position: fixed;
        bottom: 0;
        .total{
          height: 25px;
          line-height: 25px;
          font-size: 12px;
          color: #5F7B9A;
          span{
            font-size: 15px;
            color: red;
          }
        }
        .button{
          display: flex;
          flex-direction: row;
          height: 50px;
          line-height: 50px;
          justify-content: space-around;
          font-size: 15px;
          color: #FFFFFF; 
          .storage{
             width: 50%;
             cursor: pointer;
             background-color: #395778;
          }
          .sub{
             flex: 1;
             cursor: pointer;
             background-color: #1188FC;
          }
        }
      }
   }
}
</style>


