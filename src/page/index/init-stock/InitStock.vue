<!--库存初始化列表页面-->
<template>
<div>
  <div class="ezt-page-con"  ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
    <ezt-header :back="true" title="库存初始化" @goBack="goBack">
       <div slot="action">
         <div class="add">
           <span class='ezt-action-point' @click="renderUrl('/addInitStock')">
            <i class="fa fa-plus" aria-hidden="true" ></i>
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
          <div class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click.stop="renderUrl('')">
            <div class="ezt-list-show" v-swipeleft="handlerLeft.bind(this,item)"  v-swiperight="handlerRight.bind(this,item)" :class="{'swipe-transform':item.active}" >
              <div class="receive-icon-title">
                <span class="receive-icon-dcName"></span>
                <span class="return-list-title">初始化单号：{{item.bill_no}}</span> 
                <span class="receive-status">{{tabList.getActive().status==1?'待审核':'已完成'}}</span>
              </div>
              <div class="receive-icon-content">
                <span class="receive-dc-title">仓库：<span class="receive-dc-content">北京稻香村仓库</span></span>
                <div style="display:flex">
                  <span class="receive-dc-title">初始化日期：<span class="receive-dc-content">{{item.arrive_date}}</span></span>
                  <span class="receive-dc-title">金额：<span class="receive-dc-content">{{item.price}}</span></span>
                </div>
                <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
              </div>
              <div class="receive-icon-bottom">
                <div class="glow-1">
                  <!-- <span>共{{item.material_size}}件货品<span class="receive-total">合计：￥434</span></span> -->
                </div>
                <div>
                  <span class="receive-ys-btn" v-if="tabList.getActive().status==1">审核</span>
                </div>
              </div>
            </div>
            <div class="ezt-list-del" @click.stop="deleteBill(item)">删除</div>
        </div>
         <span v-if="allLoaded">已全部加载</span>          
      </div>
    </div>
    <ezt-footer v-if="tabList.getActive().status=='1'">
      <div class="mine-bot-btn" slot="confirm" @click="handlerInitStock">
        <span class="ezt-lone-btn">初始化完毕</span>
      </div>  
    </ezt-footer>    
  </div>
   <div>
     <x-dialog v-model="isInit" class="dialog-demo">
       <div class="confirm-title">                                
           {{user.auth.store_name}}初始化
        </div> 
        <!-- <div > -->
        <ul class="ezt-dialog-content">
          <li>
            <span><span>仓库：</span>消费品仓库1</span>
            <span><span>总金额：</span>￥991</span>
          </li>
          <li>
            <span><span>仓库：</span>消费品仓库1</span>
            <span><span>总金额：</span>￥991</span>
          </li>      
        </ul>
        <div class="dialog-msg">
            <div><span>初始化日期：</span>2018-9-4</div>
            <div >是否确认该店初始化数据已全部录入完毕？</div>
        </div>
        <!-- </div> -->
       <div class="ezt-dialog-footer">
          <span @click="isInit=false" class="ezt-cancel-btn">取消</span>
          <span class="ezt-confirm-btn" @click="handlerInitAll">确定</span>
        </div> 
     </x-dialog>
   </div>
    <!-- 返回时提示保存信息 -->
    <confirm v-model="isFinish" @on-confirm="isFinishConfirm"  :show-cancel-button="false">
      <span class="confirm-title">
        <i class="fa fa-info-circle confirm-info-icon" aria-hidden="true"></i>库存初始化完成</span>
        <div class="confirm-content">
          <p style="text-align:center;">{{confirmTitle}}</p>
        </div>        
    </confirm> 
    <!--待审核状态下的列表数据删除提示 -->
   <confirm v-model="isDelete" @on-confirm="Confirm" @on-cancel="Cancel">
        <p style="text-align:center;">是否要删除该单据？</p>
   </confirm>
</div> 
</template>

