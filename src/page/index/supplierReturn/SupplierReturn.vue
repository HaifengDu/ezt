<!--整体页面的头部布局-->
<template>
<div class="ezt-page-con" ref="listContainer" 
  v-infinite-scroll="loadMore"
  :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
  infinite-scroll-distance="10">
    <ezt-header :back="true" title="退货" @goBack="goBack" :isInfoGoback="true">
      <div slot="action">
        <div>
          <span class='ezt-action-point' @click="addPage('/supplierReturnAdd')">
          <i class="fa fa-plus" aria-hidden="true" ></i>
          </span>
        <span class='ezt-action-point' @click="searchTitle">
          <i class="fa fa-search" aria-hidden="true"></i>
        </span>          
        </div>
      </div>
    </ezt-header>    
    <div class="ezt-main">       
      <tab :line-width=2 active-color='#fc378c'>
        <tab-item 
          class="vux-center" 
          :selected="item.active" 
          v-for="(item, index) in tabList.TabList"
          @on-item-click="tabClick(index)" 
          :key="index">
            {{item.name}}
        </tab-item>
      </tab>         
      <div class="ezt-add-content">  
        <!--无任何数据时 -->
        <div v-if="goodList.length==0" class="done-none">
            <div></div>
            <span>暂无记录</span>
        </div>     
        <!-- 退货单列表       -->
        <div v-if="goodList.length>0" class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click="toPage(item,'')">
            <div class="ezt-list-show" v-swipeleft="handlerSwipe.bind(this,item,true)" 
              v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}" >
              <div class="receive-icon-title">
                <span class="receive-icon-dcName"></span>
                <span class="return-list-title">{{item.dc_name || item.billNo}}</span> 
                <span class="receive-status">{{item.arrive_date || item.busiDate}}</span>
              </div>
              <div class="receive-icon-content">
                <span v-if="!InterfaceSysTypeBOH" class="receive-dc-title">单号：<span class="receive-dc-content">{{item.bill_no}}</span></span>
                <span v-if="!InterfaceSysTypeBOH" class="receive-dc-title">仓库：<span class="receive-dc-content">{{item.ask_goods_date}}</span></span>   
                <span v-if="InterfaceSysTypeBOH"  class="receive-dc-title">机构名称：<span class="receive-dc-content">{{item.outOrganName}}</span></span>
                <span v-if="InterfaceSysTypeBOH"  class="receive-dc-title">供应商/配销中心：<span class="receive-dc-content">{{item.businessName}}</span></span>  
                <span v-if="InterfaceSysTypeBOH"  class="receive-dc-title">退货类型：
                     <span class="receive-dc-content" v-if="item.outType === 'SCM_OUT_TYPE_DISTRIBUTE'">配送退货</span>
                     <span class="receive-dc-content" v-if="item.outType === 'SCM_OUT_TYPE_SUPPLIER'">供应商退货</span>
                     <span class="receive-dc-content" v-if="item.outType === 'SCM_OUT_TYPE_OTHER_RETURN'">其他退货</span>
                </span>               
                <div style="display:flex" v-if="!InterfaceSysTypeBOH">                
                  <span class="receive-dc-title">数量：<span class="receive-dc-content">{{item.exportNum}}</span></span>
                  <span class="receive-dc-title">金额：<span class="receive-dc-content">￥{{item.exportNum}}</span></span>
                </div>
                <span class="receive-dc-title" v-if="InterfaceSysTypeBOH">创建人：<span class="receive-dc-content">{{item.creator}}</span></span>
                <span class="receive-dc-title" v-if="InterfaceSysTypeBOH">创建日期：<span class="receive-dc-content">{{item.createDate}}</span></span>
                <span class="receive-dc-title" v-if="!InterfaceSysTypeBOH">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
                <span class="receive-dc-title">备注：<span class="receive-dc-content">{{item.remark || item.memo}}</span></span>
              </div>     
            </div> 
            <div class="ezt-list-del" @click.stop="deleteBill(item)">
              <i class="fa fa-trash" aria-hidden="true"></i>
            </div>     
        </div>
        <span v-show="allLoaded">已全部加载</span>  
      </div>    
    </div>
    <div v-show="isSearch" class="search-dialog">
      <ul class="ezt-title-search">
        <li class="select-list">
          <span class="title-search-name ">退货类型：</span>
          <span class="title-select-name item-select">
            <select placeholder="请选择" class="ezt-select" v-model="searchParam.returnType" @change="selectReturn">
              <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
              <option :value="item.id" :key="index" v-for="(item,index) in pullList.returnType">{{item.typeName}}</option>
            </select>
          </span>
        </li>
        <li class="select-list" v-if="searchParam.returnType === 'SCM_OUT_TYPE_DISTRIBUTE'">
          <span class="title-search-name ">配送中心：</span>
          <span class="title-select-name item-select">
            <select placeholder="请选择" class="ezt-select" v-model="searchParam.supplier">
              <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
              <option :value="item.id" :key="index" v-for="(item,index) in pullList.supplierList">{{item.name || item.supplierName}}</option>
            </select>
          </span>
        </li>
        <li class="select-list" v-if="searchParam.returnType === 'SCM_OUT_TYPE_SUPPLIER' || searchParam.returnType === 'SCM_OUT_TYPE_OTHER_RETURN'">
          <span class="title-search-name ">供货机构：</span>
          <span class="title-select-name item-select">
            <select placeholder="请选择" class="ezt-select" v-model="searchParam.supplier">
              <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
              <option :value="item.id" :key="index" v-for="(item,index) in pullList.supplierList">{{item.name || item.supplierName}}</option>
            </select>
          </span>
        </li>
        <li>
          <span class="title-search-name">单据日期：</span>
          <span>
            <ezt-canlendar ref="startDate" :max="searchParam.endDate" :defaultValue="new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd')"
              placeholder="开始时间" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
              <span>至</span>
            <ezt-canlendar ref="endDate" :min="searchParam.startDate" :defaultValue="new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')"
              placeholder="结束时间" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
          </span>
        </li>
        <li>  
          <span class="title-search-name">单据或物料：</span>   
           <!-- v-on:input="handlerChangeNo($event)" -->
          <input type="text" placeholder="输入单据号和物料名称查询" class="ezt-middle"  v-model="searchParam.billNo">  
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
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import { FactoryService } from '../../../factory/FactoryService'
import { ISupplierReturnService } from '../../../interface/service/ISupplierReturnService';
import Pager from '../../../common/Pager';
import {TabItem,LoadingPlugin} from 'vux'
import { TabList } from '../../../common/ITab';
import {maskMixin} from "../../../helper/maskMixin";
import noInput from '../../../mixin/noInput';
import { mapActions, mapGetters } from 'vuex';
import { INoop, INoopPromise } from '../../../helper/methods';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
declare var mobiscroll:any;
@Component({
  components:{
    TabItem
  },
  mixins:[maskMixin,noInput],
   computed:{
     ...mapGetters({
       'InterfaceSysTypeBOH':'InterfaceSysTypeBOH',   //true BOH接口  false saas接口
      //  'goodList':'returnGood/goodList'
     })
   },
   methods:{
     ...mapActions({
      //  'getGoodList':"returnGood/getGoodList"
     })
   }
})
export default class ReturnGood extends Vue{
  private cache = CachePocily.getInstance();
  private service: ISupplierReturnService;
  private pager:Pager;
  private getGoodList:INoopPromise;
  private InterfaceSysTypeBOH:boolean;
  private addMaskClickListener:(...args:any[])=>void;
  private hideMask:()=>void;   
  private showMask:()=>void;
  /**
   * 列表页list数据
   */
  private goodList:any[] = [];
  /**
   * 数据是否已经全部加载完
   */
  private allLoaded:boolean= false;
  /**
   * 搜索显示
   */
  private isSearch:boolean= false; 
  /**
   * 搜索时的查询条件
   */
  private searchParam:any={
    startDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
    endDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd'),
    returnType:"",
    supplier:""
  };
  private tabList:TabList = new TabList();
  /**
   * 下拉列表
   */
  private pullList : any= {
    returnType: [{     //退货类型
        id:'SCM_OUT_TYPE_DISTRIBUTE',
        typeName:'配送退货'
    },{
        id:'SCM_OUT_TYPE_SUPPLIER',
        typeName:'供应商退货'
    },{
        id:'SCM_OUT_TYPE_OTHER_RETURN',
        typeName:'其他退货'
    }],
    supplierList: [],
  };


