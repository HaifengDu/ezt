<!--盘库模块-->
<template>
<div>
   <div class="ezt-page-con stocktaking">
    <ezt-header :back="true" title="盘库" @goBack="goBack">
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
                <div v-if="!inventoryList" class="done-none">
                  <div></div>
                  <span>目前还没有任何订单</span>
                </div>
                <ul class="submitted" v-if="inventoryList">
                  <li :key="index" v-for="(item,index) in inventoryList.list">
                    <div @click="librarydetails(item)">
                        <div class="state">   
                        <span><i>{{item.bill_type_name}}</i>{{item.bill_no}}</span>
                        <span>{{tabList.getActive().status==0?'暂存':'' || tabList.getActive().status==1?'待审核':'' || item.is_stock_valid == 1?'已生效':''  ||item.is_stock_valid == null?'待生效':'' || tabList.getActive().status==3?'审核失败':'' }}</span>
                      </div>
                      <div class="content">
                          <p>盘点仓库：<span>{{item.warehouse_name}}</span></p>
                          <p>盘点日期：<span>{{item.busi_date}}</span></p>
                          <p>生成损溢：<span v-if="item.is_profit_loss === 1">是</span><span v-if="item.is_profit_loss === 0">否</span></p>
                          <p>未盘处理：<span>{{item.stock_count_mode_name}}</span></p>
                      </div>
                    </div>
                    <div class="footer">
                        <P>业务日期：<span>{{item.busi_date}}</span></P>
                        <div v-if="tabList.getActive().status === 0" class="submit" @click="submission('/confirmationlist')">提交</div>
                        <div v-if="tabList.getActive().status === 1" class="submit" @click="toexamine('./auditchecklist')">审核</div>
                        <div v-show="hidebtn" v-if="tabList.getActive().status === 2 && item.is_stock_valid === null"  class="submit" @click="takeeffect">生效</div>
                        <div v-show="showbtn" v-if="item.is_stock_valid === 1 || tabList.getActive().status === 3 "  class="submit" @click="realdiscentry('/realdiscentry')">实盘录入</div>
                    </div>
                  </li>
                  <span v-if="allLoaded">已全部加载</span>
                </ul>                
          </div>
      </div>    
  </div>
  
  <!-- 查询盘点单 -->
  <transition :name="sildename">
    <div class="enquirylist" v-if="isSearch">
        <div class="content">
          <div class="warehouse">
            <ul>   
              <li>
                 <span>单据号</span>
                 <p><input type="text" placeholder="请输入单据号" v-model="djnumber"></p>
              </li>
              <li class="select-list">
                <span class="title-search-name ">盘点库</span>
                <span class="title-select-name item-select">
                  <select name="" id="" placeholder="请选择" class="ezt-select" v-model="Selected" 
                  @change="handlerwarehouseType()">
                        <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                        <option :value="type.text" :key="index" v-for="(type,index) in warehouseType">{{type.text}}</option>
                      </select>   
                  </span>
              </li>
              <li>
                  <span>开始日期</span>
                  <ezt-canlendar type="text" placeholder="开始日期" class="input-canlendar" v-model="searchParam.begin_date"></ezt-canlendar>
              </li>
              <li>
                  <span>结束日期</span>
                  <ezt-canlendar type="text" placeholder="结束日期" class="input-canlendar" v-model="searchParam.end_date"></ezt-canlendar>
              </li>
            </ul>
             <p class="s_btn1" @click="toSearch">查询</p>
          </div>
       </div>
   </div>  
 </transition>  
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
import addinventorylist from './AddinventoryList'
import { TabList } from '../../../common/ITab'
import {maskMixin} from "../../../helper/maskMixin"
import '../../../assets/css/transition.css'
import queryresult from './QueryResult.vue';
declare var mobiscroll:any;
@Component({
   components:{  
      TabItem,
      
   },   
   mixins:[maskMixin],
  computed:{  
     ...mapGetters({
       'inventoryDetails':'stockTaking/inventoryDetails',//盘点详情
       'queryResult':'stockTaking/queryResult',//查询结果
     }) 
   },
   methods:{ 
     ...mapActions({
       'setInventoryDetails':"stockTaking/setInventoryDetails",
       'setQueryResult':"stockTaking/setQueryResult",
     }),
     
   }     
})
export default class stockTaking extends Vue{
    private service: StockTakingService;
    private pager:Pager;      
    private getInventoryList:INoopPromise  //获取盘库列表
    private inventoryList:{list?:any[]} = {};//盘库列表
    private inventoryDetails:any; //列表详情
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private queryResult:any;  //查询详情
    private setQueryResult:INoopPromise//store中给setQueryResult赋值
    private tabList:TabList = new TabList();
    private allLoaded:boolean= false;
    private newlyadded:boolean= false;
    private isSearch:boolean= false; //搜索的条件
    private searchParam:any={};//搜索时的查询条件
    private warehouseType:any[] = [];  //动态加载仓库
    private Selected:string;  //仓库默认显示第一个
    private showbtn:boolean= true;
    private hidebtn:boolean= true;
    private sildename:string = 'slide-go';
    private hideMask:()=>void;
    private showMask:()=>void;
    private djnumber:string; //单据号
    private orderType:any[] = [{
      name:"合同采购单",
      type:"q"
    },{
      name:"采购单",
      type:"m"
    }];
    created() {
      this.tabList.push({
        name:"待提交",
        status:0,
        active:true,
      });   
      this.tabList.push({
        name:"待/已生效",
        status:2,
        active:false
      });
      this.tabList.push({
        name:"待审核",
        status:1,
        active:false
      }); 
      this.tabList.push({
        name:"审核失败",
        status:3,
        active:false
      });   
      
      this.pager = new Pager()
      this.service = StockTakingService.getInstance();
      this.searchParam = {};
      this.iswarehouseType(); //动态加载仓库
    }
   