<script lang="ts">
import Vue from "vue";
import ErrorMsg from "../model/ErrorMsg";
import { Component, Watch } from "vue-property-decorator";
import Pager from "../../../common/Pager";
import IUser from "../../../interface/IUserModel"
import { TabItem, LoadingPlugin } from "vux";
import { mapActions, mapGetters } from "vuex";
import { maskMixin } from "../../../helper/maskMixin";
import { INoop, INoopPromise } from "../../../helper/methods";
import { TabList } from "../../../common/ITab";
import { InitStockService } from "../../../service/InitStockService";
import { CachePocily } from "../../../common/Cache";
import {ECache} from '../../../enum/ECache';
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
  components: {
    TabItem
  },
  mixins: [maskMixin],
  computed: {
    ...mapGetters({
      'user':'user',
      'isFirstStore':'initStock/isFirstStore'//是否是新门店未初始化
    })
  }
  //  methods:{
  //    ...mapActions({
  //      'getGoodList':"receiveGood/getGoodList"
  //    })
  //  }
})
export default class InitStock extends Vue {
  private cache = CachePocily.getInstance(ECache.LocCache);
  private confirmTitle:string="";//确认框里的确认信息通过后台动态数据
  private user:IUser;
  private isInit:boolean=false;//列表页初始化按钮弹出框
  private isFinish:boolean=false;//是否初始化完成提示
  private service: InitStockService;
  private pager: Pager;
  private getGoodList: INoopPromise;
  private addMaskClickListener: (...args: any[]) => void;
  private hideMask: () => void;
  private showMask: () => void;
  // private updateUser:INoop;
  private goodList: any[] = []; //列表页list数据
  private allLoaded: boolean = false; //数据是否已经全部加载完
  private isSearch: boolean = false; //搜索的条件
  private deleteItem:any={};//删除时存储所删除数据
  private isDelete:boolean = false;  //删除单据提示
  private searchParam: any = {}; //搜索时的查询条件
  private confirmGoodInfo:any={};//修改页面信息
  private detailList : any={};//详情


  private tabList: TabList = new TabList();
  private orderType: any = [
    {
      name: "仓库1",
      id: "01"
    }
  ];
  created() {
    this.tabList.push({
      name: "待审核",
      status: 1,
      active: true
    });
    // this.tabList.push({
    //   name:"待入库",
    //   status:2,
    //   active:false
    // });
    this.tabList.push({
      name: "已完成",
      status: 3,
      active: false
    });
    this.pager = new Pager();
    this.service = InitStockService.getInstance();
    this.goodList = [];
    this.searchParam = {};
    //  this.getGoodList();
  }

