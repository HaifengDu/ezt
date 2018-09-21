<!--盘库模块-->
<template>
<div>
   <div class="ezt-page-con stocktaking" ref="listContainer"  v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
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
      <div class="ezt-add-content">
                <div v-if="!inventoryList" class="done-none">
                  <div></div>
                  <span>目前还没有任何订单</span>
                </div>
                <ul class="submitted" v-if="inventoryList">
                  <li :key="index" v-for="(item,index) in inventoryList.list">
                    <div @click="librarydetails(item,'a')">
                        <div class="state">   
                        <span>
                          <i v-if="item.bill_type_name === '日盘'" class="day">日</i>
                          <i v-if="item.bill_type_name === '周盘'" class="week">周</i>
                          <i v-if="item.bill_type_name === '周期盘点'" class="year">月</i>
                        {{item.bill_no}}</span>   
                        <span class="" v-if="tabList.getActive().status==0" style="color:#9182E1">暂存</span>
                        <span class="" v-if="tabList.getActive().status==2 && item.is_stock_valid ==null">待生效</span>
                        <span v-if="tabList.getActive().status==2 && item.is_stock_valid ==1">已生效</span>
                        <span class="" v-if="tabList.getActive().status==1" style="color:#FFA32C">待审核</span>
                        <span class="" v-if="tabList.getActive().status==3" style="color:#FF7563">审核失败</span>
                      </div> 
                      <div class="content">
                          <p>盘点仓库：<span>{{item.warehouse_name}}</span></p>
                          <p>盘点日期：<span>{{item.busi_date}}</span></p>
                          <p>生成损溢：<span   v-if="item.is_profit_loss === 1">是</span><span v-if="item.is_profit_loss === 0">否</span></p>
                          <p>未盘处理：<span>{{item.stock_count_mode_name}}</span></p>
                      </div>
                    </div>
                    <div class="footer">
                        <P>业务日期：<span>2017-07-28</span></P>
                        <div v-if="tabList.getActive().status === 0" class="submit" @click="submission(item,'c')">提交</div>
                        <div v-if="tabList.getActive().status === 1" class="submit" @click="librarydetails(item,'b')">审核</div>
                        <div v-show="hidebtn" v-if="tabList.getActive().status==2 && item.is_stock_valid ==null"  class="submit">生效</div>
                        <div v-show="showbtn" v-if="tabList.getActive().status === 3 || tabList.getActive().status==2 && item.is_stock_valid ==1"  class="submit" @click="realdiscen(item,'e')">实盘录入</div>
                    </div>   
                  </li>
                  <span v-if="allLoaded">已全部加载</span>
                </ul>                
          </div>
      </div>    
  </div>
  <!-- 选择盘点类型 -->
  <div>    
      <x-dialog v-model="newlyadded" class="dialog">
      <div class="newlytype">
          <div class="title" @click="close = false">
            <p>请选择盘点类型</p>
            <span class="close" @click="newlyadded=false"><i class="fa fa-times" aria-hidden="true"></i></span>
          </div>
          <ul>
            <li @click="datasorting"><i></i>数据整理</li>
            <li :key="index" v-for="(type,index) in inventoryType" @click="addinventorylist(type,'name')"><i></i>{{type.name}}</li>
          </ul>
      </div>   
    </x-dialog>
  </div>
  <!-- 查询盘点单 -->
  <div v-if="isSearch" class="search-dialog">
      <ul class="ezt-title-search">
       <li>
        <span class="title-search-name">单据号：</span>
        <input type="text" placeholder="请输入单据号" class="ezt-middle" v-model="searchParam.djnumber">
       </li>
       <li class="select-list">
        <span class="title-search-name ">盘点库：</span>
        <span class="title-select-name item-select">
          <select name="" id="" placeholder="请选择" class="ezt-select" v-model="searchParam.selectedwarehouse">
            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择盘点库</option>
             <option :value="type.id" :key="index" v-for="(type,index) in warehouseType">{{type.text}}</option>
          </select>
        </span>
      </li>
      <li>
        <span class="title-search-name">开始日期：</span>
        <span>
          <ezt-canlendar placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
        </span>
      </li>
       <li>
        <span class="title-search-name">结束日期：</span>
        <span>
          <ezt-canlendar placeholder="结束时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
        </span>
      </li>
      <li>
        <div class="ezt-two-btn" @click="toSearch">查询</div>
      </li>
    </ul>
  </div> 
