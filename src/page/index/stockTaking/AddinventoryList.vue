<!--新增盘库单-->
<template>
 <div>
  <!-- 新增盘点类型 -->
   <div> 
      <x-dialog v-model="newlyadded" class="dialog">
        <div class="newlytype">
           <div class="title" @click="close">
              <p>请选择盘点类型</p>
              <span class="close" @click="newlyadded=false"><i class="fa fa-times" aria-hidden="true"></i></span>
            </div>
            <ul>
              <li @click="datasorting"><i></i>数据整理</li>
              <li :key="index" v-for="(inventory,index) in inventoryType" @click="list(inventory)"><i></i>{{inventory.name}}</li>
            </ul>
        </div>
      </x-dialog>
  </div>
  <!-- 新增盘点单 -->
   <div class="ezt-page-con addinventorylist" v-if="addlist">
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
              <x-input title='盘点类型' text-align="right" disabled v-model="type.name">{{type.name}}</x-input>
            </group>       
          </div> 
          <div class="warehouse">
              <ul>
                 <li class="select-list">
                  <span class="title-search-name ">仓库：</span>
                  <span class="title-select-name item-select">
                    <select name="" id="" placeholder="请选择" class="ezt-select"  @click="iswarehouseType(type)" v-model="addinventory.stock">
                      <option value="" style="display:none;" disabled="disabled" selected="selected">请选择仓库</option>
                      <option :value="type.text" :key="index" v-for="(type,index) in warehouseType">{{type.text}}</option>
                    </select>   
                  </span>   
                </li>
                 <li class="select-list">
                  <span class="title-search-name ">未盘处理：</span>
                  <span class="title-select-name item-select">
                    <select name="" id="" placeholder="请选择" class="ezt-select"  v-model="addinventory.treatment">
                      <option value="" style="display:none;" disabled="disabled" selected="selected">请选择未盘处理方式</option>
                      <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                    </select>
                  </span>
                </li>
              </ul>
          </div>
          <div class="method">
              <p>盘点方式</p>
              <ul>
                <li @click="manualproduction('/selectinginventory')">手工制单</li>
                <li @click="templateimport('/selectthetemplate')">模板导入</li>
                <li @click="inventorytype('/confirmationlist')">盘点类型导入</li>
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
@Component({  
   components:{    
      
   },   
   computed:{  
     ...mapGetters({
       "user":"user",
       'addInventory':'stockTaking/addInventory',//新增盘库单数据
     }) 
   },
   methods:{ 
     ...mapActions({
       'setAddinventory':"stockTaking/setAddinventory",
     })

   }   
})  
export default class stockTaking extends Vue{
    private user:IUser;
    private service:StockTakingService;
    private type:string; //盘点类型数据
    private bill_type:string; //弹层盘点类型
    private daily_inventory:string;
    private week_inventory:string;
    private period_inventory:string;
    private getDataSorting:INoopPromise  //获取数据整理
    private getInventoryType:INoopPromise  //获取盘点类型
    private inventoryType:any[] = [];//盘点类型
    private warehouseType:any[] = [];  //动态加载仓库
    private isSave:boolean = false;//确认不保存
    private addlist:boolean = false; //新增盘点页面显示隐藏
    private newlyadded:boolean = true;//默认显示弹层
    private addinventory:any = {};//store中
    private setAddinventory:INoopPromise//store中给setAddinventory赋值
    private orderType:any[] = [{
      name:"按照当前库存量处理",
      type:"q"
    },{
      name:"按照0库存量处理",
      type:"m"
    }];
    

    created() {
        this.inventoryType.push({  
          name:"日盘",
          bill_type:'daily_inventory'
        });
        this.inventoryType.push({
          name:"周盘",
          bill_type:'week_inventory'
        });
        this.inventoryType.push({
          name:"月盘",
          bill_type:'period_inventory'
        });
       this.service = StockTakingService.getInstance();
    }

    mounted(){
     

    }
   
    @Watch("list",{
      deep:true
    })
    private listWatch(newValue:any[],oldValue:any[]){

    }
    private close(){
      this.$router.push('/stocktaking');
    }
    private goBack(){
      if(this.addinventory.stock){
        this.isSave=true;
      }else{
        this.$router.push('/stocktaking');
      }
    }
    private onConfirm(){//确认离开，清空store中的物料和单据信息
      this.setAddinventory({}),
      this.$router.push('/stocktaking');
    }
     // 数据整理  
    private datasorting(){
      this.service.getDataSorting().then(res=>{  
         console.log("数据整理")
      },err=>{
          this.$toasted.show(err.message)
          this.newlyadded = false
          this.$router.push('/stocktaking');
      })
    }
    //获取盘点类型
    private list(inventory:any){
      this.service.getInventoryType(inventory).then(res=>{ 
         this.type = res.data.data[0].bill_type
         this.newlyadded = false
         this.addlist = true
         //this.setAddinventory({})
      },err=>{
          this.$toasted.show(err.message)
      })
    }
   
    // 手工制单
    manualproduction(info:string){
       if(this.addinventory){
         if(!this.addinventory.stock){
            this.$toasted.show("请选择仓库！");
            return false;
         }
        this.setAddinventory(this.addinventory);
        this.$router.push(info);
       }
    }
    //盘点类型导入
     private inventorytype(info:string){
        this.$router.push(info)
     }
    //模板导入
     private templateimport(info:string){
        this.$router.push(info)
        
     }
    //  动态加载仓库
    private iswarehouseType(type:any){
      this.service.getWarehouse(this.type['bill_type']).then(res=>{ 
          this.warehouseType = res.data.data;
      },err=>{
          this.$toasted.show(err.message)
      })
    }

    // 仓库切换
    private handlerwarehouseType(){

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

// 新增盘点单
.dialog {
    height: 350px;
    .newlytype{
       display: flex;
       flex-direction: column;
       align-items: center;
       .title{
         margin-top: 10px;
         font-size: 13px;
         color: #95A7BA;
       }
      .close {
        margin-top: 8px;
        margin-bottom: 8px;
        width: 30px;
        height: 30px;
        display: block;
        right: 5px;
        position: absolute;
        z-index: 9999;
        top: -5px;
        font-size: 20px;
      }
      ul{
        width: 90%;
        margin-top: 10px;
        li{
          border-bottom: 1px dashed #C1CFDE;
          height: 59px;
          line-height: 59px;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          color: #395778;
          i{
            width: 30px;
            height: 30px;
            display: block;
            float: left;
            margin: 17px 10px 0 0;
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }
        li:nth-child(1) i{
            background-image: url("../../../assets/images/inventory_ico_data.png")
        }
        li:nth-child(2) i{
            background-image: url("../../../assets/images/intentory_ico_day.png")
        }
        li:nth-child(3) i{
            background-image: url("../../../assets/images/intentory_ico_week.png")
        }
        li:nth-child(4) i{
            background-image: url("../../../assets/images/intentory_ico_month.png")
        }
        li:last-child{
          border-bottom:none;
        }
      }
    }    
}
</style>