  mounted() {    
    this.addMaskClickListener(() => {
      //点击遮罩隐藏下拉
      this.isSearch = false;
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
    this.getList();
  }
     // 点击删除按钮
    private deleteBill(item:any){
        this.deleteItem = item;
        this.isDelete = true;
    }
    // 删除提示框
     private Confirm(){
         this.deleteSection(this.deleteItem);
     }
     private Cancel(){
        this.isDelete = false;
        let newIndex = this.goodList.findIndex((info:any,index:any)=>{
          return this.deleteItem.id == info.id;
        })
        this.goodList[newIndex].active = false;
     }
    // 左滑删除某一项
    private deleteSection(item:any){
      let newIndex = this.goodList.findIndex((info:any,index:any)=>{
        return item.id == info.id;
      })
      this.goodList.splice(newIndex,1);
    }
  private handlerLeft(item:any){
      const status = this.tabList.getActive().status;
      if(status =="1"){
         this.$set(item,'active',true);
      }     
     
    }
    private handlerRight(item:any){
      const status = this.tabList.getActive().status;
      if(status == '1'){
        this.$set(item,'active',false);
      }
     
  } 
  /**
   * 初始化完毕
   */
  private handlerInitStock(){
    this.isInit=true;
  }
  //详情页跳转
  private renderUrl(info: string) {
    if (info) {
      this.$router.push(info);
      return false;
    }
    if (this.tabList.getActive().status == 1) {
      this.confirmGoodInfo={
        bill_no:'00111111',
        costType:'0',
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
      this.cache.save(CACHE_KEY.RECEIVE_ADDINFO,JSON.stringify(this.confirmGoodInfo));
      this.cache.save(CACHE_KEY.RECEIVE_ADDBEFOREINFO,JSON.stringify(this.confirmGoodInfo));
      this.$router.push("/initAudit");
    } else if (this.tabList.getActive().status == 3) {
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
            supplier:"上海供应商2",
            rate:30
            },{
                name:"大猪蹄子",
                sort:"规格",
                price:22,
                unitName:"KG",
                billNo:"003222",
                amt: 660,
                remark:"这是肉",
                num: 6,
                supplier:"河南供应商",
                rate:20
            }]
        }
      this.cache.save(CACHE_KEY.INITSTOCK_DETAILLIST,JSON.stringify(this.detailList));
      this.$router.push("/initDetail");
    }
  }
  /**
   * computed demo
   */
  private get Total() {
    return this.goodList.reduce((ori, item) => {
      return ori.uprice + item;
    }, 0);
  }
  private tabClick(index: number) {
    this.tabList.setActive(index);
    this.allLoaded = false;
    (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
    this.pager.resetStart(); //分页加载还原pageNum值
    this.getList();
  }
  //下拉加载更多
  private loadMore() {
    if (!this.allLoaded) {
      this.showMask();
      this.$vux.loading.show({
        text: "加载中.."
      });
      this.pager.setNext();
      this.service.getGoodList(status as string, this.pager.getPage()).then(
        res => {
          if (this.pager.getPage().limit > res.data.data.length) {
            this.allLoaded = true;
          } else {
            this.goodList = this.goodList.concat(res.data.data);
          }
          setTimeout(() => {
            this.$vux.loading.hide();
            this.hideMask();
          }, 500);
        },
        err => {
          this.$toasted.show(err.message);
        }
      );
      this.pager.setLimit(20);
    }
  }
  //获取列表
  private getList() {
    const status = this.tabList.getActive().status;
    this.service.getGoodList(status as string, this.pager.getPage()).then(
      res => {
        this.showMask();
        this.$vux.loading.show({
          text: "加载中..."
        });
        this.goodList = res.data.data;
        setTimeout(() => {
          this.$vux.loading.hide();
          this.hideMask();
        }, 400);
      },
      err => {
        this.$toasted.show(err.message);
      }
    );
  }
  //搜索选择的条件显示/隐藏
  private searchTitle() {
    this.isSearch = !this.isSearch;
    this.isSearch ? this.showMask() : this.hideMask();
  }
  private toSearch() {
    this.isSearch = false;
    this.hideMask();
    this.$router.push({
      name: "SearchReceiveGood",
      params: { obj: this.searchParam }
    });
  }
  //初始化数据 确认操作
  private handlerInitAll(){
    if(true){
      this.confirmTitle="我们已经帮您日结到xx月xx日，您可以开始录入单据了。"
      this.isInit=false;
      this.isFinish=true;     
    }
  }
  private isFinishConfirm(){
    this.isFinish=false;
  }
  private goBack() {
    // if(this.isFirstStore){
    //   this.$router.push("/initSet");
    // }else{
      this.$router.push("/");
    // }
    
  }
}
</script>

<style lang="less" scoped>
.mine-bot-btn{
    width: 100%;
    // position: absolute;
    // bottom: 60px;
    .ezt-lone-btn{
      display: inline-block;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      padding: 10px 120px;
      border-radius: 40px;
      background-image: -webkit-gradient(linear, left top, right top, from(#5A12CC), to(#3C82FB));
      background-image: linear-gradient(90deg, #018BFF 0%, #4A39F3 100%);
      -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
      box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);   
    }
  }
  .dialog-demo{
    // .ezt-dialog-header{
    //   padding: 6px;
    //   font-size: 16px;
    //   font-weight: 550;
    // }
    .ezt-dialog-content{
      max-height: 240px;
      overflow-x: auto;
      padding: 20px;
      text-align: left;
      li{
        line-height: 22px;
        color: #5F7B9A;       
      }     
    }
    .dialog-msg{
      color: #395778;
      font-size: 16px;
      display: inline-block;
      padding: 10px 20px 20px;
      text-align: left;
    }
    .ezt-dialog-footer{
      margin-bottom: 20px;
    }
  }
  // 左侧滑动删除
.swipe-transform{
    transform: translateX(-50px);
}
.receive-dc-list{
  position: relative;
}
.ezt-list-del{
    position: absolute;
    right: 12px;
    top: 42px;
    background: pink;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
}
//左侧滑动删除
  .ezt-list-show{
    position: relative;
    transition: transform .5s;
    background: #fff;
    z-index: 2;
  }
</style>
