<!--盘库详情-->
<template>
<div class="ezt-page-con librarydetails">
    <ezt-header v-if="this.types=='a'" :back="true" title="盘库详情" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header> 
    <ezt-header v-if="this.types=='b'" :back="true" title="审核盘点单" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>  
     <ezt-header v-if="this.types=='c'" :back="true" title="确认盘点单"  @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>   
    <div class="ezt-main">       
        <div class="content">
            <div class="pkdetails" v-if="this.types=='a' || this.types=='b'">
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
                     <li :key="index" v-for="(item,index) in inventoryDetails">
                      <p class="name">{{item.material_name}}</p>
                      <div><p>编码：<span>{{item.material_num}}</span></p><p>规格：<span>{{item.material_model}}</span></p></div>
                      <div><p>账面数量：<span>{{item.acc_qty}}</span></p><p>理论库存：<span>{{item.thery_qty}}</span></p></div>
                      <div><p>理论消耗：<span>{{item.consume_qty || '0'}}</span></p><p>采购单位：<span>{{item.whole_num || '0'}}{{item.pur_unit_name}}</span></p></div>
                      <div><p>库存主单位：<span>{{item.disperse_num || '0'}}{{item.unit_name}}</span></p><p>消耗单位：<span>{{item.consume_num || '0'}}{{item.bom_name}}</span></p></div>
                    </li>
                  </ul>
              </div>
          </div>
           <div v-if="this.types=='b'" class="temporary" slot="confirm">
            <div class="total">货品数量合计：<span v-html="total"></span></div>
            <div class="button">
              <div class="storage" @click="reviewpass">审核不通过</div><div class="sub" @click="auditfailed">审核通过</div>
            </div>
          </div>
          <div class="list" v-if="this.types=='c'">
            <div class="details">
             <ul>
               <div><li>盘点日期：<span>{{busi_date}}</span></li><li>盘点方式：<span>{{pdfs}}</span></li></div>
               <div><li>盘点类型：<span>{{bill_type_name}}</span></li></div>
               <div><li>未盘处理：<span>{{stock_count_mode_name}}</span></li></div>
               <div><li>盘点仓库：<span>{{warehouse_name}}</span></li></div>
             </ul>
           </div>
           <div class="checklist">
              <p class="title">盘点单</p>
              <ul>
                <li :key="index" v-for="(item,index) in inventoryDetails">
                  <div><p>{{item.material_name}}<span>编码：<em>{{item.material_num}}</em></span></p></div>
                  <div><p>规格：<span>{{item.material_model}}</span></p><p>账面数量：<span>{{item.acc_qty}}</span></p></div>
                  <div><p>理论库存：<span>{{item.thery_qty}}</span></p><p>理论消耗：<span>{{item.consume_qty || '0'}}</span></p></div>
                </li>
              </ul>
           </div>
          </div>
          <div class="temporary" slot="confirm" v-if="this.types=='c'">
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
import IUser from "../../../interface/IUserModel"
import StockTakingService from '../../../service/StockTakingService'
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       "user":"user",
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
    private user:IUser;
    private pager:Pager;   
    private service: StockTakingService;
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private getLibraryDetails:INoopPromise;
    private getAuditchecklistno:INoopPromise; // 审核不通过
    private getAuditchecklistyes:INoopPromise;  //审核通过
    private getRealdiscEntry:INoopPromise;
    private warehouse_name:string;  
    private busi_date:string;  
    private bill_type_name:string;
    private stock_count_mode_name:string;
    private inventoryDetails:any; //列表详情
    private total:any = []; //合计
    private types:string;
    created() {
      this.service = StockTakingService.getInstance();
      this.warehouse_name = this.$route.params.warehouse_name
      this.busi_date = this.$route.params.busi_date
      this.bill_type_name = this.$route.params.bill_type_name
      this.stock_count_mode_name = this.$route.params.stock_count_mode_name
      this.types = this.$route.params.types
      this.total = JSON.stringify(this.inventoryDetails.length)
    }

    mounted(){
      
    }
    private goBack(){
      this.$router.back();
    }
    //审核不通过
    private reviewpass(){
        debugger
        const audit_name = this.user.auth.username
        const ids = this.$route.params.ids
        const opinion = ""
        this.service.getAuditchecklistno(audit_name,ids,opinion).then(res=>{  
            this.inventoryDetails = res.data.data;
            this.setInventoryDetails(this.inventoryDetails); 
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)
        })
    }
    // 审核通过
    private auditfailed(){
         debugger
        const whole_num = this.inventoryDetails[0].whole_num
        const id = this.inventoryDetails[0].id
        const consume_num = this.inventoryDetails[0].consume_num
        const disperse_num = this.inventoryDetails[0].disperse_num
        const store_name = this.user.auth.store_name
        const warehouse_name = this.$route.params.warehouse_name
        const audit_name = this.user.auth.username
        const ids = this.$route.params.ids
        const stock_count_mode = this.$route.params.stock_count_mode
        const organ_brief_code = this.$route.params.organ_brief_code
        this.service.getAuditchecklistyes(whole_num,id,consume_num,disperse_num,store_name,warehouse_name,audit_name,ids,stock_count_mode,organ_brief_code).then(res=>{  
            this.inventoryDetails = res.data.data;
            this.setInventoryDetails(this.inventoryDetails); 
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)
        })
    }

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
@border-radius:3px;
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
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 70px;
      .pkdetails{
        display: flex;   
        flex-direction: column;
        justify-content: flex-start;
        border-radius: 4px;
        width: 95%;
        background-color:@background-color;
        margin-top: 10px;
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
      .list{
        background-color:@background-color;
        width: 95%;
        margin-top: 10px;
        .details{
        padding: 15px 0;
        border-radius: @border-radius;
        ul{
          div{ 
            display: flex;
            justify-content: space-between;
            line-height: 25px;
            padding: 0 10px;
            li{
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
      .checklist{
        background-color: #F1F6FF;
        display: flex;
        flex-direction: column;
        .title{
          margin-top: 5px;
          font-size: 12px;
          color: #95A7BA;
          text-align: left;
        }
        ul{
           display: flex;
           line-height: 30px;
           margin-top: 5px;
           flex-direction: column;
           width: 100%;
           li{
              display: flex;
              flex-direction: column;
              margin-bottom: 10px;
              border-radius: @border-radius;
              background-color: @background-color;
              line-height: 25px;
              padding: 10px 0 10px 0;
               div{
                  text-align: left;
                  display: flex;
                  justify-content: space-between;
                  padding: 0 15px;
                   p{
                    font-size: 12px;
                    color: #5F7B9A;
                  span{
                    font-size: 13px;
                    color: #395778; 
                  }
                }
              }
              div:first-child{
                p{
                  font-size: 15px;
                  color: #395778 !important;
                  span{
                      font-size: 11px;
                      color: #A3B3C2;
                      margin-left: 30px;
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


