<!--盘库首页-->
<template>
<div>
   <div class="ezt-page-con stocktaking">
    <ezt-header :back="true" title="盘库" :isInfoGoback="true" @goBack="goBack">
      <div slot="action">
         <div class="add">
           <span class='ezt-action-point' @click="add">
            <i class="fa fa-plus" aria-hidden="true" ></i>
           </span>
          <span class='ezt-action-point' @click="query">
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>          
         </div>      
       </div>
    </ezt-header>      
    <div class="ezt-main">            
       <tab :line-width=2 active-color='#fc378c'>
          <tab-item class="vux-center" 
             :selected="item.active" 
             v-for="(item, index) in tabList.TabList"
            @on-item-click="tabClick(index)" 
          :key="index">{{item.name}}
        </tab-item>
      </tab>
      <div class="ezt-add-content main-menu">
         <div v-if="!inventoryList" class="done-none">
            <div></div>
            <span>目前还没有任何订单</span>
          </div>
        <div v-if="inventoryList">
          <div class="receive-dc-list" v-for="(item,index) in inventoryList.list" :key="index">
            <div class="ezt-list-show" 
                v-swipeleft="handlerSwipe.bind(this,item,true)"  
                v-swiperight="handlerSwipe.bind(this,item,false)" 
                :class="{'swipe-transform':item.active}"
                >
              <div class="receive-icon-title" @click="librarydetails(item,pageType.LibraryDetails)">
                <span class="return-list-title">
                  <span>
                      <i v-if="item.bill_type_name === '日盘'" class="day">日</i>
                      <i v-if="item.bill_type_name === '周盘'" class="week">周</i>
                      <i v-if="item.bill_type_name === '周期盘点'" class="year">月</i>
                      {{item.bill_no}}
                  </span>
                </span> 
                <span class="receive-status" v-if="tabList.getActive().status==0 || tabList.getActive().status =='SCM_AUDIT_NO'">待审核</span>
                <span class="receive-status" v-if="tabList.getActive().status==1 || tabList.getActive().status=='SCM_AUDIT_YES'">已完成</span>  
              </div>
              <div class="receive-icon-content" @click="librarydetails(item,pageType.LibraryDetails)">
                <span class="receive-dc-title">盘点仓库：
                  <span class="receive-dc-content">{{item.warehouse_name}}</span>  
                </span>
                <span class="receive-dc-title" v-if="!InterfaceSysTypeBOH">盘点日期：
                  <span class="receive-dc-content">{{item.busi_date}}</span>
                </span>
                <span class="receive-dc-title">生成损溢：
                  <span class="receive-dc-content">{{item.is_profit_loss == 1?'是':'否'}}</span>
                </span>
                <span class="receive-dc-title" v-if="!InterfaceSysTypeBOH">未盘处理：
                  <span class="receive-dc-content"> {{item.stock_count_mode_name}}</span>
                </span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                   <span class="businessDate">业务日期：{{item.busi_date}}</span>
                   <span class="submit" v-if="tabList.getActive().status === 0 || tabList.getActive().status === 'SCM_AUDIT_NO'" @click="librarydetails(item,pageType.AuditList)">审核</span>
                </div>
              </div>
            </div>
            <div class="ezt-detail-del" @click="delAction(item)">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
        </div>
      </div>
      </div>
    </div>
  </div>
  <!-- 选择盘点类型 -->
  <div>    
      <x-dialog v-model="newlyadded" class="dialog">
      <div class="newlytype">
          <div class="title" @click="close = false">
            <p>请选择盘点类型</p>
            <span class="close" @click="newlyadded=false">
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>
          </div>
          <ul>
            <li @click="datasorting" v-if="!InterfaceSysTypeBOH"><i></i>数据整理</li>
            <li :key="index" v-for="(type,index) in inventoryType" @click="addinventorylist(type,'name')"><i></i>{{type.name}}</li>
          </ul>
      </div>   
    </x-dialog>
  </div>
  <!-- 查询盘库单 -->
  <div v-show="isSearch" class="search-dialog stocktaking">
      <ul class="ezt-title-search">
       <li>
         <x-input title="单据号：" :max="50" v-model="searchParam.billNumber" placeholder="请输入单据号"></x-input>
       </li>
      <li v-if="InterfaceSysTypeBOH">
         <x-input title="盘点库：" :max="50" disabled v-model="searchParam.bohWarehouse" placeholder="请输入盘点库"></x-input>
       </li>
       <li class="select-list" v-if="!InterfaceSysTypeBOH">
        <span class="title-search-name">盘点库：</span>
        <span class="title-select-name item-select">
          <select placeholder="请选择" class="ezt-select" v-model="searchParam.selectedWarehouse">
             <option value="" style="display:none;" disabled selected>请选择盘点库</option>
             <option :value="type.id" :key="index" v-for="(type,index) in warehouseType">{{type.text}}</option>
          </select>
        </span>
      </li>
      <li>
        <span class="title-search-name">开始日期：</span>
        <span>    
          <ezt-canlendar ref="startDate" v-model="searchParam.startDate" :max="searchParam.endDate" :defaultValue="new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd')" placeholder="开始时间" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" >
          </ezt-canlendar>
        </span>
      </li>
       <li>
        <span class="title-search-name">结束日期：</span>
        <span>
           <ezt-canlendar ref="endDate" v-model="searchParam.endDate" :min="searchParam.startDate" :defaultValue="new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')" placeholder="结束时间" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar">
           </ezt-canlendar>     
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
import { FactoryService } from "../../../factory/FactoryService"
import { IStockTakingService } from "../../../interface/service/IStockTakingService"
import Pager from '../../../common/Pager'
import { mapActions, mapGetters } from 'vuex'
import { INoop, INoopPromise } from '../../../helper/methods'
import { TabList } from '../../../common/ITab'
import {maskMixin} from "../../../helper/maskMixin"
import { CachePocily } from "../../../common/Cache"
import { PageType } from "../../../enum/EPageType"
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
        'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',//接口BOH
     })
   },
   methods:{
     ...mapActions({

     })
   }   
})
export default class stockTaking extends Vue{
    private pager:Pager; 
    private service:IStockTakingService;
    private InterfaceSysTypeBOH:boolean;
    private cache = CachePocily.getInstance();   
    private inventoryList:{list?:any[]} = {};//盘库列表   
    private tabList:TabList = new TabList();
    private newlyadded:boolean= false;
    private isSearch:boolean= false; //搜索的条件
    private searchParam:any={    //搜索时的查询条件
      billNumber:'',
      selectedWarehouse:'',
      startDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
      endDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd'),
    };
    private warehouseType:any[]=[];  //动态加载仓库
    private addMaskClickListener:(...args:any[])=>void; //遮罩层显示隐藏
    private hideMask:()=>void;
    private showMask:()=>void;
    private inventoryType:any[] = [];//盘点类型
    private bohWarehouse:any;
    private type:string; //盘点类型数据
    private pageType = PageType;
    created() {
      const factory = FactoryService.getInstance().createFactory();
      this.service = factory.createStockTaking();
      this.pager = new Pager().setLimit(20)
      /**
       * SAAS盘点状态
       */
      if(!this.InterfaceSysTypeBOH){
          this.tabList.push({
              name:"待审核",   
              status:0,
              active:true,
            },{
              name:"已审核",
              status:1,
              active:false  
            }
          ); 
      }
      /**
       * BOH盘点状态  待审核  已审核
       */
      if(this.InterfaceSysTypeBOH){
          this.tabList.push({
              name:"待审核",   
              status:'SCM_AUDIT_NO',
              active:true,
            },{
              name:"已审核",
              status:'SCM_AUDIT_YES',
              active:false  
            }
          ); 
      }
       /**
       * BOH添加新品盘
       */
        if(this.InterfaceSysTypeBOH){
          this.inventoryType.push({  
            name:"新品盘",
            bill_type:'new_inventory'
          }
        );
      }
      this.inventoryType.push({  
          name:"日盘",
          bill_type:'daily_inventory'
        },{
          name:"周盘",
          bill_type:'week_inventory'
        },{
          name:"月盘",   
          bill_type:'period_inventory'
        }
      );
     
      /**
       * SAAS版本  动态加载仓库
       */
      if(!this.InterfaceSysTypeBOH){
          this.getWarehouseType();  
      }
    }
    mounted(){   
      this.getpkList();
      /**
       * 点击遮罩层 
       */
      this.addMaskClickListener(()=>{  
          this.isSearch = false; 
          this.hideMask();
      });  
      if(this.$route.params.purStatus=="已审核"){  
        this.tabList.TabList.forEach((item,index)=>{
          if(item.name == this.$route.params.purStatus){
            item.active = true;
          }else{
            item.active = false;
          }
        })
      } 
    } 
     /**
     * 动态加载仓库
     */
    private getWarehouseType(){
      const inventory_type = "week_inventory";
      this.service.getWarehouse(inventory_type as string).then(res=>{ 
            this.warehouseType = res.data.data
      },err=>{       
          this.$toasted.show(err.message);
      });
    }
    /**
     * 查询日期限制
     */
     private selectDateChange(val:any){
      (<any>this.$refs.startDate).setMax(new Date(val));
      (<any>this.$refs.endDate).setMin(new Date(val));
    }
    /**
     * 返回上一页
     */
    private goBack(){
      this.$router.push("/");
    } 
    private tabClick(index:number){
      this.tabList.setActive(index);
      this.pager.resetStart();//分页加载还原pageNum值
      this.getpkList();  
    }
    /**
     * 点击删除按钮
     */
    private delAction(item:any){
      let _this = this;
      this.$vux.confirm.show({
        onCancel () {
          let newIndex = _this.inventoryList.list.findIndex((info:any,index:any)=>{
            return item.id == info.id;
          })
          _this.inventoryList.list[newIndex].active = false;
        },
        onConfirm () {
          let newIndex = _this.inventoryList.list.findIndex((info:any,index:any)=>{
            return item.id == info.id;
          })
          _this.inventoryList.list.splice(newIndex,1);
        },
        content:'是否要删除该单据?'
      })
    }
    /**
     * 获取列表
     */
    private getpkList(){
      const status = this.tabList.getActive().status;
      this.service.getInventoryList(status as string, this.pager.getPage()).then(res=>{
        this.showMask();
        this.$vux.loading.show({
          text: '加载中...'
        });
        if(!this.InterfaceSysTypeBOH){
           this.inventoryList = res.data.data[0];
        }else{
          this.inventoryList = res.data;
          this.searchParam.bohWarehouse = this.inventoryList.list[0].warehouse_name
        }
        (this.inventoryList.list||[]).forEach(item=>this.$set(item,'active',false));
        setTimeout(()=>{
          this.$vux.loading.hide()
          this.hideMask()
        },400)
        },err=>{
          this.$toasted.show(err.message)
      });
    }
    /**
     * 左侧滑动删除
     */
    private handlerSwipe(item:any,active:boolean){
        const status = this.tabList.getActive().status;
        if(status =="0" || status == 'SCM_AUDIT_NO'){
          item.active = active;
        }    
    }
    /**    
     * Saas版本  BOH版本   盘库详情  审核盘点单  实盘录入  确认盘点单
     */
    private librarydetails(item:any,types:PageType){
      this.service.getLibraryDetails(item.id,item.bill_status).then(res=>{ 
        this.cache.save(CACHE_KEY.INVENTORY_DETAILS,JSON.stringify(res.data.data));
        this.cache.save(CACHE_KEY.INVENTORY_LIST,JSON.stringify(item));
        if(!this.InterfaceSysTypeBOH || this.tabList.getActive().status=='SCM_AUDIT_YES'){
          this.$router.push({name:'LibraryDetails',query:{types:types.toString()}});  
        }else{
          this.$router.push({name:'AuditcheckList'}); 
        }
      },err=>{
          this.$toasted.show(err.message)
      })
    } 

