<template>
<div>
   <!--确认盘点单  审核盘点单  盘库详情  实盘录入-->
   <div class="ezt-page-con librarydetails" 
        v-if="types== pageType.ConfirmList || types== pageType.AuditList || types== pageType.LibraryDetails || types== pageType.RealdiscEntry || types== pageType.InventoryType">
      <ezt-header :back="true" :title="title">
        <div slot="action">
            <span></span>
        </div>         
      </ezt-header>    
      <div class="ezt-main">
          <div class="content">
          <div class="pkdetails_new">
            <div class="librarytype_new" v-if="types== pageType.AuditList || types== pageType.LibraryDetails || types== pageType.ConfirmList || !types== pageType.RealdiscEntry || types== pageType.InventoryType">             
              <ul>
               <li>
                  <div><p>盘点仓库：<span>{{details.warehouse_name}}</span></p></div>
                  <div><p>盘点日期：<span>{{user.auth.busi_date}}</span></p></div>
                  <div v-if="!InterfaceSysTypeBOH"><p>盘库方式：<span>{{details.template_name}}</span></p></div>
                  <div><p>盘点类型：{{details.bill_type_name}}</p></div>
                  <div v-if="!InterfaceSysTypeBOH"><p>未盘处理：<span>{{details.stock_count_mode_name}}</span></p></div>
               </li>
             </ul>
           </div>
           <div class="checklist">
              <p class="title" v-if="types== pageType.AuditList || types== pageType.LibraryDetails || types== pageType.ConfirmList || !types== pageType.RealdiscEntry || types== pageType.InventoryType">盘点单</p>
              <ul>
                <li :key="index" v-for="(item,index) in inventoryDetails">
                    <div>   
                      <p>
                         <span style="margin-right:10px;">{{item.material_name}}</span>
                         编码：<span>{{item.material_num}}</span>
                      </p>
                    </div>
                    <div>
                        <p>规格：<span>{{item.material_model}}</span></p>
                        <p>单位：<span>{{item.unit_name}}</span></p>
                    </div>
                    <div v-if="!InterfaceSysTypeBOH">
                      <p>理论库存：<span>{{item.thery_qty}}</span></p>
                      <p>理论消耗：<span>{{item.consume_qty || '0'}}</span></p>
                    </div>
                    <div v-if="types== pageType.AuditList || types== pageType.LibraryDetails">
                      <p v-if="!InterfaceSysTypeBOH">采购单位：<span>{{item.whole_num || '0'}}{{item.pur_unit_name}}</span></p>
                      <p v-if="!InterfaceSysTypeBOH">库存主单位：<span>{{item.disperse_num || '0'}}{{item.unit_name}}</span></p>
                      <p v-if="InterfaceSysTypeBOH">账面数量：<span>{{item.acc_qty}}</span></p>
                      <p v-if="InterfaceSysTypeBOH">实盘数：<span>{{item.disperse_num || '0'}}</span></p>
                    </div>
                    <div v-if="types== pageType.AuditList || types== pageType.LibraryDetails">
                       <p v-if="!InterfaceSysTypeBOH">消耗单位：<span>{{item.consume_num || '0'}}{{item.bom_name}}</span></p>
                    </div>
                    <div class="purchase" v-if="types== pageType.RealdiscEntry">
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
          </div>
           <div class="temporary" slot="confirm" v-if="types== pageType.AuditList || types== pageType.ConfirmList || types== pageType.RealdiscEntry || types== pageType.InventoryType">
              <div class="total" v-if="this.inventoryDetails.length>=0 || !types== pageType.LibraryDetails">货品数量合计：<span>{{this.inventoryDetails.length}}</span></div>
                <!-- 盘点类型导入之后的暂存提交接口 --> 
                <div class="button" v-if="types== pageType.AuditList || types== pageType.ConfirmList || types== pageType.RealdiscEntry">
                    <div class="storage" @click="storage">暂存1</div>
                    <div class="sub" @click="sub">提交1</div>
                </div>
                <div class="button" v-if="types== pageType.AuditList">
                     <div class="storage" v-if="!InterfaceSysTypeBOH"  @click="reviewpass">审核不通过</div>
                     <div class="sub" @click="auditfailed">审核通过</div>
                </div>
                 <div class="button" v-if="types== pageType.InventoryType">    
                    <div class="storage" @click="temporarystorage">暂存2</div>
                    <div class="sub" @click="Submission">提交2</div>
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
import { FactoryService } from "../../../factory/FactoryService"
import { IStockTakingService } from "../../../interface/service/IStockTakingService"
import { CachePocily } from "../../../common/Cache";
import { PageType } from "../../../enum/EPageType";  
import CACHE_KEY from '../../../constans/cacheKey'
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       "user":"user",
       'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',//BOH接口
     }) 
   },
   methods:{ 
     ...mapActions({
       
     }),
   }        
})  
export default class stockTaking extends Vue{
    private user:IUser;   
    private pager:Pager;   
    private service: IStockTakingService;
    private InterfaceSysTypeBOH:boolean;
    private cache = CachePocily.getInstance();
    private details:any={};  //盘库表头信息
    private inventoryDetails:any[]=[];//详情页物品信息
    private types:string = '';  //页面类型
    private title:string = '';//页面表头
    private pageType = PageType;
    created() {
      const factory = FactoryService.getInstance().createFactory();
      this.service = factory.createStockTaking();
      this.types = this.$route.query.types
      if(this.types == '0'){
         this.title = "盘库详情";
      }else if(this.types == '1'){
         this.title = "实盘录入"
      }else if(this.types == '2'){
         this.title = "确认盘点单"
      }else if(this.types == '3'){
         this.title = "审核盘点单"
      }else if(this.types == '4'){
         this.title = "盘点类型导入"
      }

      /**
       * 盘点类型导入 模板导入
       */
      if(this.cache.getData(CACHE_KEY.ADDINVENTORY)){
            this.details = JSON.parse(this.cache.getData(CACHE_KEY.ADDINVENTORY));
            this.details.warehouse_name = this.details.stock
            this.details.bill_type_name = this.details.name
            this.details.stock_count_mode_name = this.details.treatment
            this.details.warehouse_id = this.details.stock
      }   
      /**
       * 公共方法
       */
      if(this.cache.getData(CACHE_KEY.INVENTORY_LIST)){
            this.details = JSON.parse(this.cache.getData(CACHE_KEY.INVENTORY_LIST));
      }
      if(this.cache.getData(CACHE_KEY.INVENTORY_DETAILS)){
          this.inventoryDetails = JSON.parse(this.cache.getData(CACHE_KEY.INVENTORY_DETAILS));
          if(this.InterfaceSysTypeBOH){
              this.inventoryDetails = this.inventoryDetails['details']
          }
      }
      if(this.cache.getData(CACHE_KEY.TEMPLATE_NAME)){
            const template_name = JSON.parse(this.cache.getData(CACHE_KEY.TEMPLATE_NAME));
            this.details.template_name = template_name.templateName
      }
      
    }
    mounted(){       
      
    }
    /**
     * 审核不通过
     */
    private reviewpass(item:any){         
        const audit_name = this.user.auth.username
        const ids = this.details.id
        const opinion = ""
        this.service.getAuditchecklistno(audit_name,ids,opinion).then(res=>{  
            this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item))
            this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data))
            this.$toasted.show("操作成功！")
            this.cache.clear()
            this.$router.push({name:'StockTaking',params:{'purStatus':'审核失败'}})
        },err=>{
            this.$toasted.show(err.message)
        })   
    }
    /**
     * 审核通过
     */
    private auditfailed(item:any,rows:Array<any>){
       var rows=[];
       this.inventoryDetails.forEach((item:any) => {
            let obj = {
                whole_num:item.whole_num,   
                id:item.id,
                consume_num:item.consume_num,
                disperse_num:item.disperse_num
              };
            rows.push(obj);
        });
        let billInfo={
          "store_name": this.user.auth.store_name,
          "warehouse_name":this.details.warehouse_id,
          "audit_name":this.user.auth.username,
          "ids":this.details.id,
          "stock_count_mode":this.details.stock_count_mode,
          "organ_brief_code":this.user.auth.organ_brief_code,
          "details":rows
        }
        this.service.getAuditchecklistyes(billInfo).then(res=>{  
            this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item))
            this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data))
            this.$toasted.show("操作成功！")
            this.cache.clear()
            this.$router.push({name:'StockTaking',params:{'purStatus':'待/已生效'}});
        },err=>{   
            this.$toasted.show(err.message)
        })
    }
     /**
       * 待提交状态下的暂存按钮      实盘录入暂存
       */
      private storage(item:any,list:Array<any>){
        this.inventoryDetails['details'].forEach((item:any) => {
            let obj = {
                whole_num:item.whole_num,   
                id:item.id,
                consume_num:item.consume_num,
                disperse_num:item.disperse_num
              };
            list.push(obj);
        });
        let content={
          "ids":this.details.id, 
          "is_stock_report":0,  //0是暂存   1是提交
          "stock_count_mode":this.details.stock_count_mode,
        }
        
        this.service.getRealdiscEntry(list,content).then(res=>{  
            this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item))
            this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data))
            this.$toasted.show("操作成功！")
            this.cache.clear()
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)
        })
      }
      /**
       * 待提交状态下的提交按钮      实盘录入提交
       */
      private sub(item:any,list:Array<any>){  
        this.inventoryDetails['details'].forEach((item:any) => {
            let obj = {
                whole_num:item.whole_num,   
                id:item.id,
                consume_num:item.consume_num,
                disperse_num:item.disperse_num
              };
            list.push(obj);
        });
        let content={
          "ids":this.details.id,
          "is_stock_report":1,  // 1是提交    
          "stock_count_mode":this.details.stock_count_mode,
        }
        this.service.getRealdiscEntry(list,content).then(res=>{  
            this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item))
            this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data))
            this.$toasted.show("操作成功！")
            this.cache.clear() 
            this.$router.push('/stocktaking')
        },err=>{
            this.$toasted.show(err.message)   
        })
    }

    /**
     * 盘点类型导入 模板导入  暂存按钮
     */
    private temporarystorage(item:any,rows:Array<any>){   
       if(this.inventoryDetails.length === 0){
            this.$toasted.show("没有数据可保存！")
        }
        if(!this.InterfaceSysTypeBOH){
            var rows=[];
            this.inventoryDetails.forEach((item:any) => {
                let obj = {
                    material_id:item.material_id,   
                  };
                rows.push(obj);
            });
            let billInfo={
              "entry_name":this.user.auth.username,
              "bill_status":0,   //暂存
              "bill_type_name":this.details.bill_type_name,
              "warehouse_id":this.details.warehouse_id,
              "bill_type":this.details.bill_type,
              "stock_count_mode_name":this.details.treatment,
              "busi_date":this.user.auth.busi_date,
              "organ_brief_code":this.user.auth.organ_brief_code,
              "stock_count_mode":this.details.treatment,
              "details":rows
            }
            this.service.getAdditionalcheckList(billInfo).then(res=>{  
                this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item));
                this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
                this.cache.clear();
                this.$toasted.show("操作成功！")
                this.$router.push('/')   
            },err=>{
                this.$toasted.show(err.message)
            })
        }else{
            var rows=[];
            this.inventoryDetails.forEach((item:any) => {
                let obj = {
                    material_id:item.material_id,   
                  };
                rows.push(obj);
            });
            let billInfo={
              "entry_name":this.user.auth.username,
              "bill_status":0,   //暂存
              "bill_type_name":this.details.bill_type_name,
              "warehouse_id":this.details.warehouse_id,
              "bill_type":this.details.bill_type,
              "stock_count_mode_name":this.details.treatment,
              "busi_date":this.user.auth.busi_date,
              "organ_brief_code":this.user.auth.organ_brief_code,
              "stock_count_mode":this.details.treatment,
              "details":rows
            }
            this.service.getAdditionalcheckList(billInfo).then(res=>{  
                this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item));
                this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
                this.cache.clear();
                this.$toasted.show("操作成功！")
                this.$router.push('/')   
            },err=>{
                this.$toasted.show(err.message)
            })
        }
    }
    /**
     * 盘点类型导入 模板导入  提交按钮
     */
    private Submission(item:any,rows:Array<any>){   
        if(this.inventoryDetails.length === 0){
            this.$toasted.show("没有数据可提交！")
        }
        if(!this.InterfaceSysTypeBOH){
            var rows=[];
            this.inventoryDetails.forEach((item:any) => {
                let obj = {
                    material_id:item.material_id,   
                  };
                rows.push(obj);
            });
            let billInfo={
              "entry_name":this.user.auth.username,
              "bill_status":1,   //提交
              "bill_type_name":this.details.bill_type_name,
              "warehouse_id":this.details.warehouse_id,
              "bill_type":this.details.bill_type,
              "stock_count_mode_name":this.details.treatment,
              "busi_date":this.user.auth.busi_date,
              "organ_brief_code":this.user.auth.organ_brief_code,
              "stock_count_mode":this.details.treatment,
              "details":rows
            }
            this.service.getAdditionalcheckList(billInfo).then(res=>{  
                this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item));
                this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
                this.$toasted.show("操作成功！")
                this.cache.clear();
                this.$router.push('/')
            },err=>{
                this.$toasted.show(err.message)
            })
        }else{
            var rows=[];
            this.inventoryDetails.forEach((item:any) => {
                let obj = {
                    material_id:item.material_id,   
                  };
                rows.push(obj);
            });
            let billInfo={
              "entry_name":this.user.auth.username,
              "bill_status":1,   //提交
              "bill_type_name":this.details.bill_type_name,
              "warehouse_id":this.details.warehouse_id,
              "bill_type":this.details.bill_type,
              "stock_count_mode_name":this.details.treatment,
              "busi_date":this.user.auth.busi_date,
              "organ_brief_code":this.user.auth.organ_brief_code,
              "stock_count_mode":this.details.treatment,
              "details":rows
            }
            this.service.getAdditionalcheckList(billInfo).then(res=>{  
                this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item));
                this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
                this.$toasted.show("操作成功！")
                this.cache.clear();
                this.$router.push('/')
            },err=>{
                this.$toasted.show(err.message)
            })
        }
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
      width: @width;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 70px;
      .pkdetails_new{
          display: flex;   
          flex-direction: column;
          justify-content: flex-start;
          border-radius: 4px;
          width: 95%;
        .librarytype_new{
            background: url(../../../assets/images/inventory_detail_header.png) #fff no-repeat;
            background-size: 110px 100px;
            background-position-x: right;
            background-position-y: center;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
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


