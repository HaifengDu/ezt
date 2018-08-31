<!--盘库模块-->
<template>
<div>
   <div class="ezt-page-con stocktaking">
    <ezt-header :back="true" title="盘库">
       <div slot="action">
           <div class="addbtn">
             <i @click="add" class="fa fa-plus" aria-hidden="true"></i>
             <i @click="query" class="fa fa-search" aria-hidden="true"></i>
          </div>
       </div>        
    </ezt-header>      
    <div class="ezt-main ezt-pk">       
      <tab :line-width=2 active-color='#fc378c'>
        <tab-item class="vux-center" :selected="item.active" v-for="(item, index) in tabList.TabList" @on-item-click="tabClick(index)" :key="index">{{item.name}}</tab-item>
      </tab>   
      <div class="ezt-add-content" ref="listContainer"   v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
                <ul class="submitted">
                  <li :key="index" v-for="(item,index) in inventoryList">
                    <div @click="librarydetails('/librarydetails')">
                        <div class="state">
                        <span><i>{{item.week}}</i>{{item.name}}</span>
                        <span>暂存</span>
                        <span v-if="false">{{已生效}}</span>
                        <span v-if="false">{{待审核}}</span>
                        <span v-if="false">{{审核失败}}</span>
                      </div>
                      <div class="content">
                          <p>盘点仓库：<span>{{item.cangku}}</span></p>
                          <p>盘点日期：<span>{{item.date}}</span></p>
                          <p>生成损溢：<span>{{item.sunyi}}</span></p>
                          <p>未盘处理：<span>{{item.wpcl}}</span></p>
                      </div>
                    </div>
                    <div class="footer">
                        <P>业务日期：<span>{{item.ywrq}}</span></P>
                        <div v-if="item.status === 0 " class="submit" @click="submission('/confirmationlist')">提交</div>
                        <div v-if="item.status === 1"  class="submit" @click="realdiscentry('/realdiscentry')">实盘录入</div>
                        <div v-if="item.status === 2 " class="submit" @click="toexamine">审核</div>
                    </div>
                  </li>
                </ul>
                <span v-if="allLoaded">已全部加载</span>
          </div>
      </div>    
  </div>
  <div>   
    <router-view/>
  </div>
  <!-- 新增盘点单 -->
   <div>
      <x-dialog v-model="newlyadded" class="dialog">
        <div class="newlytype">
           <div class="title" @click="show=false">
              <p>请选择盘点类型</p>
              <span class="close" @click="newlyadded=false"><i class="fa fa-times" aria-hidden="true"></i></span>
            </div>
            <ul>
              <li :key="index" v-for="(type,index) in inventoryType"><i></i>{{type.name}}</li>
            </ul>
        </div>
      </x-dialog>
  </div>
</div>
</template>
<script lang="ts">   
import Vue from 'vue'
import {TabItem,LoadingPlugin} from 'vux'
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import StockTakingService from '../../../service/StockTakingService'
import Pager from '../../../common/Pager'
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import librarydetails from './LibraryDetails'
import confirmationlist from './ConfirmationList'
import { TabList } from '../../../common/ITab'
import {maskMixin} from "../../../helper/maskMixin";
declare var mobiscroll:any;
@Component({
   components:{  
      TabItem,
      
   },   
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
      //  'inventoryList':'stockTaking/inventoryList'
     }) 
   },
   
  //  methods:{
  //    ...mapActions({
  //      'getInventoryList':'stockTaking/getInventoryList'
  //    }),
  //  }   
})
export default class stockTaking extends Vue{
    private service: StockTakingService;
    private pager:Pager;   
    private getInventoryList:INoopPromise
    private inventoryList:any[] = [];
    private inventoryType:any[] = [{name:'数据整理'},{name:'日盘'},{name:'月盘'},{name:'周盘'}];
    private tabList:TabList = new TabList();
    private allLoaded:boolean= false;
    private newlyadded:boolean= false;
    private hideMask:()=>void;
    private showMask:()=>void;
    created() {
      this.tabList.push({
        name:"待提交",
        status:1,
        active:true,
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
        status:4,
        active:false
      });
      this.pager = new Pager()
      this.service = StockTakingService.getInstance();
      this.inventoryList = [];
    }
   
    mounted(){
       this.getpkList();
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
    
    //tab页面切换
    private tabClick(index:number){
      this.tabList.setActive(index);
      this.allLoaded=false;
      (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
      this.pager.resetStart();//分页加载还原pageNum值
      this.getpkList();  
    }
     //获取列表
    private getpkList(){
      this.service.getInventoryList(status as string, this.pager.getPage()).then(res=>{
        this.showMask();
        this.$vux.loading.show({
          text: '加载中...'
          });
        this.inventoryList=res.data.data;
        setTimeout(()=>{
          this.$vux.loading.hide()
          this.hideMask()
        },400)
        },err=>{
          this.$toasted.show(err.message)
      });
    }
    //下拉加载更多
    private loadMore() {
      if(!this.allLoaded){
         this.showMask();
      this.$vux.loading.show({
        text:'加载中..'
      });       
      this.pager.setNext();
      this.service.getInventoryList(status as string, this.pager.getPage()).then(res=>{  
        if(this.pager.getPage().limit>res.data.data.length){
          this.allLoaded=true
        }else{
          this.inventoryList=this.inventoryList.concat(res.data.data)
        }
        setTimeout(()=>{
          this.$vux.loading.hide()
          this.hideMask()
        },500); 
      },err=>{
          this.$toasted.show(err.message)
      })
      this.pager.setLimit(20)
      }     
    }
    private librarydetails(info:string){
      this.$router.push(info)
    }
    // 提交页面
    private submission(info:string){
      this.$router.push(info)
    }
    //实盘录入
    private realdiscentry(info:string){
      this.$router.push(info)
    }
    //审核
    private toexamine(info:string){
       this.$router.push(info)
    }
    //新增盘点单
    private add(){
      this.newlyadded = true
    }
    //查询盘点单
    private query(){
       alert("2222")
    }


 
      
}
</script>
<style lang="less" scoped> 
@padding: 5px 6px;
.stocktaking{
  .addbtn{
      font-size: 20px;
      i{
        margin-right: 15px;
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
            background-image: url("../../../assets/images/intentory_ico_month.png")
        }
        li:nth-child(4) i{
            background-image: url("../../../assets/images/intentory_ico_week.png")
        }
        li:last-child{
          border-bottom:none;
        }
      }
    }    
}
</style>


