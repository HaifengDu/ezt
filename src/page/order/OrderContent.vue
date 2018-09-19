  <!--首页的订单页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="false" title="订单">
      <div slot="action">
         <div class="add">
           <span class='ezt-action-point'>
            <i class="fa fa-plus" aria-hidden="true" ></i>
           </span>
          <span class='ezt-action-point'>
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>          
         </div>
       </div>
    </ezt-header>  
    <div class="ezt-main">      
        <!--内容-->
      <tab :line-width=2 active-color='#fc378c'>
        <tab-item class="vux-center" :selected="item.active" v-for="(item, index) in tabList.TabList"
        @on-item-click="tabClick(index)" :key="index">{{item.name}}
        </tab-item>
      </tab>
      <div class="ezt-add-content main-menu" ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
        <!-- 收货单列表       -->
          <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index">
            <div class="ezt-list-show" v-swipeleft="handlerLeft.bind(this,item)" 
                v-swiperight="handlerRight.bind(this,item)" :class="{'swipe-transform':item.active}">
              <div class="receive-icon-title">
                <span class="receive-icon-dcName"></span>
                <span class="return-list-title">{{item.dc_name}}</span> 
                <span class="receive-status">{{tabList.getActive().status==1?'审核未通过':'再来一单>>'}}</span>
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
            <div class="ezt-list-del" @click="deleteSection(item)">删除</div>
        </div>
         <span v-if="allLoaded">已全部加载</span>          
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import ErrorMsg from "./model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../common/Pager';
import {TabItem,LoadingPlugin} from 'vux'
import { mapActions, mapGetters } from 'vuex';
import {maskMixin} from "../../helper/maskMixin";
import { INoop, INoopPromise } from '../../helper/methods';
import { TabList } from '../../common/ITab';
import {OrderGoodsService} from '../../service/OrderGoodsService.ts';
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
export default class OrderGoods extends Vue{
    private pager:Pager;
    private getGoodList:INoopPromise
    private service: OrderGoodsService;
    private tabList:TabList = new TabList();
    private goodList:any[] = [];//列表页list数据
    private allLoaded:boolean= false;//数据是否已经全部加载完
    private addMaskClickListener:(...args:any[])=>void;
    private hideMask:()=>void;
    private showMask:()=>void;
    created() {
      this.tabList.push({
        name:"待审核",
        status:1,
        active:true,
      });
      this.tabList.push({
        name:"待支付",
        status:2,
        active:false
      });
      this.tabList.push({
        name:"已完成",
        status:3,
        active:false
      });
       this.service = OrderGoodsService.getInstance();
       this.pager= new Pager();
       this.getList();      
    }
    private tabClick(index:number){
      this.tabList.setActive(index);
      this.allLoaded=false;
      (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
      this.pager.resetStart();//分页加载还原pageNum值
      this.getList();     
    }
   /**
   * 左滑删除某一项
   */
    private deleteSection(item:any){
        let newIndex = this.goodList.findIndex((info:any,index:any)=>{
        return item.id == info.id;
        })
        this.goodList.splice(newIndex,1);
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
          (this.goodList||[]).forEach(item=>this.$set(item,'active',false));
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
        (this.goodList||[]).forEach(item=>this.$set(item,'active',false));
        setTimeout(()=>{
          this.$vux.loading.hide();
          this.hideMask();
        },400); 
        },err=>{
          this.$toasted.show(err.message);
      });
    } 
    private handlerLeft(item:any){
      const status = this.tabList.getActive().status;
      if(status =="1"){
         item.active = true;
      }     
     
    }
    private handlerRight(item:any){
      const status = this.tabList.getActive().status;
      if(status == '1'){
        item.active = false;
      }
     
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
    .receive-dc-list{
      position: relative;
    }
    .ezt-action-point{
      width: 20px;
      height: 26px;
      display: inline-block;
    }
    //左侧滑动删除
    .ezt-list-show{
      position: relative;
      transition: transform .5s;
      background: #fff;
      z-index: 2;
    }
    .ezt-list-del{
      position: absolute;
      right: 0px;
      top: 30px;
      width: 50px;
      height: 100px;
      background: pink;
      z-index: 1;
    }
    .swipe-transform{
      transform: translateX(-50px);
    }
</style>
