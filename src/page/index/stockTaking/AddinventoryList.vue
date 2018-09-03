<!--新增盘库单-->
<template>
 <div>
   <div class="ezt-page-con addinventorylist">
    <ezt-header :back="true" title="新增盘库单">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">   
       <div class="content">
          <div class="store">
            <group>
              <x-input title='门店名称' text-align="right" disabled  v-model="disabledValue">{{disabledValue}}</x-input>
              <x-input title='盘点日期' text-align="right" disabled  v-model="value2">{{value2}}</x-input>
              <x-input title='盘点类型' text-align="right" disabled  v-model="value3">{{value3}}</x-input>
            </group>
          </div>
          <div class="warehouse">
              <group>
                <popup-radio title="仓库" :options="options3" v-model="option3">
                    <p slot="popup-header" class="vux-1px-b demo3-slot">请选择仓库</p>
                </popup-radio>
                <popup-radio title="未盘处理" :options="options4" v-model="option4">
                    <p slot="popup-header" class="vux-1px-b demo3-slot">请选择未盘处理方式</p>
                </popup-radio>
               </group>
          </div>
          <div class="method">
              <p>盘点方式</p>
              <ul>
                <li>手工制单</li>
                <li>模板导入</li>
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
import Pager from '../../../common/Pager'
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       
     }) 
   },
   methods:{ 
     ...mapActions({
       
     })

   }   
})  
export default class addinventorylist extends Vue{
    private pager:Pager;   
    private disabledValue:string = '黄焖鸡';
    private value2:string = '2018-08-29';
    private value3:string = '日盘';
    private option3:string = '仓库A';
    private options3:any[] =['仓库A', '仓库B', '仓库C'];
    private option4:string = '按照当前库存量处理';
    private options4:any[] =['按照当前库存量处理', '按照0库存量处理',];
    // private pdmethod:any[] = [{name:'手工制单'},{name:'模板导入'},{name:'盘点类型导入'}];
    created() {
      
    }

    mounted(){
      

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
    // 盘点类型导入
     private inventorytype(info:string){
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


