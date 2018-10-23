<template>
 <div>
  <!-- 新增盘点单 -->
   <div class="ezt-page-con addinventorylist">
    <ezt-header :back="true" title="新增盘库单" @goBack="goBack" :isInfoGoback="true">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>        
    <div class="ezt-main">   
       <div class="content">
          <div class="store">  
            <group>       
              <x-input title='门店名称' text-align="right" disabled  v-model="user.auth.store_name">{{user.auth.store_name||'-'}}</x-input>  
              <x-input title='盘点日期' text-align="right" disabled  v-model="user.auth.busi_date">{{user.auth.busi_date}}</x-input>
              <x-input title='盘点类型' text-align="right" disabled v-model="addinventory.name">{{addinventory.name}}</x-input> 
            </group>        
          </div>    
          <div class="warehouse">
              <ul>   
                 <li class="select-list">
                  <span class="title-search-name is-required">仓库：</span>
                  <span class="title-select-name item-select">
                    <select placeholder="请选择仓库" class="ezt-select" v-model="addinventory.stock"
                    @change="handlerStock('stock')" :class="[{'selectError':LibraryField[0].stock}]"> 
                      <option :value="item.id" :key="index" v-for="(item,index) in warehouseType">{{item.text}}</option>
                    </select> 
                  </span>   
                </li>   
                 <li class="select-list">
                  <span class="title-search-name is-required">未盘处理：</span>
                  <span class="title-select-name item-select">
                    <select placeholder="请选择未盘处理方式" class="ezt-select"  v-model="addinventory.treatment"
                    @change="handlerStock('treatment')" :class="[{'selectError':LibraryField[1].treatment}]">
                      <option :value="mode.value" :key="index" v-for="(mode,index) in orderType">{{mode.name}}</option>
                    </select>
                  </span>  
                </li>
              </ul>    
          </div>
          <div class="method">
              <p>盘点方式</p>        
              <ul>
                <li @click="manualproduction('manual')">手工制单</li>
                <li @click="templateimport()">模板导入</li>
                <li @click="inventorytype(pageType.InventoryType)">盘点类型导入</li>
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
import IUser from "../../../interface/IUserModel"
import StockTakingService from "../../../service/StockTakingService"
import ObjectHelper from '../../../common/objectHelper'
import { CachePocily } from "../../../common/Cache"
import { ECache } from "../../../enum/ECache"
import CACHE_KEY from '../../../constans/cacheKey'
import { PageType } from "../../../enum/EPageType"
@Component({  
   components:{  

   },   
   computed:{  
     ...mapGetters({
       "user":"user",
      
     }) 
   },
   methods:{ 
     ...mapActions({
      
     })
   }   
})  