</div>
</template>
<script lang="ts">   
import Vue from 'vue'
import {TabItem,LoadingPlugin} from 'vux'
import ErrorMsg from "../model/ErrorMsg"
import ResponseError from "../../../exception/ResponseError"
import {Component,Watch} from "vue-property-decorator"
import StockTakingService from '../../../service/StockTakingService'
import Pager from '../../../common/Pager'
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import librarydetails from './LibraryDetails'
import addinventorylist from './AddinventoryList'
import { TabList } from '../../../common/ITab'
import {maskMixin} from "../../../helper/maskMixin"
import queryresult from './QueryResult.vue';
declare var mobiscroll:any;
@Component({
   components:{  
      TabItem,
      
   },   
   mixins:[maskMixin],
  computed:{    
     ...mapGetters({

     }) 
   },
   methods:{    
     ...mapActions({
       'setInventoryDetails':"stockTaking/setInventoryDetails",
       'setQueryResult':"stockTaking/setQueryResult",
       'setInventoryType':"stockTaking/setInventoryType",
     }),
     
   }     
})
export default class stockTaking extends Vue{
    private service: StockTakingService;
    private pager:Pager;       
    private getInventoryList:INoopPromise;  //获取盘库列表接口
    private getLibraryDetails:INoopPromise; //盘库详情
    private getInventoryType:INoopPromise;  //获取盘点类型 
    private getDataSorting:INoopPromise;  //获取数据整理
    private getEnquiryList:INoopPromise;  //查询盘库单 查询结果
    private getWarehouse:INoopPromise;  //查询盘库单 仓库接口
    private inventoryList:{list?:any[]} = {};//盘库列表   
    private setInventoryDetails:INoopPromise//store中给setInventoryDetails赋值
    private setQueryResult:INoopPromise//store中给setQueryResult赋值
    private setInventoryType:INoopPromise//store中给setInventoryType赋值
    private tabList:TabList = new TabList();
    private allLoaded:boolean= false;
    private newlyadded:boolean= false;
    private isSearch:boolean= false; //搜索的条件
    private searchParam:any={};//搜索时的查询条件
    private warehouseType:any[];  //动态加载仓库
    private selectedwarehouse:any;//选中仓库id
    private showbtn:boolean= true;
    private hidebtn:boolean= true;
    private sildename:string = 'slide-go';
    private hideMask:()=>void;
    private showMask:()=>void;
    private djnumber:any; //单据号
    private inventoryType:any[] = [];//盘点类型
    private type:string; //盘点类型数据
    private names:string;
    private isSave:boolean = false;  //有未审核盘点提示
    private addMaskClickListener:(...args:any[])=>void; //遮罩层显示隐藏
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
      this.inventoryType.push({  
        name:"日盘",
        bill_type:'daily_inventory'
      });
      this.inventoryType.push({
        name:"周盘",
        bill_type:'week_inventory'
      });
      this.inventoryType.push({
        name:"月盘",
        bill_type:'period_inventory'
      });
      this.pager = new Pager()
      this.service = StockTakingService.getInstance();
      this.searchParam = {};
      this.iswarehouseType(); //动态加载仓库

     
    }
   
    mounted(){
        this.getpkList();
        this.addMaskClickListener(()=>{  //点击遮罩层消失
        this.isSearch=false; 
        this.hideMask();
      });  
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
    
    // 盘库详情  审核盘点单
    private librarydetails(item:any,types:any,audit_status:number){
      this.service.getLibraryDetails(item.id,audit_status).then(res=>{ 
        this.$router.push({
          name:'LibraryDetails',
          query:{
              warehouse_name:item.warehouse_name,
              busi_date:item.busi_date,
              bill_type_name:item.bill_type_name,
              stock_count_mode_name:item.stock_count_mode_name,
              ids:item.id,
              types:types,
              stock_count_mode:item.stock_count_mode,
            }});  
          this.setInventoryDetails(res.data.data); 
      },err=>{
          this.$toasted.show(err.message)
      })
    } 
    // 实盘录入
    private realdiscen(item:any,types:any,audit_status:number){
      this.service.getLibraryDetails(item.id,audit_status).then(res=>{ 
        this.$router.push({
          name:'LibraryDetails',
          query:{
              ids:item.id,
              stock_count_mode:item.stock_count_mode,
              types:types,
            }});
          this.setInventoryDetails(res.data.data); 
      },err=>{
          this.$toasted.show(err.message)
      })
    } 
    
   
    // 提交页面  确认盘点单
    private submission(item:any,types:any,audit_status:number){
      this.service.getLibraryDetails(item.id,audit_status).then(res=>{ 
        this.$router.push({
          name:'LibraryDetails',
          query:{
              warehouse_name:item.warehouse_name,
              busi_date:item.busi_date,
              bill_type_name:item.bill_type_name,
              stock_count_mode_name:item.stock_count_mode_name,
              ids:item.id,
              stock_count_mode:item.stock_count_mode,
              types:types,
            }});
          this.setInventoryDetails(res.data.data); 
      },err=>{
          this.$toasted.show(err.message)
      })
    
    }
    //生效按钮
    private takeeffect(){
      alert("e")
       this.hidebtn = false
       this.showbtn = true
    }
    
    //新增盘点单  
    private add(){
      this.newlyadded = true
    }  
    private addinventorylist(type:any,name:any,bill_type:string,){
      this.service.getInventoryType(type.bill_type).then(res=>{ 
        this.setInventoryType(this.type);        
        this.$router.push({
            name:'AddinventoryList',
            query:{
             name:type.name,
             bill_type:type.bill_type
           }
         });
         this.newlyadded = false
         this.type = res.data.data[0].bill_type;
      },err=>{
          if(err instanceof ResponseError){
            if(err.data.errmsg  === 'unreview'){
                this.setInventoryType(this.type);        
                this.$router.push({
                    name:'AddinventoryList',
                    query:{
                    name:type.name,
                    bill_type:type.bill_type
                  }
                });
                this.newlyadded = false
                this.type = err.data.data[0].bill_type;
            }
          }
      })
    }   
   
     // 数据整理  
    private datasorting(){
      this.service.getDataSorting().then(res=>{  
          this.newlyadded = false
          this.$router.push('/stocktaking');
          this.$toasted.show('操作成功！')
      },err=>{
          this.$toasted.show(err.message)
          this.newlyadded = false
          this.$router.push('/stocktaking');
      })
    }
    //查询盘点单   
    private query(){
      this.isSearch = !this.isSearch;
      this.isSearch?this.showMask():this.hideMask();
    }
    //查询结果
    private toSearch(){
      const bill_no = this.searchParam.djnumber || null;
      const end_date =  this.searchParam.end_date || null;
      const begin_date = this.searchParam.begin_date || null;
      const warehouse_id = this.searchParam.selectedwarehouse || null;
      this.service.getEnquiryList(bill_no,end_date,begin_date,warehouse_id).then(res=>{ 
        this.hideMask();     
        this.isSearch = false;
        this.$router.push({name:'QueryResult'});
        this.setQueryResult(res.data.data); 
      },err=>{
          this.hideMask();     
          this.isSearch = false;
          this.$toasted.show(err.message)
      })
     
    }
    //动态加载仓库
    private iswarehouseType(){
      const inventory_type = "week_inventory";
      this.service.getWarehouse(inventory_type as string).then(res=>{ 
          this.warehouseType = res.data.data;
      },err=>{
          this.$toasted.show(err.message)
      })
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
              .day{
                background: linear-gradient(-139deg, #FFB38F 0%, #FF9FA7 100%);
              }
              .week{
                background: linear-gradient(-135deg, #FFBE4E 0%, #FE9E49 100%);
              }
              .year{
                background: linear-gradient(-134deg, #97DBFF 0%, #7AC0FF 100%);
              }
              i{
                opacity: 0.7;
                border-radius: 4px;
                font-size: 12px;
                color: #fff;
                width: 20px;
                height: 20px;
                line-height: 22px; 
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
  .search-dialog{
    width: 100%; 
    position:absolute;
    top:45px; 
    z-index:10001;
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
            background-image: url("../../../assets/images/intentory_ico_week.png")
        }
        li:nth-child(4) i{
            background-image: url("../../../assets/images/intentory_ico_month.png")
        }
        li:last-child{
          border-bottom:none;
        }
      }
    }    
}
</style>


