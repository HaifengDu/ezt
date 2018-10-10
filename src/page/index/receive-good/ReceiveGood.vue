<!--整体页面的头部布局-->
<template>
<div>
  <div class="ezt-page-con"  ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
    <ezt-header :back="true" title="收货" @goBack="goBack">
       <div slot="action">
         <div>
           <span class='ezt-action-point' @click="renderUrl('/addReceiveGood')">
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
        <tab-item class="vux-center" :selected="item.active" v-for="(item, index) in tabList.TabList"
        @on-item-click="tabClick(index)" :key="index">{{item.name}}
        </tab-item>
      </tab>        
      <div class="ezt-add-content">
        <!-- 收货单列表       -->
          <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click="renderUrl('')">
            <div class="receive-icon-title">
            <span class="receive-icon-dcName"></span>
            <span class="return-list-title">{{item.dc_name}}</span> 
            <span class="receive-status">{{tabList.getActive().status==1?'待审核':'已完成'}}</span>
            </div>
            <div class="receive-icon-content">
              <span class="receive-dc-title">订单编号：<span class="receive-dc-content">{{item.bill_no}}</span></span>
              <div style="display:flex">
                <span class="receive-dc-title">到货日期：<span class="receive-dc-content">{{item.arrive_date}}</span></span>
                <span class="receive-dc-title">要货日期：<span class="receive-dc-content">{{item.ask_goods_date}}</span></span>
              </div>
              <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
            </div>
            <div class="receive-icon-bottom">
              <div class="glow-1">
                <span>共{{item.material_size}}件货品<span class="receive-total">合计：￥434</span></span>
              </div>
              <div>
                <span class="receive-ys-btn" v-if="tabList.getActive().status==1">验收</span>
              </div>
            </div>
        </div>
         <span v-if="allLoaded">已全部加载</span>          
      </div>
    </div>         
  </div>
   <div v-if="isSearch" class="search-dialog">
      <ul class="ezt-title-search">
        <li class="select-list">
        <span class="title-search-name ">收货类型：</span>
        <span class="title-select-name item-select">
          <select name="" id="" placeholder="请选择" class="ezt-select">
            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
        <li class="select-list">
        <span class="title-search-name ">来货单位：</span>
        <span class="title-select-name item-select">
          <select name="" id="" placeholder="请选择" class="ezt-select">
            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
      <li>
        <span class="title-search-name">收货日期：</span>
        <span>
          <ezt-canlendar placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
            <span>至</span>
          <ezt-canlendar placeholder="结束时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
        </span>
      </li>
      <li class="select-list">
        <span class="title-search-name ">仓库：</span>
        <span class="title-select-name item-select">
          <select name="" id="" placeholder="请选择" class="ezt-select">
            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
          </select>
        </span>
      </li>
      <li>
        <span class="title-search-name">源单号：</span>
        <input type="text" class="ezt-middle">
      </li>
        <li>
        <span class="title-search-name">单据或物料：</span>
        <input type="text" class="ezt-middle">
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
import Pager from '../../../common/Pager';
import {TabItem,LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../../helper/maskMixin";
import { INoop, INoopPromise } from '../../../helper/methods';
import { TabList } from '../../../common/ITab';
import { ReceiveGoodService} from '../../../service/ReceiveGoodService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{
     TabItem
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
      //  'goodList':'receiveGood/goodList'
     })
   },
  //  methods:{
  //    ...mapActions({
  //      'getGoodList':"receiveGood/getGoodList"
  //    })
  //  }
})
export default class ReceiveGood extends Vue{
    private cache = CachePocily.getInstance(ECache.LocCache);
    private selected:String = 'deliver';
    private service: ReceiveGoodService;
    private pager:Pager;
    private getGoodList:INoopPromise
    private addMaskClickListener:(...args:any[])=>void;
    private hideMask:()=>void;
    private showMask:()=>void;
    // private updateUser:INoop;
    private goodList:any[] = [];//列表页list数据
    private allLoaded:boolean= false;//数据是否已经全部加载完
    private isSearch:boolean= false; //搜索的条件
    private searchParam:any={};//搜索时的查询条件
    private confirmGoodInfo:any={};//修改页面信息
    private detailList : any={};//详情

    private tabList:TabList = new TabList();
    private orderType:any=[{
      name:'仓库1',
      id:'01'
    }]
    created() {
      this.tabList.push({
        name:"待收货",
        status:1,
        active:true,
      });
      // this.tabList.push({
      //   name:"待入库",
      //   status:2,
      //   active:false
      // });
      this.tabList.push({
        name:"已完成",
        status:3,
        active:false
      });
       this.pager = new Pager()
       this.service = ReceiveGoodService.getInstance();
       this.goodList = [];
       this.searchParam = {};
       console.log(this.tabList,'tabList0000')
      //  this.getGoodList();
    }

