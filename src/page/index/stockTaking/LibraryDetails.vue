<template>
<div>
  <!-- 盘库详情 -->
   <div v-if="this.types=='a'" class="ezt-page-con librarydetails">
      <ezt-header :back="true" title="盘库详情" @goBack="goBack">
        <div slot="action">
            <span></span>
        </div>        
      </ezt-header> 
      <div class="ezt-main ezt-details">
          <div class="content_new">
            <div class="pkdetails_new">
                <div class="librarytype_new">
                  <ul>
                    <li>  
                        <div><p>盘点仓库：<span>{{warehouse_name}}</span></p></div>
                        <div><p>盘点日期：<span>{{busi_date}}</span></p></div>
                        <div><p>盘库方式：<span>{{template_name}}</span></p></div>
                        <div><p>盘点类型：<span>{{bill_type_name}}</span></p></div>
                        <div><p>未盘处理：<span>{{stock_count_mode_name}}</span></p></div>
                    </li>
                  </ul>
                  <div class="round">
                    <div class="right"><a class="RightRound"></a></div>
                    <div class="left"><a class="LeftRound"></a></div>
                  </div>
                </div>   
                <div class="inventory">
                  <div class="pkmx">
                        <div class="line">
                            <p></p>
                            <div class="title">盘库明细</div>
                            <p></p>
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
            <div class="pkdetails_new">
                <div class="librarytype_new">
                  <ul>
                    <li>  
                        <div><p>盘点仓库：<span>{{warehouse_name}}</span></p></div>
                        <div><p>盘点日期：<span>{{busi_date}}</span></p></div>
                        <div><p>盘库方式：<span>{{template_name}}</span></p></div>
                        <div><p>盘点类型：<span>{{bill_type_name}}</span></p></div>
                        <div><p>未盘处理：<span>{{stock_count_mode_name}}</span></p></div>
                    </li>
                  </ul>
                </div>   
                <div class="inventory">
                  <div class="pkmx">
                        <div class="line">
                            <div class="title_new">盘库明细</div>
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
              <div class="total" v-if="this.inventoryDetails.length>0">货品数量合计：<span v-html="total"></span></div>
              <div class="button">
                <div class="storage" @click="reviewpass">审核不通过</div><div class="sub" @click="auditfailed">审核通过</div>
              </div>
           </div>
          </div>
      </div>
   </div>
   <!-- 确认盘点单 -->
   <!-- 待提交状态下提交按钮的暂存提交 -->
   <div v-if="this.types=='c'" class="ezt-page-con librarydetails">
      <ezt-header :back="true" title="确认盘点单" @goBack="goBack">
        <div slot="action">
            <span></span>
        </div>        
      </ezt-header> 
      <div class="ezt-main">
          <div class="content">
          <div class="pkdetails_new">
            <div class="librarytype_new">
             <ul>
               <li>
                  <div><p>盘点日期：<span>{{busi_date}}</span></p></div>
                  <div><p>盘库方式：<span>{{template_name}}</span></p></div>
                  <div><p>盘点类型：{{bill_type_name}}</p></div>
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
              <div class="total" v-if="this.inventoryDetails.length>0">货品数量合计：<span v-html="total"></span></div>
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
                  <div><p>盘库方式：<span>{{template_name}}</span></p></div>
                  <div><p>盘点类型：<span>{{bill_type_name}}</span></p></div>
                  <div>
                    <p>未盘处理：
                       <span>{{stock_count_mode_name}}</span>
                    </p>
                  </div>
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
              <div class="total" v-if="this.inventoryDetails.length>0">货品数量合计：<span v-html="total"></span></div>
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
                                <p>
                                  <span>
                                   <input maxlength="7"  v-model="item.whole_num" placeholder="采购单位"  type='number' oninput="if(value.length>7)value=value.slice(0,7)" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
                                    {{item.pur_unit_name}}
                                  </span>
                                </p>
                                <p>
                                  <span>
                                   <input maxlength="7" v-model="item.disperse_num" placeholder="库存主单位"  type='number' oninput="if(value.length>7)value=value.slice(0,7)" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
                                    {{item.unit_name}}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <p><span>
                                   <input maxlength="7" v-model="item.consume_num" placeholder="消耗单位"  type='number' oninput="if(value.length>7)value=value.slice(0,7)" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
                                  {{item.bom_name}}</span></p>
                              </div>
                          </div>
                        </li>
                      </ul>
                  </div>
          <div class="temporary" slot="confirm">
            <div class="total" v-if="this.inventoryDetails.length>0">货品数量合计：<span v-html="total"></span></div>
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
       'setAddinventory':"stockTaking/setAddinventory",
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
    private warehouse_id:string;  
    private busi_date:string;  
    private bill_type:string;
    private bill_type_name:string;
    private stock_count_mode:string;
    private stock_count_mode_name:string;
    private inventoryDetails:any; //列表详情
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private setAddinventory:INoopPromise//store中给setAddinventory赋值
    private total:any = []; //合计
    private types:string;
    private template_name:string;
    created() {
      this.service = StockTakingService.getInstance();
      this.warehouse_id = this.$route.query.warehouse_id
      this.warehouse_name = this.$route.query.warehouse_name
      this.busi_date = this.$route.query.busi_date
      this.bill_type = this.$route.query.bill_type
      this.bill_type_name = this.$route.query.bill_type_name
      this.stock_count_mode = this.$route.query.stock_count_mode
      this.stock_count_mode_name = this.$route.query.stock_count_mode_name
      this.types = this.$route.query.types
      this.template_name = this.$route.query.template_name
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
        const ids = this.$route.query.ids
        const opinion = ""
        this.service.getAuditchecklistno(audit_name,ids,opinion).then(res=>{  
            this.setInventoryDetails(res.data.data); 
            this.$toasted.show("操作成功！")
            this.$router.push({name:'StockTaking',params:{'purStatus':'审核失败'}});
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
        const warehouse_name = this.$route.query.warehouse_id
        const audit_name = this.user.auth.username
        const ids = this.$route.query.ids
        const stock_count_mode = this.$route.query.stock_count_mode
        const organ_brief_code = this.user.auth.organ_brief_code
        this.service.getAuditchecklistyes(whole_num,id,consume_num,disperse_num,store_name,warehouse_name,audit_name,ids,stock_count_mode,organ_brief_code).then(res=>{  
            this.setInventoryDetails(res.data.data); 
            this.$toasted.show("操作成功！")
            this.$router.push({name:'StockTaking',params:{'purStatus':'待/已生效'}});
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
        const ids = this.$route.query.ids
        const is_stock_report = 0  //0是暂存   1是提交
        const stock_count_mode = this.$route.query.stock_count_mode
        this.service.getRealdiscEntry(whole_num,id,consume_num,disperse_num,ids,is_stock_report,stock_count_mode).then(res=>{  
            this.setInventoryDetails(res.data.data); 
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
        const ids = this.$route.query.ids
        const is_stock_report = 1  // 1是提交    
        const stock_count_mode = this.$route.query.stock_count_mode
        this.service.getRealdiscEntry(whole_num,id,consume_num,disperse_num,ids,is_stock_report,stock_count_mode).then(res=>{  
            this.setInventoryDetails(res.data.data); 
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)   
        })
    }


    // 盘点类型导入之后的暂存提交接口    模板导入
    private temporarystorage(){   
       if(this.inventoryDetails.length === 0){
            this.$toasted.show("没有数据可保存！")
        }
        const material_id = this.inventoryDetails[0]['material_id']
        const entry_name = this.user.auth.username
        const bill_status = 0   //暂存
        const bill_type_name = this.$route.query.bill_type_name
        const warehouse_id = this.$route.query.warehouse_id
        const bill_type = this.$route.query.bill_type
        const stock_count_mode_name = this.$route.query.stock_count_mode_name
        const busi_date = this.$route.query.busi_date
        const organ_brief_code = this.user.auth.organ_brief_code
        const stock_count_mode = this.$route.query.stock_count_mode
        this.service.getAdditionalcheckList(material_id,entry_name,bill_status,bill_type_name,warehouse_id,bill_type,stock_count_mode_name,busi_date,organ_brief_code,stock_count_mode).then(res=>{  
            this.setInventoryDetails(res.data.data); 
            this.template_name =  this.$route.query.template_name
            this.$toasted.show("操作成功！")
            this.$router.push('/')   
            this.setAddinventory({})   
        },err=>{
            this.$toasted.show(err.message)
        })
    }

    private Submission(){   
        if(this.inventoryDetails.length === 0){
            this.$toasted.show("没有数据可提交！")
        }
        const material_id = this.inventoryDetails[0]['material_id']
        const entry_name = this.user.auth.username
        const bill_status = 1   //提交
        const bill_type_name = this.$route.query.bill_type_name
        const warehouse_id = this.$route.query.warehouse_id
        const bill_type = this.$route.query.bill_type
        const stock_count_mode_name = this.$route.query.stock_count_mode_name
        const busi_date = this.$route.query.busi_date
        const organ_brief_code = this.user.auth.organ_brief_code
        const stock_count_mode = this.$route.query.stock_count_mode
        this.service.getAdditionalcheckList(material_id,entry_name,bill_status,bill_type_name,warehouse_id,bill_type,stock_count_mode_name,busi_date,organ_brief_code,stock_count_mode).then(res=>{  
            this.template_name =  this.$route.query.template_name
            this.setInventoryDetails(res.data.data); 
            this.$toasted.show("操作成功！")
            this.$router.push('/')
            this.setAddinventory({})
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
    .content{
       background-color: #F1F6FF;
    }
    .content_new{
      margin-bottom: 0!important;
      background-image: linear-gradient(139deg, #018BFF 0%, #4A39F3 19%);
    }
    .content,.content_new{
      width: @width;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 70px;
      .pkdetails_new{
        .librarytype_new{
          background: url(../../../assets/images/inventory_detail_header.png) #fff no-repeat;
          background-size: 110px 100px;
          background-position-x: right;
          background-position-y: center;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          .round{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .left,.right{
              display: inline-block;
              height:23px;
              a{
                display: inline-block;
                height:20px;
                background-image: linear-gradient(139deg, #018BFF -1%, #4A39F3 -42%);
              }
             .LeftRound{/*左半圆*/
                 width: 10px;
                 border-radius: 14px 0px 0px 14px;
              }
              .RightRound{/*右半圆*/
                width:10px;
                border-radius:0px 14px 14px 0px;
             }
           }
          }
        }
      }
      .pkdetails,.pkdetails_new{
          display: flex;   
          flex-direction: column;
          justify-content: flex-start;
          border-radius: 4px;
          width: 95%;
        .librarytype{  
            background-color: @background-color;
            border-radius:@border-radius;
            margin-top: 10px;
        }
        .librarytype,.librarytype_new{
          ul{
            text-align: left;
            padding: 10px 0 10px 15px;
            li{
              width:@width;
              div{
                line-height: 25px;
                p{
                  width: @width;
                  font-size: 12px;
                  color: #5F7B9A;
                  span{
                    font-size: 12px;
                    color: #395778;
                  }
                }
               }
             }
           }
        }
        .inventory{
          background-color: @background-color;
          margin-top: -1px;
           .pkmx{
               margin-top: -20px;
              .line{
                width: 100%;
                display:flex;
                align-items: center;
                p{
                  flex:2;
                  border-bottom: 1px dashed #ccc;
                  margin: 0 11px 0 11px;
                }
                .title{
                  width:auto;
                  font-size: 12px;
                  color: #95A7BA;
                }
                .title_new{
                  width:100%;
                  text-align:center;
                  color: #95A7BA;
                  margin-top:10px;
                }
              }
            }
            ul{
            text-align: left;
            padding: 10px 10px 10px 15px;
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
                    font-size: 12px;
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
        bottom: -1px;
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
              display: -webkit-box;
              -ms-flex-direction: row;
              line-height: 50px;
              -ms-flex-pack: distribute;
              font-size: 15px;
              color: #FFFFFF;
              width: 105%;
              position: fixed;
              bottom: 0;
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


