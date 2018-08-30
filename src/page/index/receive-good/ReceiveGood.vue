<!--整体页面的头部布局-->
<template>
<div class="ezt-page-con">
    <ezt-header :back="true" title="收货">
       <div slot="action">
         <div class="add">
          <i class="fa fa-plus" aria-hidden="true"></i> 
          <i class="fa fa-search" aria-hidden="true"></i>
         </div>
       </div>
    </ezt-header>    
    <div class="ezt-main">       
      <tab :line-width=2 active-color='#fc378c'>
        <tab-item class="vux-center" :selected="item.active" v-for="(item, index) in tabList.TabList"
        @on-item-click="tabClick(index)" :key="index">{{item.name}}</tab-item>
      </tab>        
      <div class="ezt-add-content" ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10"> 
        <!-- 收货单列表       -->
          <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click="renderUrl('/comfirmAccept')">
          <div class="receive-icon-title">
            <span class="receive-icon-dcName"></span>
            <span class="return-list-title">{{item.dc_name}}</span> 
            <span class="receive-status">待审核</span>
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
              <span class="receive-ys-btn">验收</span>
            </div>
          </div>
        </div>
         <span v-if="allLoaded">已全部加载</span>
      </div>    
    </div>
      <!-- 收货详情 -->
    <div>
      <router-view/>
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
declare var mobiscroll:any;
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
    private selected:String = 'deliver';
    private service: ReceiveGoodService;
    private pager:Pager;
    private getGoodList:INoopPromise
    private hideMask:()=>void;
    private showMask:()=>void;
    // private updateUser:INoop;
    private goodList:any[] = [];
    private allLoaded:boolean= false;

    private tabList:TabList = new TabList();
    created() {
      this.tabList.push({
        name:"待收货",
        status:1,
        active:true
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
      //  this.getGoodList();
    }

    mounted(){      
      this.getList();
    }
    //详情页跳转
    private renderUrl(info:string){
      this.$router.push(info);
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

</style>