    mounted(){      
      this.getList();
      this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
        this.isSearch=false; 
        this.hideMask();
      }); 
      if(this.$route.params.purStatus=="已完成"){//tab 哪个是选中状态
       this.tabList.TabList.forEach((item,index)=>{
         if(item.name == this.$route.params.purStatus){
           item.active = true;
         }else{
           item.active = false;
         }
       })
      } 
    }
    //详情页跳转
    private renderUrl(info:string){
      if(info){
         this.$router.push(info);
         return false;
      }
      if(this.tabList.getActive().status==1){
        this.confirmGoodInfo={
          bill_no:'00111111',
          billType:'合同采购',
          warehouse:"仓库中心1",
          remark:'在途中',
          goodList:[{
            id:21,
            name:'牛肉',
            price:'15',
            utilname:'KG',
            num:2,
            roundValue:{//可直拨的数据
              num: 10,
              numed:0,
              list:[{
                name:'仓库一号',
                num:0
              },{
                name:'仓库二号',
                num:0
              }]
            }
          },{
              id:2,
              name:'白菜',
              price:'1.5',
              utilname:'KG',
              num:3,
              roundValue:{//可直拨的数据
                num: 10,
                numed:0,
                list:[{
                  name:'仓库一号',
                  num:0
                },{
                  name:'仓库二号',
                  num:0
                }]
              }
          }]
        }
        this.cache.save(CACHE_KEY.RECEIVE_BILLTYPE,JSON.stringify("采"))//配、直、调、采
        this.cache.save(CACHE_KEY.RECEIVE_ADDINFO,JSON.stringify(this.confirmGoodInfo));
        this.cache.save(CACHE_KEY.RECEIVE_ADDBEFOREINFO,JSON.stringify(this.confirmGoodInfo));
        this.$router.push('/comfirmAccept');
      }else if(this.tabList.getActive().status==3){
        this.detailList = {
          dc_name:"配送中心-8店",
          bill_no:"000111aab",
          goodList:[{
            name:"猪肉",
            sort:"规格",
            price:12,
            unitName:"KG",
            billNo:"003222",
            amt: 360,
            remark:"这是水果",
            num:3,
            directWarehouse:[{
                name:"仓库1",
                num:1,
            },{
                name:"仓库2",
                num:2,
            },{
                name:"仓库3",
                num:3,
            },{
                name:"仓库4",
                num:66
            }]
            },{
                name:"大猪蹄子",
                sort:"规格",
                price:22,
                unitName:"KG",
                billNo:"003222",
                amt: 660,
                remark:"这是肉",
                num: 6,
                directWarehouse:[{
                    name:"上海仓库1",
                    num:1,
                },{
                    name:"北京仓库2",
                    num:2,
                },{
                    name:"軣咕咕3",
                    num:3,
                },{
                    name:"仓库4",
                    num:66
                }]
            }]
        }
        this.cache.save(CACHE_KEY.RECEIVE_DETAILLIST,JSON.stringify(this.detailList));
        this.$router.push('/checkDetail');
      }
      
    }
  /**
   * computed demo
   */
    private get Total(){
      return this.goodList.reduce((ori,item)=>{
        return ori.uprice+item;
      },0);
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
        if(this.pager.getPage().limit>res.data.data.length){
          this.allLoaded=true;
        }else{
          this.goodList=this.goodList.concat(res.data.data);
        }
        setTimeout(()=>{
          this.$vux.loading.hide();
          this.hideMask();
        },500); 
      },err=>{
          this.$toasted.show(err.message);
      })
      this.pager.setLimit(20);
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
        this.goodList=res.data.data;
        setTimeout(()=>{
          this.$vux.loading.hide();
          this.hideMask();
        },400); 
        },err=>{
          this.$toasted.show(err.message);
      });
    }
    //搜索选择的条件显示/隐藏
    private searchTitle(){
      this.isSearch = !this.isSearch;
      this.isSearch?this.showMask():this.hideMask();
    }
    private toSearch(){
      this.isSearch = false;
      this.hideMask();
      this.$router.push({name:'SearchReceiveGood',params:{obj:this.searchParam}});
    }
    private goBack(){
      this.$router.push('/');
    }
   
}
</script>

<style lang="less" scoped> 
 //tab切换颜色设置
  .mint-tab-item.is-selected .deliver {
    color: #54B1FD;
    border-bottom: 2px solid #54B1FD;
    padding: 3px 6px;
  }

  .mint-tab-item.is-selected .purchase {
    color: #6EDB90;
    border-bottom: 2px solid #6EDB90;
    padding: 3px 6px;
  }

  .mint-navbar .mint-tab-item.is-selected {
    border: none;
  }

  .mint-navbar .mint-tab-item {
    padding: 7px 0;
  }
  .mint-navbar{
    display: flex;
  } 
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
    //搜索弹框
    .search-dialog{
      width: 100%; 
      position:absolute;
      top:45px; 
      z-index:10001;
    }
    .oo{
      display: inline-block;
      width:10px;
      height: 10px;
    }
</style>