    mounted(){
       this.getpkList();
       this.isSearch = false;
       this.hideMask();
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
    private goBack(){
      this.$router.push('/');
    }
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
      const status = this.tabList.getActive().status;
      this.service.getInventoryList(status as string, this.pager.getPage()).then(res=>{
        this.showMask();
        this.$vux.loading.show({
          text: '加载中...'
        });
        this.inventoryList = res.data.data[0];
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
      const status = this.tabList.getActive().status;
      this.service.getInventoryList(status as string, this.pager.getPage()).then(res=>{  
        if(this.pager.getPage().limit>res.data.data.length){
          this.allLoaded=true
        }else{
          this.inventoryList.list=this.inventoryList.list.concat(res.data.data)
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
    // 盘库详情
    private librarydetails(item:any,audit_status:number){
      this.service.getLibraryDetails(item.id,audit_status).then(res=>{ 
        this.$router.push({
          name:'LibraryDetails',
          params:{
              warehouse_name:item.warehouse_name,
              busi_date:item.busi_date,
              bill_type_name:item.bill_type_name,
              stock_count_mode_name:item.stock_count_mode_name
            }});
          this.inventoryDetails = res.data.data;
          this.setInventoryDetails(this.inventoryDetails); 
      },err=>{
          this.$toasted.show(err.message)
      })
    }     
   
    // 提交页面
    private submission(info:string){
      this.$router.push(info)
    }
    //生效按钮
    private takeeffect(){
      alert("e")
       this.hidebtn = false
       this.showbtn = true
    }
    //实盘录入
    private realdiscentry(info:string){
      this.$router.push(info)
      this.service.getRealdiscEntry().then(res=>{  
          console.log("1111111")
      },err=>{
          this.$toasted.show(err.message)
      })
    }
    //审核
    private toexamine(info:string){
       this.$router.push(info)
    }
    //新增盘点单
    private add(){
       this.$router.push({name:'AddinventoryList'});
    }
    //查询盘点单   
    private query(){
      this.isSearch = !this.isSearch;
      this.isSearch?this.showMask():this.hideMask();
    }
    //查询结果
    private toSearch(){
      const bill_no = this.djnumber || null;
      const end_date =  this.searchParam.end_date || null;
      const begin_date = this.searchParam.begin_date || null;
      const warehouse_id = this.warehouseType[0].id;
      this.service.getEnquiryList(bill_no,end_date,begin_date,warehouse_id).then(res=>{ 
        this.hideMask();
        this.$router.push({name:'QueryResult'});
        this.queryResult = res.data.data;
        this.setQueryResult(this.queryResult); 
      },err=>{
          this.$toasted.show(err.message)
          this.$router.push({name:'QueryResult'});
          this.isSearch = false;
      })
     
    }
    //动态加载仓库
    private iswarehouseType(){
      const inventory_type = "week_inventory";
      this.service.getWarehouse(inventory_type as string).then(res=>{ 
          this.warehouseType = res.data.data;
          this.Selected = this.warehouseType[0].text
      },err=>{
          this.$toasted.show(err.message)
      })
    }

    //动态仓库切换
    private handlerwarehouseType(){

    }


 
      
}
</script>
<style lang="less" scoped> 
@padding: 5px 6px;
@width:100%;  
@height:100%;
@background-color:#fff;
@border-radius:3px;
.input-canlendar .ezt-canlendar{
  font-size: 16px!important;
  width: 100px!important;
}
.ezt-pk,.ezt-add-content{
  padding-bottom: 0;
  
}
.stocktaking{
  background-color: #F1F6FF;
  .addbtn{
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
          width:@width;
          margin-bottom: 10px;
          border: 1px solid #DDECFD;
          box-shadow: 0 0 20px 0 rgba(71,66,227,0.07);
          border-radius: 6px;
          background-color:@background-color;
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
                width: 20px;
                height: 20px;
                line-height: 20px; 
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

// 查询盘点单
.enquirylist{
    position: fixed;
    top: 40px;
    left: 0;
    z-index:10001;
    width: @width;
    .content{
      width: @width;
      display: flex;
      align-items: center;
      flex-direction: column;
     .warehouse{
          width: @width;
          background-color: @background-color;
          text-align: left;
          display:  flex;
          flex-direction:  column;
          align-items:  center;
          padding-bottom: 20px;
          ul{
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            border-bottom: 1px solid #D2DFEE;
            width: @width;
            li{
               height: 45px;
               line-height: 45px;
               width: 90%;
               border-bottom: 1px solid #D2DFEE;
               display: flex;
               justify-content: space-between;
               position: relative;
               padding-right: 20px;
               span{
                 display: block;
                 width: 100px
               }
               p{
                 flex: 1;
                 .ezt-select{
                   padding-right: 0;
                   margin-right: 15px;
                   margin-top: 2px;
                 }
                 input{
                   height: 40px;
                   line-height: 40px;
                   float: right;
                   background: none;
                 }
               }
            }
            li:last-child{
               border-bottom:none;
            }
          }
       .s_btn1{
         margin-top: 20px;
         width: 95%;
         height: 45px;
         color: #fff;
         line-height: 45px;
         text-align: center;
         display: flex;
         align-items: center;
         justify-content: center;
       }
     }
   }
}
</style>


