<!--新增盘库单-->
<template>
 <div>
  <!-- 新增盘点单 -->
   <div class="ezt-page-con addinventorylist">
    <ezt-header :back="true" title="新增盘库单" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">   
       <div class="content">
          <div class="store">  
            <group>   
              <x-input title='门店名称' text-align="right" disabled  v-model="user.auth.store_name||'-'">{{user.auth.store_name||'-'}}</x-input>
              <x-input title='盘点日期' text-align="right" disabled  v-model="user.auth.busi_date">{{user.auth.busi_date}}</x-input>
              <x-input title='盘点类型' text-align="right" disabled v-model="name">{{name}}</x-input>
            </group>       
          </div> 
          <div class="warehouse">
              <ul>   
                 <li class="select-list">
                  <span class="title-search-name ">仓库：</span>
                  <span class="title-select-name item-select">
                    <select placeholder="请选择仓库" class="ezt-select"  @click="iswarehouseType()" v-model="addinventory.stock">
                      <option :value="type.id" :key="index" v-for="(type,index) in warehouseType">{{type.text}}</option>
                    </select>   
                  </span>   
                </li>
                 <li class="select-list">
                  <span class="title-search-name ">未盘处理：</span>
                  <span class="title-select-name item-select">
                    <select placeholder="请选择未盘处理方式" class="ezt-select"  v-model="addinventory.treatment">
                      <option :value="item.name" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                    </select>
                  </span>
                </li>
              </ul>
          </div>
          <div class="method">
              <p>盘点方式</p>
              <ul>
                <li @click="manualproduction('/selectinginventory')">手工制单</li>
                <li @click="templateimport()">模板导入</li>
                <li @click="inventorytype('c')">盘点类型导入</li>
              </ul>
          </div>
       </div>
      </div>    
   </div> 
    <!-- 返回提示信息 -->
    <confirm v-model="isSave" @on-confirm="onConfirm">
      <p style="text-align:center;"> 返回后，本次操作记录将丢失，请确认是否离开？</p>
    </confirm> 
  </div>
</template>  
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import IUser from "../../../interface/IUserModel"
import StockTakingService from "../../../service/StockTakingService"
import SelectingInventory from './SelectingInventory'
import librarydetails from './LibraryDetails'
@Component({  
   components:{    
      SelectingInventory
   },   
   computed:{  
     ...mapGetters({
       "user":"user",
       'addInventory':'stockTaking/addInventory',//新增盘库单数据
       'pkinventory':'stockTaking/pkinventory',//盘点类型
       'inventoryDetails':'stockTaking/inventoryDetails',//盘点详情  确认盘点单
       'pktemplateimport':'stockTaking/pktemplateimport',//模板导入
     }) 
   },
   methods:{ 
     ...mapActions({
       'setAddinventory':"stockTaking/setAddinventory",
       'setInventoryType':"stockTaking/setInventoryType",
       'setInventoryDetails':"stockTaking/setInventoryDetails",
       'setPktemplateimport':"stockTaking/setPktemplateimport"
     })

   }   
})  

export default class stockTaking extends Vue{
    private user:IUser;
    private service:StockTakingService;
    private getTemplateImport:INoopPromise;  //模板导入
    private bill_type:string; //弹层盘点类型
    private daily_inventory:string;
    private week_inventory:string;
    private period_inventory:string;
    private inventory:string;
    private warehouseType:any[] = [];  //动态加载仓库
    private isSave:boolean = false;//确认不保存
    private addinventory:any = {};//store中
    private SelectingInventory:boolean = false;
    private addInventory:any;   
    private setAddinventory:INoopPromise//store中给setAddinventory赋值
    private pkinventory:any;
    private setInventoryType:INoopPromise//store中给setInventoryType赋值
    private inventoryDetails:any[] = []; //列表详情  确认盘点单
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private pktemplateimport:any[] = []; //模板
    private setPktemplateimport:INoopPromise//store中给setPktemplateimport赋值
    private name:string;
    private warehouse_name:string;  
    private busi_date:string;  
    private bill_type_name:string;
    private stock_count_mode_name:string;
    private orderType:any[] = [{
      name:"按照当前库存量处理",
      type:"q"
    },{
      name:"按照0库存量处理",
      type:"m"
    }];
    created() {
       this.service = StockTakingService.getInstance();
       this.name = this.$route.params.name
      //  this.setInventoryType(this.pkinventory,this.name);
       
    }

