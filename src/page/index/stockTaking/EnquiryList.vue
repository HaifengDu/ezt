<!--查询盘库单-->
<template>
 <div>
   <div class="ezt-page-con enquirylist">
    <ezt-header :back="true" title="查询盘库单">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">   
       <div class="content">
          <div class="warehouse">
             <ul>
               <li><p>单据号</p><p></p></li>
               <li><p>盘点库</p><p><span>CN01686-消耗库B</span><i></i></p></li>
               <li><p>开始日期</p><p><span></span><i></i></p></li>
               <li><p>结束日期</p><p><span></span><i></i></p></li>
             </ul>
          </div>
          <p class="s_btn1">查询</p>
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
import '../../../assets/css/style.less'
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
    created() {
      
    }

    mounted(){
      

    }

  /**
   * watch demo
   */
    @Watch("",{
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
.enquirylist{
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
     .warehouse{
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
     .s_btn1{
         margin-top: 20px;
         width: 95%;
         height: 45px;
         color: #fff;
         line-height: 45px;
     }
   }
}
</style>