export default class stockTaking extends Vue{
    private user:IUser;
    private cache = CachePocily.getInstance();
    private service:StockTakingService;
    private bill_type:string; //弹层盘点类型
    private pageType = PageType; //页面类型
    private warehouseType:any[] = [];  //动态加载仓库
    private addinventory:any={};//新增盘库单
    private selectedGood:any[];//store中selectedGood的值
    private addBeforeBillInfo:any={};//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
    private addBillInfo:any={
       editPrice:false
    }; 
    private orderType:any[] = [{
      name:"按照当前库存量处理",
      value:"is_quanlity"
    },{   
      name:"按照0库存量处理",
      value:"is_zero"
    }];
    private LibraryField=[
        {id:"stock",msg:"请选择仓库！",stock:false},
        {id:"treatment",msg:"请选择未盘处理方式！",treatment:false},
    ];
    created() {
       this.service = StockTakingService.getInstance();
       /**
        * 选择货品
        */
      (this.selectedGood||[]).forEach(item=>item.active = false);
      if(this.cache.getData(CACHE_KEY.ORDER_ADDINFO)){
          this.addBillInfo = JSON.parse(this.cache.getData(CACHE_KEY.ORDER_ADDINFO));
      }
      if(this.cache.getData(CACHE_KEY.ORDER_ADDBEFOREINFO)){
          this.addBeforeBillInfo = JSON.parse(this.cache.getData(CACHE_KEY.ORDER_ADDBEFOREINFO));
      }    
      if(this.cache.getData(CACHE_KEY.INVENTORY_TYPE)){
          const InventoryType = JSON.parse(this.cache.getData(CACHE_KEY.INVENTORY_TYPE));
          this.addinventory.name = InventoryType.name
          this.addinventory.bill_type = InventoryType.bill_type
      }
      if(this.cache.getData(CACHE_KEY.ADDINVENTORY)){
          this.addinventory = JSON.parse(this.cache.getData(CACHE_KEY.ADDINVENTORY));
      }
       /**
        * 选择仓库
        */
       this.getWarehouseType();
    }  
    mounted(){   
       

    }   
    /**
     * 返回上一页 
     */   
    private goBack() {
      let _this = this;   
      if((this.addinventory&&this.addinventory.stock)||this.addinventory.length>0){
          this.$vux.confirm.show({
              // 组件除show外的属性
              onCancel () {
                  console.log(this)   // 非当前 vm
              },       
              onConfirm () {
                   _this.addinventory.stock={};
                   _this.addinventory.treatment={};
                   _this.$router.push('/stocktaking');
              },
              content:"返回后，本次操作记录将丢失，请确认是否离开？"
          })
      }else{
          this.$router.push('/stocktaking');
      }
    }
    /**
     * 动态加载仓库
     */
    private getWarehouseType(){
      this.service.getWarehouse(this.addinventory.bill_type).then(res=>{ 
          this.warehouseType = res.data.data;
      },err=>{
          this.$toasted.show(err.message)
      })
    }
    /**
     * 选择完仓库  未盘处理方式
     */
    private handlerStock(val:any){
      this.LibraryField.forEach(item=>{
        if(item.id == val){
           item[val]= false;
        }
      })      
    }
    /**
     * 手工制单
     */
      manualproduction(newType:any){
        if(this.addinventory){
          let _this = this;
          for(let i=0;i<this.LibraryField.length;i++){
            let item = this.LibraryField[i];
            if(!this.addinventory[item.id]||this.addinventory[item.id]==""){
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
             }
          }
          this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(this.addBillInfo));
          this.cache.save(CACHE_KEY.ORDER_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
          this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(this.addinventory));
          this.$router.push({name:'PublicAddGood',query:{newType:newType}})
        }
      }
     /**
      * 盘点类型导入
      */
     private inventorytype(types:PageType,item:any,type:any){
        if(this.addinventory){
         let templateName = {};
         let addinventory = {};
         const flag = this.addinventory.bill_type;
         const warehouse_id = this.addinventory.stock;
         for(let i=0;i<this.LibraryField.length;i++){
            let item = this.LibraryField[i];
            if(!this.addinventory[item.id]||this.addinventory[item.id]==""){
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
             }
         }
        templateName = {templateName:"盘点类型导入"}
        addinventory = {
            name:this.addinventory.name,
            bill_type:this.addinventory.bill_type,
            stock:this.addinventory.stock,
            treatment:this.addinventory.treatment,
            // stock_count_mode:this.addinventory.treatment.value,
            // warehouse_id:this.addinventory.stock.id
        }
        this.service.getInventorytypeImport(flag,warehouse_id).then(res=>{ 
              this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
              this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(addinventory));
              this.cache.save(CACHE_KEY.TEMPLATE_NAME,JSON.stringify(templateName))
              this.$router.push({name:'LibraryDetails',query:{types:types.toString()}});
          },err=>{
              this.$toasted.show(err.message)
          })
        }   
     }
     /**
      * 模板导入
      */
     private templateimport(){ 
       if(this.addinventory){
         let addinventory = {};
         const warehouse_id = this.addinventory.stock;
         for(let i=0;i<this.LibraryField.length;i++){
            let item = this.LibraryField[i];
            if(!this.addinventory[item.id]||this.addinventory[item.id]==""){
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
             }
         }
        addinventory = {
            name:this.addinventory.name,
            bill_type:this.addinventory.bill_type,
            stock:this.addinventory.stock,
            treatment:this.addinventory.treatment,
            // stock_count_mode:this.addinventory.treatment.value,
            // warehouse_id:this.addinventory.stock.id
        }
        this.service.getTemplateImport(warehouse_id).then(res=>{
              this.cache.save(CACHE_KEY.TEMPLATEIMPORT,JSON.stringify(res.data.data));
              this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(addinventory));
              this.$router.push({name:'SelecttheTemplate'});
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
@background-color:#fff;
@border-radius:3px;
.title-select-name .ezt-select {
    max-width: 80%;
}
select{
  color: #888;
}
.demo3-slot{
  text-align: center;
  padding: 8px 0;
  color: #888;
}
.addinventorylist{
      background-color: #F1F6FF;
    .content{
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


