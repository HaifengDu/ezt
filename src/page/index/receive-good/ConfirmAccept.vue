<!--收货页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title="收货详情">
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main">       
       <!-- 退货清单、收货详情物品列表 开始 -->
       <ul>
         <li>
            <div class="detail-content-list">
              <div class="detail-detaillist-title">
                <div>item</div>
                <span>编码：item.material_num</span>
              </div>
              <div class="detail-detaillist-cot" >
                <div class="detail-list-left">单价：<span class="detail-list-right">￥11</span></div>
                <div class="detail-list-left">规格：<span class="detail-list-right">￥22</span></div>
              </div>
              <div class="detail-detaillist-bot" >
                <span class="detail-list-left">应收：{{3}}</span>
                <span class="detail-act-right"><span>实收：</span><input type="number" value='222'></span>
              </div>
            </div>
         </li>
       </ul>
      <ezt-footer>
        <a href="javascript:(0)" slot="confirm" @click="confirmReceive"> 确认收货</a>       
      </ezt-footer>
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
    private list:any[] = [];
    private goodList:any[] = [];

    private tabList:TabList = new TabList();
    created() {
      this.tabList.push({
        name:"待收货",
        status:1,
        active:true
      });
      this.tabList.push({
        name:"待入库",
        status:2,
        active:false
      });
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
      this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{
        this.showMask();
        // this.$vux.loading.show({
        //   text: '加载中...'
        // })
        if(res.data.errcode==0){
          this.goodList=res.data.data;
          this.hideMask();
        }
      },err=>{

      });
    }

  /**
   * computed demo
   */
    private get Total(){
      return this.list.reduce((ori,item)=>{
        return ori.uprice+item;
      },0);
    }
    /**
     * 确认收货
     */
    private confirmReceive(){
      console.log('确认收货！')
    }

    // private getGoodList(){
    //     this.service.getGoodList(this.pager.getPage()).then(res=>{
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
 
</style>
