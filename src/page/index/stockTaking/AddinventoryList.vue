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
                    @change="handlerStock" :class="[{'selectError':errStock}]">
                      <option :value="type" :key="index" v-for="(type,index) in warehouseType">{{type.text}}</option>
                    </select> 
                  </span>   
                </li>   
                 <li class="select-list">
                  <span class="title-search-name is-required">未盘处理：</span>
                  <span class="title-select-name item-select">
                    <select placeholder="请选择未盘处理方式" class="ezt-select"  v-model="addinventory.treatment"
                    @change="handlerTreatment" :class="[{'selectError':errTreatment}]">
                      <option :value="item" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
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
                <li @click="inventorytype(pageType.盘点类型导入)">盘点类型导入</li>
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
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
import { PageType } from "../../../enum/EPageType";
@Component({  
   components:{  

   },   
   computed:{  
     ...mapGetters({
       "user":"user",
       'addinventory':'stockTaking/addinventory',//新增盘库单数据
       'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
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
    private errTreatment:boolean = false;//必填项仓库 error样式
    private errStock: boolean = false;//必填项仓库 error样式
    private service:StockTakingService;
    private name:any;
    private bill_type:string; //弹层盘点类型
    private pageType = PageType; //页面类型
    private warehouseType:any[] = [];  //动态加载仓库
    private isSave:boolean = false;//确认不保存
    private addinventory:any;//store中
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
    created() {
       this.service = StockTakingService.getInstance();
       this.addinventory.name = this.$route.query.name
       this.addinventory.bill_type =  this.$route.query.bill_type
       //选择仓库
       this.getWarehouseType();
      (this.selectedGood||[]).forEach(item=>item.active = false);
      if(this.cache.getData(CACHE_KEY.ORDER_ADDINFO)){
          this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ORDER_ADDINFO));
      }
      if(this.cache.getData(CACHE_KEY.ORDER_ADDBEFOREINFO)){
          this.addBeforeBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ORDER_ADDBEFOREINFO));
      }
    }
    mounted(){   
       

    }   
    /**
     * 返回上一页 
     */   
    private goBack(){
      if((this.addinventory&&this.addinventory.stock)||this.addinventory.length>0){
         this.isSave=true;
      }else{
         this.$router.push('/stocktaking');
      }
    }
    private onConfirm(){//确认离开，清空store中的物料和单据信息
      this.$router.push('/stocktaking');
    }
        
    /**
     * 手工制单
     */
      manualproduction(newType:any){
          if(this.addinventory){
          if(!this.addinventory.stock){
              this.errStock = true;
              this.$toasted.show("请选择仓库！");
              return false;
          }
          if(!this.addinventory.treatment){
              this.errTreatment = true;
              this.$toasted.show("请选择未盘处理方式！");
              return false;
          }
          this.$router.push({
              name:'PublicAddGood',
              query:{
                newType:newType
              }
          })
          this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(this.addBillInfo));
          this.cache.save(CACHE_KEY.ORDER_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
          }
      }
     /**
      * 盘点类型导入
      */
     private inventorytype(types:PageType){
        if(this.addinventory){
         if(!this.addinventory.stock){
            this.$toasted.show("请选择仓库！");
            return false;
         }  
         if(!this.addinventory.treatment){
            this.$toasted.show("请选择未盘处理方式！");
            return false; 
         } 
        const flag = this.addinventory.bill_type;
        const warehouse_id = this.addinventory.stock.id;
        this.service.getInventorytypeImport(flag,warehouse_id).then(res=>{ 
             this.$router.push({
                name:'LibraryDetails',
                 query:{
                    types:types.toString(),
                }
              });
              this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
              this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(this.addinventory));
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
         if(!this.addinventory.stock){
            this.$toasted.show("请选择仓库！");
            return false;
         }
         if(!this.addinventory.treatment){
            this.$toasted.show("请选择未盘处理方式！");
            return false;
         }
        const warehouse_id = this.addinventory.stock.id;
        this.service.getTemplateImport(warehouse_id).then(res=>{
              this.$router.push({
                name:'SelecttheTemplate',
              });
              this.cache.save(CACHE_KEY.TEMPLATEIMPORT,JSON.stringify(res.data.data));
              this.cache.save(CACHE_KEY.ADDINVENTORY,JSON.stringify(this.addinventory));
          },err=>{
              this.$toasted.show(err.message)
          })
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
     * 选择完仓库
     */
    private handlerStock(){
      this.errStock = false;
    }
    /**
     * 选择完未盘处理
     */
    private handlerTreatment(){
      this.errTreatment = false;
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