  created() {     
    /**
     * Saas版本
     */
    if(!this.InterfaceSysTypeBOH){  
      this.tabList.push({
        name:"待审核",
        status:1,
        active:true,
      },{
        name:"已完成",
        status:3,
        active:false
      });
    }
    /**
     * BOH版本
     */
    if(this.InterfaceSysTypeBOH){  
       this.tabList.push({
        name:"待审核",
        status:'SCM_AUDIT_NO',
        active:true,
      },{
        name:"已完成",
        status:'SCM_AUDIT_YES',
        active:false
      });
    }
    this.pager = new Pager().setLimit(10)
    const factory = FactoryService.getInstance().createFactory();
    this.service = factory.createSupplierReturn();
    if(!this.InterfaceSysTypeBOH){
      this.getSupplierList();// 供货机构列表
    }
  }

  mounted(){
    this.getList();   
    this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
      this.isSearch=false; 
      this.hideMask();
    }); 
    if(this.$route.params.purStatus=="已完成"){//tab 哪个是选中状态
      this.tabList.TabList.forEach((item,index)=>{
        item.active = item.name == this.$route.params.purStatus;
      })
    } 
  }
  /**
   * 改变查询的日期
   */
  private selectDateChange(val:any){
    (<any>this.$refs.startDate).setMax(new Date(val));
    (<any>this.$refs.endDate).setMin(new Date(val));
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
   * 获取 供货机构 
   */
  private getSupplierList(){
    this.pullList.supplierList = [{
      name: '退货机构1',
      id:1
    },{
      name: '退货机构2',
      id: 2
    }]
  }
  
  /**
   * 左侧滑动删除
   */
  private handlerSwipe(item:any,active:boolean){
      const status = this.tabList.getActive().status;
      if(status =="1"){
          this.$set(item,'active',active);
      }  
  }
    /**
   * 左滑确认删除单据
   */
  private deleteBill(item:any){
    let _this = this;
    this.$vux.confirm.show({
        // 组件除show外的属性
        onCancel () {
            let newIndex = _this.goodList.findIndex((info:any,index:any)=>{
                return item.id == info.id;
            })
            _this.goodList[newIndex].active = false;
        },
        onConfirm () {
            let newIndex = _this.goodList.findIndex((info:any,index:any)=>{
                return item.id == info.id;
            })
            _this.goodList.splice(newIndex,1);
            _this.getList();
        },
        content:'是否要删除该单据？'
    })
  }
  private addPage(info:string){
     if(info){
          this.$router.push(info);
          return false;
      }
  }
    //详情页跳转
  private toPage(item:any,info:string){
      let confirmGoodInfo = {};
      let detailList = {};
      if(!this.InterfaceSysTypeBOH){
          if(this.tabList.getActive().status==1){
            confirmGoodInfo={
              bill_no:item.bill_no,
              billType:'合同采购',
              warehouse:'01',
              remark:'在途中', 
              returnType:'supplier'        
            }
            this.cache.save(CACHE_KEY.SUPPLIERRETURN_ADDINFO,JSON.stringify(confirmGoodInfo));
            this.$router.push('/supplierReturnAudit');
          }else if(this.tabList.getActive().status==3){
            detailList = {
              dc_name:"配送中心-8店",
              bill_no:"000111aab",         
            }
            this.cache.save(CACHE_KEY.SUPPLIERRETURN_DETAILLIST,JSON.stringify(detailList));
            this.$router.push('/supplierReturnDetail');    
          }
      }else{
          if(this.tabList.getActive().status=='SCM_AUDIT_NO'){
            confirmGoodInfo={
              bill_no:item.bill_no,
              billType:'合同采购',
              warehouse:'01',
              remark:'在途中', 
              returnType:'supplier'        
            }
            this.cache.save(CACHE_KEY.SUPPLIERRETURN_ADDINFO,JSON.stringify(confirmGoodInfo));
            this.$router.push('/supplierReturnAudit');
          }else if(this.tabList.getActive().status=='SCM_AUDIT_YES'){
            this.service.getGoodDetail(item.id,this.pager.getPage()).then(res=>{ 
               this.cache.save(CACHE_KEY.SUPPLIERRETURN_DETAILLIST,JSON.stringify(res.data));
               this.$router.push('/supplierReturnDetail')
            },err=>{
                this.$toasted.show(err.message)
            })
          }
      }
      if(info){
          this.$router.push(info);
          return false;
      }

  }

  private tabClick(index:number){
    this.tabList.setActive(index);
    this.allLoaded=false;
    (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
    this.pager.resetStart();//分页加载还原pageNum值
    this.getList();     
  }
  //下拉加载更多
  private loadMore() {
    if(!this.allLoaded){
      this.showMask();
      this.$vux.loading.show({
        text:'加载中..'
      });
      this.pager.setNext();
      this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{  
         if(!this.InterfaceSysTypeBOH){
              if(this.pager.getPage().limit>res.data.list.length){
                this.allLoaded=true;
              }
              this.goodList = res.data.list;
          }else{
              if(this.pager.getPage().limit>res.data.returnList.length){
                this.allLoaded=true;
              }
              this.goodList = res.data.returnList;
          }
        setTimeout(()=>{
          this.$vux.loading.hide();
          this.hideMask();
        },500); 
      },err=>{
          this.$toasted.show(err.message);
      })
    }     
  }
  //获取列表
  private getList(){
    const status = this.tabList.getActive().status;
    this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{
      this.showMask();
      this.$vux.loading.show({
        text: '加载中...'
        });
      if(!this.InterfaceSysTypeBOH){
          this.goodList=res.data.list;   
      }else{
          this.goodList = res.data.returnList;
      }
      setTimeout(()=>{
        this.$vux.loading.hide();
        this.hideMask();
      },400); 
      },err=>{
        this.$toasted.show(err.message);
    });
  }
   
   /**
    * 根据退货类型显示配送中心或供应商
    */
   private selectReturn(){
      const billType = this.searchParam.returnType || null
      this.service.getReturnType(billType).then(res=>{ 
            this.pullList.supplierList = res.data.organList
        },err=>{
            this.$toasted.show(err.message)
      })
   }


  //搜索选择的条件显示/隐藏
  private searchTitle(){
    this.isSearch = !this.isSearch;  
    this.isSearch?this.showMask():this.hideMask();
  }
  private toSearch(){
    if(!this.InterfaceSysTypeBOH){
        this.isSearch = false;
        this.hideMask();
        this.cache.save(CACHE_KEY.SUPPLIERRETURN_SEARCH,JSON.stringify(this.searchParam));
        this.$router.push('/supplierReturnSearch');
    }else{
        const billType = this.searchParam.returnType || null
        const busiDateBegin = this.searchParam.startDate
        const busiDateEnd =  this.searchParam.endDate
        const supplierId = this.searchParam.supplier || null
        const query = this.searchParam.billNo || null
        this.service.getGoodResult(billType,busiDateBegin,busiDateEnd,supplierId,query,this.pager.getPage()).then(res=>{ 
          this.hideMask();        
          this.isSearch = false;
          if(!this.InterfaceSysTypeBOH){ 
              this.cache.save(CACHE_KEY.SUPPLIERRETURN_RESULT,JSON.stringify(res.data.data));
          }else{
              this.cache.save(CACHE_KEY.SUPPLIERRETURN_RESULT,JSON.stringify(res.data['returnList']));
          }
          this.$router.push('/supplierReturnSearch');
        },err=>{
            this.$toasted.show(err.message)
        })
    }
  }  
  private goBack(){
    this.$router.push("/");
  }
   
}
</script>

<style lang="less" scoped> 
.add{
  font-size: 20px;
  i{
    margin-right: 10px;
  }
}
.ezt-action-point{
  width: 20px;
  height: 26px;
  display: inline-block;
}
.oo{
  display: inline-block;
  width:10px;
  height: 10px;
}
  // 左侧滑动删除
.swipe-transform{
    transform: translateX(-60px);
}
.receive-dc-list{
    position: relative;
}
.ezt-list-del{
  position: absolute;
  right: 12px;
  top: 42px;
  width: 50px;
  height: 50px;
  text-align: center;
  margin: 25px 0px;
  font-size: 22px;
}
//左侧滑动删除
.ezt-list-show{
    position: relative;
    transition: transform .5s;
    background: #fff;
    z-index: 2;
}
</style>