    mounted(){
     

    }
    // 返回   
    private goBack(){
      if((this.addinventory&&this.addinventory.stock)||this.addinventory.length>0){
        this.isSave=true;
      }else{
        this.$router.push('/stocktaking');
      }
    }
    private onConfirm(){//确认离开，清空store中的物料和单据信息
      this.setAddinventory({}),
      this.$router.push('/stocktaking');
    }
    
    // 手工制单
    manualproduction(info:string){
        if(this.addinventory){
         if(!this.addinventory.stock){
            this.$toasted.show("请选择仓库！");
            return false;
         }
         this.$router.push(info)
        this.setInventoryType(this.pkinventory);
        this.setAddinventory(this.addinventory);
        }
    }
   
    //盘点类型导入
     private inventorytype(types:any){
        if(this.addinventory){
         if(!this.addinventory.stock){
            this.$toasted.show("请选择仓库！");
            return false;
         }
        const flag = this.pkinventory;
        const warehouse_id = this.addinventory.stock;
        this.service.getInventorytypeImport(flag,warehouse_id).then(res=>{ 
             this.$router.push({
                name:'LibraryDetails',
                 params:{
                    busi_date:this.user.auth.busi_date,
                    bill_type_name:this.name,
                    warehouse_name: this.addinventory.stock,
                    stock_count_mode_name:this.addinventory.treatment,
                    types:types,
                }
              });
              this.inventoryDetails = res.data.data;
              console.log("确认盘点单--------"+JSON.stringify(this.inventoryDetails))
              this.setInventoryDetails(this.inventoryDetails); 
              this.setInventoryType(this.pkinventory);
              this.setAddinventory(this.addinventory);
          },err=>{
              this.$toasted.show(err.message)
          })
        }
     }
    //模板导入
     private templateimport(info:string){
       if(this.addinventory){
         if(!this.addinventory.stock){
            this.$toasted.show("请选择仓库！");
            return false;
         }
        const warehouse_id = this.addinventory.stock;
        this.service.getTemplateImport(warehouse_id).then(res=>{ 
              this.$router.push({
                name:'SelecttheTemplate',
                 params:{
                    busi_date:this.user.auth.busi_date,
                    bill_type_name:this.name,
                    warehouse_name: this.addinventory.stock,
                    stock_count_mode_name:this.addinventory.treatment,
                    pdtype : this.pkinventory
                }
              });
              this.pktemplateimport = res.data.data;
              this.setPktemplateimport(this.pktemplateimport); 
          },err=>{
              this.$toasted.show(err.message)
          })
        
        }
     }
    //  动态加载仓库
    private iswarehouseType(){
      this.service.getWarehouse(this.pkinventory).then(res=>{ 
          this.warehouseType = res.data.data;
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
.ezt-main{
    background-color: #F1F6FF;
    position: absolute; 
    top: 0; 
    width: 100%;
    height: auto;
    margin-top: 45px;
    margin-bottom: 0px;
}
.demo3-slot{
  text-align: center;
  padding: 8px 0;
  color: #888;
}
.addinventorylist{
    position: absolute;
    background-color: #F1F6FF;
    top: 0;
    left: 0;
    z-index: 99;
    width: @width;
    height: @height;
    .content{
      width: @width;
      height:@height;
      display: flex;
      align-items: center;
      flex-direction: column;
      .store,.warehouse{
        width: 100%;
        text-align: left;
        .weui-cells,.vux-no-group-title{
          margin-top: 0 !important;
        }
      }
      .warehouse{
        margin-top: 10px;
        ul{
          background-color: @background-color;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          li{
            height: 45px;
            line-height: 45px;
            width: 96%;
            border-bottom: 1px solid  #D2DFEE;
            position: relative;
          }
          li:last-child{
            border-bottom: none;
          }
        }
      }
    .method{
          width: @width;
          display: flex;
          flex-direction: column;
        p{
          font-size: 13px;
          color: #95A7BA;
          margin-top: 10px;
        }
        ul{
           display: flex;
           margin-top: 20px;
           justify-content: space-around;
          li{
            width: auto;
            font-size: 13px;
            border-radius: @border-radius;
            color: #1188FC;
            background-color: @background-color;
            padding: 10px 15px;
            cursor: pointer;
          }
        }
      }
   }
}


</style>


