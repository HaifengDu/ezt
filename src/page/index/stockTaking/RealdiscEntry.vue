<!--实盘录入-->
<template>
<div class="ezt-page-con realdiscentry">
    <ezt-header :back="true" title="实盘录入" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">       
        <div class="content">
          <div class="list">
           <div class="checklist">
              <ul>
                <li :key="index" v-for="(item,index) in inventoryDetails">
                  <div class="title"><p>擦擦擦<span>编码：<em>112352345</em></span></p></div>
                  <div><p>规格：<span>10个/袋</span></p><p>账面数量：<span>1233</span></p></div>
                  <div><p>理论库存：<span>10</span></p><p>理论消耗：<span>1233</span></p></div>
                  <div class="purchase">
                      <div><p>采购单位：<span><input value="22" type="number">箱</span></p><p>库存主单位：<span><input type="number" value="22">斤</span></p></div>
                      <div><p>消耗单位：<span><input value="11" type="number">只</span></p></div>
                  </div>
                </li>
              </ul>
           </div>
          </div>
          <div class="temporary" slot="confirm">
            <div class="total">货品数量合计：<span>27182</span></div>
            <div class="button">
              <div class="storage">暂存</div><div class="sub" @click="sub">提交</div>
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
export default class stockTaking extends Vue{
    private pager:Pager;   
    private list:any[] = [];
    private inventoryDetails:any[];
    
    
    created() {
      
    }

    mounted(){
    }

    private goBack(){
      this.$router.back();
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
      private sub(){
        this.$router.push('/')
      }

  
      
}
</script>
<style lang="less" scoped> 
@width:100%;
@height:100%;
@background-color:#fff;
@border-radius:3px;
.realdiscentry{
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
      position: relative;
      .list{
        width: 95%;
        padding-bottom: 70px;
      .checklist{
        display: flex;
        align-items: center;
        flex-direction: column;
        ul{
           width: @width;
           display: flex;
           line-height: 30px;
           margin-top: 10px;
           flex-direction: column;
           li{
              display: flex;
              flex-direction: column;
              line-height: 25px;
              background-color:@background-color;
              margin-bottom: 10px;
               border-radius: @border-radius;
               div{
                  text-align: left;
                  display: flex;
                  justify-content: space-between;
                  padding: 0 10px;
                   p{
                    font-size: 12px;
                    color: #5F7B9A;
                  span{
                    font-size: 13px;
                    color: #395778; 
                  }
                }
              }
              .purchase{
                flex-direction: column;
                margin-top: 10px;
                padding-top: 10px;
                box-shadow: 0 0 10px 0 rgba(71,66,227,0.07);
                div{
                    margin-bottom: 10px;
                    border-bottom: 1px solid #D2DFEE; 
                    padding:0 0 10px 0;
                    
                  p{
                    font-size: 13px;
                    color: #395778; 
                    width: 46%;
                    border-right: 1px solid #D2DFEE;
                  }
                  p:last-child{
                    border-right: none;
                  }
                  input{
                    width: 50px;
                  }
                }
                div:last-child{
                   border-bottom:none;
                   margin-bottom:0;
                    p{
                    border-right:none; 
                  }
                }
              }
              .title{
                padding-top: 10px;
                p{
                  font-size: 15px;
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
        width: 102%;
        height: 76px;
        background: #FFF8DD;
        position: fixed;
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


