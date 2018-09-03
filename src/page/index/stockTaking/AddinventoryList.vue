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
              <ul>
                <li><p>门店名称</p><p>黄焖鸡</p></li>
                <li><p>盘点日期</p><p>2018-08-29</p></li>
                <li><p>盘点类型</p><p>日盘</p></li>
              </ul>
          </div>
          <div class="warehouse">
             <ul>
               <li><p>仓库</p><p><span>CN01686-消耗库B</span><i></i></p></li>
               <li><p>未盘处理</p><p><span>按照当前库存量处理</span><i></i></p></li>
             </ul>
          </div>
          <div class="method">
              <p>盘点方式</p>
              <ul>
                <li :key="index" v-for="(item,index) in pdmethod">{{item.name}}</li>
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
declare var mobiscroll:any;
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
export default class stockTaking extends Vue{
    private pager:Pager;   
    private pdmethod:any[] = [{name:'手工制单'},{name:'模板导入'},{name:'盘点类型导入'}];
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
      private 11(){
       
      }

  
      
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
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
          width: @width;
          display: flex;
          background-color:@background-color;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
          ul{
            width: 95%;
          li{
            height: 45px;
            line-height: 45px;
            border-bottom: 1px solid #E0EBF9;
            display: flex;
            justify-content: space-between;
          }
          li p:nth-child(1){
            font-size: 13px;
            color: #5F7B9A;
          }
          li p:nth-child(2){
            padding-right: 15px;
            font-size: 16px;
            color: #395778;
          }
          li:last-child{
            border-bottom: none;
          }
        }
        i{
          display: block;
          width: 16px;
          height: 15px;
          float: right;
          background-size: 100% 100%;
          margin: 15px 0 0 5px;
          background-position: center;
          background-image:url('../../../assets/images/icon-trunxia.png');
        }
     }
     .warehouse ul li{
       cursor: pointer;
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