    /**
     * 新增盘库单
     */
    private add(){
      this.newlyadded = true   
    }  
    private addinventorylist(type:any,name:any,bill_type:string){
          let InventoryType = {};
          this.service.getInventoryType(type.bill_type).then(res=>{ 
            InventoryType={   
              name:type.name,
              bill_type:type.bill_type,
            }   
            if(!this.InterfaceSysTypeBOH){
              this.cache.save(CACHE_KEY.INVENTORY_TYPE,JSON.stringify(res.data.data[0].bill_type)); 
            }else{
              this.cache.save(CACHE_KEY.INVENTORY_TYPE,JSON.stringify(res.data)); 
            }
            this.$router.push({name:'AddinventoryList'});
          },err=>{
              if(err instanceof ResponseError){
                let that = this;
                let OrderModule = {};
                if(err.data.errmsg  === 'unreview'){
                    this.newlyadded = false
                    this.$vux.confirm.show({   
                      onConfirm () {
                        OrderModule={   
                            name:type.name,
                            bill_type:type.bill_type,
                          }   
                        that.cache.save(CACHE_KEY.INVENTORY_TYPE,JSON.stringify(OrderModule));
                        that.$router.push({name:'AddinventoryList'});
                      },
                      content:'有单据未完成审核，是否进行盘点?'
                    })
                }else if(err.data.errcode  == 37){
                  this.newlyadded = false
                  this.$vux.confirm.show({   
                    onConfirm () {
                      OrderModule={   
                        name:type.name,
                        bill_type:type.bill_type,
                      }   
                      that.cache.save(CACHE_KEY.INVENTORY_TYPE,JSON.stringify(OrderModule));
                      that.cache.save(CACHE_KEY.WAREHOUSE,JSON.stringify(err.data)); 
                      that.$router.push({name:'AddinventoryList'});
                    },
                    content:'存在未审核业务单据，盘点会造成差异过大的情况，请确认是否继续?'
                  })
                }else if(err.data.errcode == 39){
                    this.newlyadded = false
                    this.$toasted.show(err.data.errmsg)
                }
             }
          })
    }   
    /**
     * 数据整理
     */  
    private datasorting(){ 
      this.service.getDataSorting().then(res=>{  
          this.newlyadded = false
          this.$router.push('/stocktaking');
          this.$toasted.show('操作成功！')
      },err=>{
          this.$toasted.show(err.message)
      })
    }
    /**
     * 查询盘库单
     */
    private query(){
      this.isSearch = !this.isSearch;
      this.isSearch?this.showMask():this.hideMask();
    }
    /**
     * 查询结果页
     */
    private toSearch(){
        let datails={
          "begin_date":this.searchParam.startDate || null,
          "bill_no":this.searchParam.billNumber || null,
          "end_date" : this.searchParam.endDate || null,      
          "warehouse_id": this.searchParam.selectedWarehouse || null,
        }
        this.service.getEnquiryList(datails).then(res=>{ 
          this.hideMask();     
          this.isSearch = false;
          this.$router.push({name:'QueryResult'});
          if(!this.InterfaceSysTypeBOH){
              this.cache.save(CACHE_KEY.INVENTORY_RESULT,JSON.stringify(res.data.data));
          }else{
            this.cache.save(CACHE_KEY.INVENTORY_RESULT,JSON.stringify(res.data));
            this.$router.push({name:'QueryResult'});
          }
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
    .ezt-header{
      padding: 0;
      height: 45px;
      align-items: center;
    }
    .ezt-add-content{
      padding-bottom: 0px;
    }
    .main-menu{
      background-color: #F1F6FF;
    }
    .add{
      i{
        margin-right: 10px;
      }
    }
    .receive-dc-list{
      position: relative;
      .return-list-title{
          display: block;
          margin-left: 10px;
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
        }
      }
    }
    .receive-icon-bottom{
      .businessDate{
        flex:1;
      }
      .submit{
        width: 70px;
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        color: #1188FC;
        border: 1px solid #1188FC;
        border-radius: @border-radius;
        cursor: pointer;
        display: flex;
        justify-content: center;
      }
   }
    .ezt-action-point{
      margin-top: 10px;
      width: 20px;
      height: 26px;
      display: inline-block;
    } 
    //左侧滑动删除
    .ezt-detail-del{
        position: absolute;
        right: -11px;
        width: 50px;
        height: 190px;
        font-size: 25px;
        display: flex;
        align-items: center;
        top: 0;
     }
    .ezt-list-show{
      position: relative;
      transition: transform .5s;
      background: #fff;
      z-index: 2;
    }
    .swipe-transform{
      transform: translateX(-50px);
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
        li:nth-child(5) i{
            background-image: url("../../../assets/images/intentory_ico_month.png")
        }
        li:last-child{
          border-bottom:none;
        }
      }
    }   
  }
</style>
