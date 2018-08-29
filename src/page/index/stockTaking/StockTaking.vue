<!--盘库模块-->
<template>
<div>
   <div class="ezt-page-con stocktaking">
    <ezt-header :back="true" title="盘库">
       <div slot="action">
           <div class="add">
             <i class="fa fa-plus" aria-hidden="true"></i>
             <i class="fa fa-search" aria-hidden="true"></i>
           </div>
       </div>        
    </ezt-header>    
    <div class="ezt-main ezt-pk">       
            <tab :line-width=2 active-color='#fc378c' v-model="index">
              <tab-item class="vux-center" :selected="item.active" v-for="(item, index) in tabList" @click="tabClick(index)" :key="index">{{item.name}}</tab-item>
            </tab>
            <swiper v-model="index" height="100px" :show-dots="false">
              <swiper-item v-for="(item, index) in tabList" :key="index">
                <div class="tab-swiper vux-center">
                       <ul class="submitted">
                          <li :key="index" v-for="(item,index) in inventoryList" @click="librarydetails">
                            <div class="state">
                                <span><i>{{item.week}}</i>{{item.name}}</span>
                                <span>{{item.state}}</span>
                            </div>
                            <div class="content">
                                <p>盘点仓库：<span>{{item.cangku}}</span></p>
                                <p>盘点日期：<span>{{item.date}}</span></p>
                                <p>生成损溢：<span>{{item.sunyi}}</span></p>
                                <p>未盘处理：<span>{{item.wpcl}}</span></p>
                            </div>
                            <div class="footer">
                                <P>业务日期：<span>{{item.ywrq}}</span></P>
                                <div class="submit">实盘录入</div>
                            </div>
                          </li>
                        </ul>
                  </div>
              </swiper-item>
          </swiper>
      </div>    
  </div>
  <!-- 盘库详情 -->
  <div>
    <router-view/>
  </div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import {TabItem} from 'vux'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import StockTakingService from '../../../service/StockTakingService'
import Pager from '../../../common/Pager';
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../../helper/methods';
import librarydetails from './LibraryDetails';
import { TabList } from '../../../common/ITab';
declare var mobiscroll:any;
@Component({
   components:{  
      TabItem,
      
   },   
   computed:{
     ...mapGetters({
       'inventoryList':'stockTaking/inventoryList'
     }) 
   },
   
   methods:{
     ...mapActions({
       'getInventoryList':'stockTaking/getInventoryList'
     }),
     librarydetails(){
       this.$router.push({name:'LibraryDetails',query:{},params:{}})
       
     }
   }   
})
export default class stockTaking extends Vue{
    private selected:String = 'all';
    private service: StockTakingService;
    private pager:Pager;   
    private getInventoryList:INoopPromise
    private list:any[] = [];
    private inventoryList:any[];
    private index = 0;
    private tabList:TabList = new TabList();
    created() {
      this.tabList.push({
        name:"待提交",
        status:1,
        active:true
      });    
      this.tabList.push({
        name:"待/已生效",
        status:2,
        active:false
      });
      this.tabList.push({
        name:"待审核",
        status:3,
        active:false
      });
      this.tabList.push({
        name:"审核失败",
        status:3,
        active:false
      });
    }
    tabClick(index:number){
      alert("kknkhj")
        this.tabList.setActive(index);
        
    }
    mounted(){
      this.getInventoryList();
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
@padding: 5px 6px;
.stocktaking{
    .add{   
      font-size: 20px;
      i{
        margin-right: 10px;
      }
    }
    .mint-tab-item.is-selected{
      border-bottom:none;
      .all,.shengxiao,.shenhe,.shenheshibai{
        padding: @padding;
      }
      .all{
        color: #AF4DFF;
        border-bottom: 2px solid #AF4DFF;
      }
      .shengxiao{
        color: #54B0FF;
        border-bottom: 2px solid #54B0FF;
      }
      .shenhe{
        color: #FFA74D;
        border-bottom: 2px solid #FFA74D;
      }
      .shenheshibai{
        color: #FF7562;
        border-bottom: 2px solid #FF7562;
      }
      .mint-navbar .mint-tab-item.is-selected{
        border:none;
      }
      .mint-navbar .mint-tab-item{
        padding: 7px 0;
      }
     
    }
    //待提交
    .submitted{
        width: 95%;
        display: flex;
        margin: 10px auto;  
        flex-direction: column;
        li{
          width: 100%;
          margin-bottom: 10px;
          border: 1px solid #DDECFD;
          box-shadow: 0 0 20px 0 rgba(71,66,227,0.07);
          border-radius: 6px;
          background-color: #fff;
          .state{
            border-bottom: 1px solid #D2DFEE;
            display: flex;
            justify-content: space-between;
            padding: 10px;
            span{
              font-size: 15px;
              color: #395778;
              i{
                opacity: 0.7;
                background: linear-gradient(-135deg, #FFBE4E 0%, #FE9E49 100%);
                border-radius: 4px;
                font-size: 4px;
                color: #fff;
                width: 16px;
                height: 16px;
                text-align: center;
                font-style: normal;
                display: block;
                float: left;
                margin-right: 5px;
              }
            }
            span:last-child{
              font-size: 12px;
              color: #3ABAFF;
            }
          }
          .content p,.footer p{
              font-size: 12px;
              color: #5F7B9A;
          }
          .content p span,.footer p span{
              font-size: 13px;
              color: #395778;
          }
          .content{
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            justify-content: start;
            border-bottom: 1px solid #D2DFEE;
            padding-left: 10px;
            p{
              line-height: 30px;
            }
          }
          .footer{
              height: 40px;
              display: flex;
              justify-content: space-between;
              line-height: 40px;
              padding: 0 10px;
              p{
                line-height: 40px;
              }
              .submit{
                height: 25px;
                line-height: 25px;
                font-size: 12px;
                color: #1188FC;
                border: 1px solid #1188FC;
                border-radius: 6px;
                margin-top: 7px;
                padding: 0 10px;
                cursor: pointer;
              }
          }
        }
    }
}
</style>


