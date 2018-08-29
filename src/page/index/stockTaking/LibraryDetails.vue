<!--盘库详情-->
<template>
<div class="ezt-page-con librarydetails">
    <ezt-header :back="true" title="盘库详情">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">       
        <div class="pkdetails">
             <div class="librarytype">
               <ul>
                 <li><p>盘点仓库：<span>CN00707-果蔬库房A</span></p></li>
                 <li><p>盘点日期：<span>2017-07-11</span></p></li>
                 <li><p>盘库方式：<span>模板导入</span></p></li>
                 <li><p>盘点类型：<span>日盘</span></p></li>
                 <li><p>未盘处理：<span>按当前库存量处理</span></p></li>
               </ul>
             </div>
             <div class="inventory">
                <div class="line">
                    <span class="text">盘库明细</span>
                </div>
                <ul>
                  <li><p>咸鸭蛋</p><span>编码：<em>112352345</em></span></li>
                  <li><p>规格：<span>10个/袋</span></p><p>账面数量：<span>1728</span></p></li>
                  <li><p>理论库存：<span>12</span></p><p>理论消耗：<span>233</span></p></li>
                  <li><p>整箱数量：<span>12</span></p><p>散装数量：<span>233</span></p></li>
                </ul>
             </div>
        </div>
    </div>    
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager';
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../../helper/methods';
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
    private list:any[] = [];
    
    created() {
      //  this.pager = new Pager()
      //  this.service = StockTakingService.getInstance();
      //  this.getPsList();
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
    private get Total(){
      return this.list.reduce((ori,item)=>{
        return ori.uprice+item;
      },0);
    }

    // private getPsList(){
    //     this.service.getPsList(this.pager.getPage()).then(res=>{
    //        this.list = res.data.data;
    //        this.pager.setNext();
    //     },err=>{
    //         this.$toasted.show(err.message);
    //     });

    //     this.pager.setLimit(20);
    // }
      
}
</script>

<style lang="less" scoped> 
@background:linear-gradient(139deg, #018BFF -2%, #4A39F3 28%);;
.librarydetails{
    position: relative;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 900px;
    background: @background;
    .pkdetails{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: @background;
      .librarytype{
          width: 100%;
          background-color: #fff;
          ul{
           
            li{
               width: 100%;
               height: 30px;
               line-height: 30px;
               p{
                 width: 100%;
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
      .inventory{
           .line{
              height: 1px; 
              margin-top: 40px;
              text-align: center; 
              border-top: 1px solid #e2e2e2;
          }
          .text{ 
              position: relative;
              
              display: inline-block;
          }
      }
    }
}
</style>


