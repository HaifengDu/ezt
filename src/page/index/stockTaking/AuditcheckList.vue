<!--审核盘点单-->
<template>
<div class="ezt-page-con auditchecklist">
    <ezt-header :back="true" title="审核盘点单" @goBack="goBack">
       <div slot="action">
          <span></span>
       </div>        
    </ezt-header>    
    <div class="ezt-main">       
        <div class="content">
            <div class="pkdetails">
              <div class="librarytype">
                <ul>
                  <li>
                      <div><p>盘点仓库：<span>CN00707-果蔬库房A</span></p></div>
                      <div><p>盘点日期：<span>2017-07-11</span></p></div>
                      <div><p>盘库方式：<span>模板导入</span></p></div>
                      <div><p>盘点类型：<span>日盘</span></p></div>
                      <div><p>未盘处理：<span>按当前库存量处理</span></p></div>
                  </li>
                </ul>
              </div>
              <div class="inventory">
                <div class="pkmx">
                      <div class="line">
                          <div class="title">盘库明细</div>
                      </div>
                  </div>
                  <ul>
                    <li :key="index" v-for="(item,index) in inventoryDetails">
                      <p class="name">{{item.name}}</p>
                       <div><p>编码：<span>{{item.guige}}</span></p><p>规格：<span>{{item.zmje}}</span></p></div>
                      <div><p>账面数量：<span>{{item.guige}}</span></p><p>理论库存：<span>{{item.zmje}}</span></p></div>
                      <div><p>理论消耗：<span>{{item.llkc}}</span></p><p>采购单位<span>{{item.llxh}}</span></p></div>
                      <div><p>库存主单位：<span>{{item.zxsl}}</span></p><p>消耗单位：<span>{{item.szsl}}</span></p></div>
                    </li>
                  </ul>
              </div>
          </div>
           <div class="temporary" slot="confirm">
             <div class="total">数量：<span>27182</span></div>
             <div class="button">
               <div class="storage">审核不通过</div><div class="sub" @click="sub">审核通过</div>
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
import LibraryDetailService from '../../../service/LibraryDetailService'
@Component({  
   components:{  
      
   },   
   computed:{
     ...mapGetters({
      //  'inventoryDetails':'libraryDetails/inventoryDetails'
     }) 
   },
   methods:{ 
     ...mapActions({
      //  'getInventoryDetails':'libraryDetails/getInventoryDetails'
     })

   }   
})  
export default class auditchecklist extends Vue{
    private service: LibraryDetailService;
    private list:any[] = [];
    private inventoryDetails:any[];
    private getInventoryDetails:INoopPromise;
    
    
    created() {
      
    }

    mounted(){
      this.getInventoryDetails();
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
@background:linear-gradient(139deg, #018BFF -2%, #4A39F3 28%);
.auditchecklist{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    width: @width;
    height: @height;
    .content{
      width: @width;
      height:@height;
      position: absolute;
      display: flex;
      align-items: center;
      flex-direction: column;
      .pkdetails{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border-radius: 4px;
        width: 97%;
        background-color:@background-color;
        padding-bottom: 70px; 
        height: 100%;     
        .librarytype{
          ul{
            text-align: left;
            padding: 10px 0 10px 15px;
            li{
              width:@width;
              div{
                height: 25px;
                line-height: 25px;
                p{
                  width: @width;
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
        }
        .inventory{
           .pkmx{
              .line{
                text-align: center;
                .title{
                  width: 100%;
                  font-size: 12px;
                  color: #95A7BA;
                }
              }
            }
            ul{
            text-align: left;
            background-color: @background-color;
            padding: 10px 10px 10px 15px;
              li{
                width:@width;
                padding-bottom: 10px;
                margin-bottom: 10px;
                border-bottom: 1px solid #DDECFD;
                .name{
                  font-size: 15px;
                  color: #395778;
                  margin-bottom: 10px;
                  }
              div{
                display: flex;
                height: 25px;
                line-height: 25px;
                p{
                  width: @width;
                  font-size: 12px;
                  color: #5F7B9A;
                  span{
                    font-size: 13px;
                    color: #395778;
                  }
                }
              }
            }
            li:last-child{
              border-bottom: none;
            }
         }
        }
      }
      .temporary{
        width: 103%;
        height: 76px;
        background: #FFF8DD;
        position: fixed;
        bottom: -1px;
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


