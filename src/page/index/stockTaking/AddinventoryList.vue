<!--新增盘库单-->
<template>
 <div>
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
              <x-input title='盘点类型' text-align="right" disabled  v-model="value3">{{value3}}</x-input>
            </group>    
          </div>
          <div class="warehouse">
              <ul>
                 <li class="select-list">
                  <span class="title-search-name ">仓库：</span>
                  <span class="title-select-name item-select">
                    <select name="" id="" placeholder="请选择" class="ezt-select">
                      <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                      <option :value="item.type" :key="index" v-for="(item,index) in warehouseType">{{item.name}}</option>
                    </select>
                  </span>
                </li>
                 <li class="select-list">
                  <span class="title-search-name ">未盘处理：</span>
                  <span class="title-select-name item-select">
                    <select name="" id="" placeholder="请选择" class="ezt-select">
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
 </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import IUser from "../../../interface/IUserModel"
import LoginService from "../../../service/LoginService"
import commonService from '../../../service/commonService.js';
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       "user":"user"
     }) 
   },
   methods:{ 
     ...mapActions({
       
     })

   }   
})  
export default class addinventorylist extends Vue{
    private service:LoginService;
    private user:IUser;
    private value3:string = '日盘';
    private warehouseType:any[] = [{
      name:"仓库A",
      type:"q"
    },{
      name:"仓库B",
      type:"m"
    }];
    private orderType:any[] = [{
      name:"按照当前库存量处理",
      type:"q"
    },{
      name:"按照0库存量处理",
      type:"m"
    }];
    created() {
       this.service = LoginService.getInstance();  
    }

    mounted(){
      

    }

    @Watch("list",{
      deep:true
    })
    private listWatch(newValue:any[],oldValue:any[]){

    }
    private goBack(){
      this.$router.back();
    }
    // 手工制单
    manualproduction(info:string){
        this.$router.push(info)
    }
    //盘点类型导入
     private inventorytype(info:string){
        this.$router.push(info)
     }
    //模板导入
     private templateimport(info:string){
        this.$router.push(info)
     }
      
      
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
.demo3-slot{
  text-align: center;
  padding: 8px 0;
  color: #888;
}
.addinventorylist{
    position: absolute;
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


