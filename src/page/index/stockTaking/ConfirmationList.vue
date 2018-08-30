<!--确认盘点单-->
<template>
<div class="ezt-page-con confirmationlist">
    <ezt-header :back="true" title="确认盘点单">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">   
      <div class="content">
          <div class="list">
            <div class="details">
             <ul>
               <div><li>盘点日期：<span>2017-07-11</span></li><li>盘点方式：<span>模板导入</span></li></div>
               <div><li>盘点类型：<span>日盘</span></li></div>
               <div><li>未盘处理：<span>按当前库存量处理</span></li></div>
               <div><li>盘点仓库：<span>CN00707-果蔬库房A</span></li></div>
             </ul>
           </div>
           <div class="checklist">
              <p class="title">盘点单</p>
              <ul>
                <li>
                  <div><p>非象美乐干红葡萄酒<span>编码：<em>112352345</em></span></p></div>
                  <div><p>规格：<span>10个/袋</span></p><p>账面数量：<span>1233</span></p></div>
                  <div><p>理论库存：<span>10</span></p><p>理论消耗：<span>1233</span></p></div>
                </li>
                 <li>
                  <div><p>非象美乐干红葡萄酒<span>编码：<em>112352345</em></span></p></div>
                  <div><p>规格：<span>10个/袋</span></p><p>账面数量：<span>1233</span></p></div>
                  <div><p>理论库存：<span>10</span></p><p>理论消耗：<span>1233</span></p></div>
                </li>
                <li>
                  <div><p>非象美乐干红葡萄酒<span>编码：<em>112352345</em></span></p></div>
                  <div><p>规格：<span>10个/袋</span></p><p>账面数量：<span>1233</span></p></div>
                  <div><p>理论库存：<span>10</span></p><p>理论消耗：<span>1233</span></p></div>
                </li>
                <li>
                  <div><p>非象美乐干红葡萄酒<span>编码：<em>112352345</em></span></p></div>
                  <div><p>规格：<span>10个/袋</span></p><p>账面数量：<span>1233</span></p></div>
                  <div><p>理论库存：<span>10</span></p><p>理论消耗：<span>1233</span></p></div>
                </li>
                <li>
                  <div><p>非象美乐干红葡萄酒<span>编码：<em>112352345</em></span></p></div>
                  <div><p>规格：<span>10个/袋</span></p><p>账面数量：<span>1233</span></p></div>
                  <div><p>理论库存：<span>10</span></p><p>理论消耗：<span>1233</span></p></div>
                </li>
              </ul>
           </div>
          </div>
          <ezt-footer>
            <div class="temporary" slot="confirm">
              <div class="total">货品数量合计：<span>27182</span></div>
              <div class="button">
                <div class="storage">暂存</div><div class="sub">提交</div>
              </div>
            </div>  
        </ezt-footer>
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
import LibraryDetailService from '../../../service/LibraryDetailService'
declare var mobiscroll:any;
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
       'inventoryDetails':'libraryDetails/inventoryDetails'
     }) 
   },
   methods:{ 
     ...mapActions({
       'getInventoryDetails':'libraryDetails/getInventoryDetails'
     })

   }   
})  
export default class stockTaking extends Vue{
    private pager:Pager;   
    private service: LibraryDetailService;
    private list:any[] = [];
    private inventoryDetails:any[];
    private getInventoryDetails:INoopPromise;
    
    
    created() {
      
    }

    mounted(){
      this.getInventoryDetails();
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

  
      
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
.confirmationlist{
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
      overflow: scroll;
      .list{
        background-color:@background-color;
        width: 95%;
        .details{
        padding: 15px 0 30px 0;
        border-radius: @border-radius;
        ul{
          div{ 
            display: flex;
            justify-content: space-between;
            line-height: 25px;
            padding: 0 10px;
            li{
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
      .checklist{
        background-color: #F1F6FF;
        display: flex;
        align-items: center;
        flex-direction: column;
        .title{
          margin-top: 5px;
          font-size: 12px;
          color: #95A7BA;
          padding: 0 14px;
        }
        ul{
           display: flex;
           line-height: 30px;
           margin-top: 5px;
           flex-direction: column;
           width: 100%;
           li{
              display: flex;
              flex-direction: column;
              margin-bottom: 10px;
              border-radius: @border-radius;
              background-color: @background-color;
              line-height: 25px;
              padding: 10px 0 10px 0;
               div{
                  text-align: left;
                  display: flex;
                  justify-content: space-between;
                   p{
                    font-size: 12px;
                    color: #5F7B9A;
                    padding: 0 10px;
                  span{
                    font-size: 13px;
                    color: #395778; 
                  }
                }
              }
              div:first-child{
                p{
                  font-size: 15px;
                  color: #395778 !important;
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
    }
      .temporary{
        width: 104%;
        height: 76px;
        background: #FFF8DD;
        position: absolute;
        bottom: 0;
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
          display: flex;
          flex-direction: row;
          height: 50px;
          line-height: 50px;
          justify-content: space-around;
          font-size: 15px;
          color: #FFFFFF; 
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


