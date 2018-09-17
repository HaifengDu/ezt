<template>
<div>
  <!-- 盘库详情 -->
   <div v-if="this.types=='a'" class="ezt-page-con librarydetails">
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
                        <div><p>盘库方式：<span>{{warehouse_method}}</span></p></div>
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
          </div>
      </div>
   </div>
   <!-- 审核盘点单 -->
   <div v-if="this.types=='b'" class="ezt-page-con librarydetails">
      <ezt-header :back="true" title="审核盘点单" @goBack="goBack">
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
                        <div><p>盘库方式：<span>{{warehouse_method}}</span></p></div>
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
            <div  class="temporary" slot="confirm">
              <div class="total">货品数量合计：<span v-html="total"></span></div>
              <div class="button">
                <div class="storage" @click="reviewpass">审核不通过</div><div class="sub" @click="auditfailed">审核通过</div>
              </div>
           </div>
          </div>
      </div>
   </div>
   <!-- 确认盘点单 -->
   <!-- 待提交状态下的暂存提交 -->
   <div v-if="this.types=='c'" class="ezt-page-con librarydetails">
      <ezt-header :back="true" title="确认盘点单" @goBack="goBack">
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
                  <div><p>盘点日期：<span>{{busi_date}}</span></p></div>
                  <div><p>盘点方式：<span>{{warehouse_method}}</span></p></div>
                  <div><p>盘点类型：<span>{{bill_type_name}}</span></p></div>
                  <div><p>未盘处理：<span>{{stock_count_mode_name}}</span></p></div>
                  <div><p>盘点仓库：<span>{{warehouse_name}}</span></p></div>
               </li>
             </ul>
           </div>
           <div class="checklist">
              <p class="title">盘点单</p>
              <ul>
                <li :key="index" v-for="(item,index) in inventoryDetails">
                    <div><p>{{item.material_name}}</p><p>编码：<span>{{item.material_num}}</span></p></div>
                    <div><p>规格：<span>{{item.material_model}}</span></p><p>账面数量：<span>{{item.acc_qty}}</span></p></div>
                    <div><p>理论库存：<span>{{item.thery_qty}}</span></p><p>理论消耗：<span>{{item.consume_qty || '0'}}</span></p></div>
                </li>
              </ul>
           </div>
          </div>
           <div class="temporary" slot="confirm">
              <div class="total">货品数量合计：<span v-html="total"></span></div>
              <div class="button">    
                <!-- 盘点类型导入之后的暂存提交接口 -->
                <div class="storage" @click="storage()">暂存1</div><div class="sub" @click="sub()">提交1</div>
              </div>
            </div>  
          </div>    
          </div>
      </div>
     <!-- 盘点类型导入页面的暂存提交 -->
     <div v-if="this.types=='d'" class="ezt-page-con librarydetails">
      <ezt-header :back="true" title="确认盘点单" @goBack="goBack">
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
                  <div><p>盘点日期：<span>{{busi_date}}</span></p></div>
                  <div><p>盘点方式：<span>{{warehouse_method}}</span></p></div>
                  <div><p>盘点类型：<span>{{bill_type_name}}</span></p></div>
                  <div><p>未盘处理：<span>{{stock_count_mode_name}}</span></p></div>
                  <div><p>盘点仓库：<span>{{warehouse_name}}</span></p></div>
               </li>
             </ul>
           </div>
           <div class="checklist">
              <p class="title">盘点单</p>
              <ul>
                <li :key="index" v-for="(item,index) in inventoryDetails">
                    <div><p>{{item.material_name}}</p><p>编码：<span>{{item.material_num}}</span></p></div>
                    <div><p>规格：<span>{{item.material_model}}</span></p><p>账面数量：<span>{{item.acc_qty}}</span></p></div>
                    <div><p>理论库存：<span>{{item.thery_qty}}</span></p><p>理论消耗：<span>{{item.consume_qty || '0'}}</span></p></div>
                </li>
              </ul>
           </div>
          </div>
           <div class="temporary" slot="confirm">
              <div class="total">货品数量合计：<span v-html="total"></span></div>
              <div class="button">    
                <!-- 盘点类型导入之后的暂存提交接口 -->
                <div class="storage" @click="temporarystorage()">暂存2</div><div class="sub" @click="Submission()">提交2</div>
              </div>
            </div>  
          </div>    
          </div>
      </div>
      <!-- 实盘录入 -->
      <div v-if="this.types=='e'" class="ezt-page-con librarydetails">   
          <ezt-header :back="true" title="实盘录入" @goBack="goBack">
            <div slot="action">
                <span></span>
            </div>        
          </ezt-header>    
            <div class="ezt-main">          
                <div class="content">
                  <div class="checklist">
                      <ul>
                        <li :key="index" v-for="(item,index) in inventoryDetails">
                          <div class="title"><p>{{item.material_name}}<span>编码：<em>{{item.material_num}}</em></span></p></div>
                          <div><p>规格：<span>{{item.material_model}}</span></p><p>账面数量：<span>{{item.acc_qty}}</span></p></div>
                          <div><p>理论库存：<span>{{item.thery_qty}}</span></p><p>理论消耗：<span>{{item.consume_qty || '0'}}</span></p></div>
                          <div class="purchase">
                              <div>
                                <p><span><input type="number" v-model="item.whole_num" oninput="if(value.length>7)value=value.slice(0,7)"  placeholder="采购单位">{{item.pur_unit_name}}</span></p>
                                <p><span><input type="number" v-model="item.disperse_num" oninput="if(value.length>7)value=value.slice(0,7)" placeholder="库存主单位">{{item.unit_name}}</span></p>
                              </div>
                              <div>
                                <p><span><input type="number" v-model="item.consume_num"  oninput="if(value.length>7)value=value.slice(0,7)" placeholder="消耗单位">{{item.bom_name}}</span></p>
                              </div>
                          </div>
                        </li>
                      </ul>
                  </div>
          <div class="temporary" slot="confirm">
            <div class="total">货品数量合计：<span v-html="total"></span></div>
            <div class="button">
              <div class="storage" @click="storage">暂存3</div><div class="sub" @click="sub">提交3</div>
            </div>
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
    private getLibraryDetails:INoopPromise;
    private getAuditchecklistno:INoopPromise; // 审核不通过
    private getAuditchecklistyes:INoopPromise;  //审核通过
    private getAdditionalcheckList:INoopPromise;  //盘点类型导入暂存提交接口 
    private getRealdiscEntry:INoopPromise;
    private warehouse_name:string;  
    private busi_date:string;  
    private bill_type:string;
    private bill_type_name:string;
    private stock_count_mode_name:string;
    private inventoryDetails:any; //列表详情
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private total:any = []; //合计
    private types:string;
    private warehouse_method:string;
    private stock_count_mode:string;
    private treatment:string;
    created() {
      this.service = StockTakingService.getInstance();
      this.warehouse_name = this.$route.params.warehouse_name
      this.busi_date = this.$route.params.busi_date
      this.bill_type = this.$route.params.bill_type
      this.bill_type_name = this.$route.params.bill_type_name
      this.stock_count_mode_name = this.$route.params.stock_count_mode_name
      this.types = this.$route.params.types
      this.warehouse_method = this.$route.params.warehouse_method
      this.treatment = this.$route.params.treatment
      this.total = JSON.stringify(this.inventoryDetails.length)

    }

    mounted(){
      
    }
    private goBack(){
      this.$router.back();
    }
    //审核不通过
    private reviewpass(){
        const audit_name = this.user.auth.username
        const ids = this.$route.params.ids
        const opinion = ""
        this.service.getAuditchecklistno(audit_name,ids,opinion).then(res=>{  
            this.inventoryDetails = res.data.data;
            this.setInventoryDetails(this.inventoryDetails); 
            this.$toasted.show("操作成功！")
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)
        })
    }
    // 审核通过
    private auditfailed(){
        const whole_num = this.inventoryDetails[0]['whole_num']
        const id = this.inventoryDetails[0]['id']
        const consume_num = this.inventoryDetails[0]['consume_num']
        const disperse_num = this.inventoryDetails[0]['disperse_num']
        const store_name = this.user.auth.store_name
        const warehouse_name = this.$route.params.warehouse_name
        const audit_name = this.user.auth.username
        const ids = this.$route.params.ids
        const stock_count_mode = this.$route.params.stock_count_mode
        const organ_brief_code = this.user.auth.organ_brief_code
        this.service.getAuditchecklistyes(whole_num,id,consume_num,disperse_num,store_name,warehouse_name,audit_name,ids,stock_count_mode,organ_brief_code).then(res=>{  
            this.inventoryDetails = res.data.data;
            this.setInventoryDetails(this.inventoryDetails); 
            this.$toasted.show("操作成功！")
            this.$router.push('/stocktaking')
        },err=>{   
            this.$toasted.show(err.message)
        })
    }
     //待提交状态下的提交按钮页面的暂存(实盘录入页面暂存)接口 （接口没问题）
      private storage(){
        const whole_num = this.inventoryDetails[0]['whole_num']
        const id = this.inventoryDetails[0]['id']
        const consume_num = this.inventoryDetails[0]['consume_num']
        const disperse_num = this.inventoryDetails[0]['disperse_num']
        const ids = this.$route.params.ids
        const is_stock_report = 0  //0是暂存   1是提交
        const stock_count_mode = this.$route.params.stock_count_mode
        this.service.getRealdiscEntry(whole_num,id,consume_num,disperse_num,ids,is_stock_report,stock_count_mode).then(res=>{  
            this.inventoryDetails = res.data.data;
            this.setInventoryDetails(this.inventoryDetails); 
            this.$toasted.show("操作成功！")
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)
        })
      }
      //待提交状态下的提交按钮的提交接口（实盘录入页面提交）  (接口没问题)
      private sub(){  
        const whole_num = this.inventoryDetails[0]['whole_num']
        const id = this.inventoryDetails[0]['id']
        const consume_num = this.inventoryDetails[0]['consume_num']
        const disperse_num = this.inventoryDetails[0]['disperse_num']
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


    // 盘点类型导入之后的暂存提交接口
    private temporarystorage(){   
        const material_id = this.inventoryDetails[0]['material_id']
        const entry_name = this.user.auth.username
        const bill_status = 0   //暂存
        const bill_type_name = this.$route.params.bill_type_name
        const warehouse_id = this.$route.params.warehouse_name
        const bill_type = this.$route.params.bill_type
        const stock_count_mode_name = this.$route.params.stock_count_mode_name
        const busi_date = this.$route.params.busi_date
        const organ_brief_code = this.user.auth.organ_brief_code
        const stock_count_mode = this.$route.params.treatment
        this.service.getAdditionalcheckList(material_id,entry_name,bill_status,bill_type_name,warehouse_id,bill_type,stock_count_mode_name,busi_date,organ_brief_code,stock_count_mode).then(res=>{  
            this.inventoryDetails = res.data.data;
            this.setInventoryDetails(this.inventoryDetails); 
            this.$toasted.show("操作成功！")
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)
        })
    }

    private Submission(){   
        const material_id = this.inventoryDetails[0]['material_id']
        const entry_name = this.user.auth.username
        const bill_status = 1   //提交
        const bill_type_name = this.$route.params.bill_type_name
        const warehouse_id = this.$route.params.warehouse_name
        const bill_type = this.$route.params.bill_type
        const stock_count_mode_name = this.$route.params.stock_count_mode_name
        const busi_date = this.$route.params.busi_date
        const organ_brief_code = this.user.auth.organ_brief_code
        const stock_count_mode = this.$route.params.treatment
        this.service.getAdditionalcheckList(material_id,entry_name,bill_status,bill_type_name,warehouse_id,bill_type,stock_count_mode_name,busi_date,organ_brief_code,stock_count_mode).then(res=>{  
            this.inventoryDetails = res.data.data;
            this.setInventoryDetails(this.inventoryDetails); 
            this.$toasted.show("操作成功！")
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
        margin-top: 10px;
        .librarytype{
        background-color:@background-color;
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
      .checklist{
        width: @width;
        display: flex;
        align-items: center;
        flex-direction: column;
        .title{
          text-align: left;
          width: @width;
          font-size: 12px;
          color: #95A7BA;
          line-height: 27px;
        }
        ul{
           width: @width;
           display: flex;
           line-height: 30px;
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


