<!--选择物品-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title=''>
       <div slot="action">
         <span class="search-title">

         </span>
       </div>
    </ezt-header>    
    <div class="ezt-main">
      <div class="ezt-add-content">
         
       
      </div> 
      <ezt-footer>
        <div class="ezt-foot-temporary" slot="confirm">
          <div class="ezt-foot-button">
            <a href="javascript:(0)" class="ezt-foot-storage" @click="confirmReceive">已选择货品</a>  
            <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive">去提交</a>   
          </div>  
        </div>       
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
    private title:String = '';
    private service: ReceiveGoodService;
    private pager:Pager;
    private getGoodList:INoopPromise
    private hideMask:()=>void;
    private showMask:()=>void;
    // private updateUser:INoop;
    private list:any[] = [];
    private goodList:any[] = [];

    private tabList:TabList = new TabList();
    private isDirect:boolean = false; //是否可直拨弹框
    private orderType:any[] = [{
      name:"合同采购单",
      type:"q"
    },{
      name:"采购单",
      type:"m"
    }];
    created() {     
       this.pager = new Pager()
       this.service = ReceiveGoodService.getInstance();
       this.goodList = [];
      //  this.getGoodList();
    }

    mounted(){      
      this.title = this.$route.params.type 
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
    /**
    *可直拨
     */
    private handlerDirect(){
      this.isDirect = true;
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
 //物料信息
    .good-detail-content{
        text-align: left;
        margin: 8px 10px;
        padding: 12px 10px 12px 15px;
        background: #FFFFFF;
        border: 1px solid #DDECFD;
        box-shadow: 0 0 20px 0 rgba(71,66,227,0.07);
        display: flex;
        flex: row;
        flex-direction: column;
    }
    .good-detail-l{
        display: inline-block;
        flex:.8;
    }
    .good-detail-l>div{
       display:flex;
       flex-direction: row;
    }
    .good-detail-l>div>span{
       flex:1;
    }
    .good-detail-r{
        display: inline-block;
        display:flex;
    }
    .good-detail-num{
        display: inline-block;
        width: 100%;
        text-align: center;
        font-size: 20px;
        color: #FF885E;
        letter-spacing: 0;
    }
    .good-detail-name{
        font-size: 14px;
        color: #395778;
        letter-spacing: 0;
        display: flex;
    }
    .good-detail-sort{
        font-size: 13px;
        color: #5F7B9A;
        letter-spacing: 0;
        display: flex;
        flex-direction: row;
    }
    .good-detail-billno,.good-num-t{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
    }
    .good-num-t{
        display: inline-block;
        text-align: center;
        width: 100%;
    }
    .ezt-detail-good{
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
    }
    //物料明细结束 
    .ezt-detail-good input{
      width: 50px;
    }
    .icon-dail{
      flex: .1;
      background: pink;
      display: inline-block;
      height: 20px;
      border: 1px solid #ccc;
      // width: 20px;
      text-align: center;
    }
    .park-input{
      display: flex;
      flex:1;
    }
    .park-input span{
      flex:.2;
    }
    .title-search-name.remark{
      margin-left: 10px;
    }
    //直拨仓库
    .good-warehouse{
        display: flex;
        flex-direction: row;
        padding: 4px;
        .warehouse-list{
            flex: 1;
             text-align: left;
             margin-left: 10px;
            .warehouse-isDefault{           
                display: inline-block;               
                        
            }            
        }       
    }
    .warehouse-title-num{
      display: flex;
      flex-direction: column;
      background: #ccc;
    }
    .good-warehouse-num{
      margin-left: 10px;
      color: #95A7BA;
      letter-spacing: 0;
    }
    .remark-area{
      flex: .8;
    }  
    .title-search-right{
      flex: 2;
      text-align: right;
    } 
</style>
