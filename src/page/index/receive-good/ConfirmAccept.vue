<!--收货修改页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='收货'>
       <div slot="action">
       </div>
    </ezt-header>    
    <div class="ezt-main">       
      <div class="ezt-add-content">
         <ul class="ezt-title-search">
          <li>
            <span class="title-search-name">源单号：</span>
            <input type="text" class="ezt-middle">
          </li>
          <li>
            <span class="title-search-name">来货单位：</span>
            <input type="text" class="ezt-middle">
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
          <li class="input-list">
            <span class="title-search-name">备注：</span>
            <input type="text" class="ezt-middle">
          </li>         
        </ul>
        <div class="detail-acount-title">
          物料明细
        </div> 
        <ul>
           <li class="good-detail-content">
              <div class="ezt-detail-good">
                  <div class="good-detail-l">
                      <div>
                          <span class="good-detail-name">猪肉
                              <span class="good-detail-sort">（规格）</span>
                          </span>
                          <span class="good-detail-sort">
                            ￥<span class="good-detail-sort">112</span><span>/kg</span>
                          </span>
                           <span class="title-search-name">
                             发：1000
                           </span>
                      </div>
                      <div>
                          <span class="good-detail-billno">编码：003222</span>
                          <span class="good-detail-sort">￥360.001</span>
                          <span class="title-search-name">
                            收：<input type="text" placeholder="10000">
                          </span>
                      </div>                     
                  </div>
                  <div class="good-detail-r">
                    <span class="icon-dail" @click="handlerDirect">拨</span>
                    <div class="park-input">
                      <span>备注：</span>
                      <div class="remark-area">
                        <textarea name="" id="" cols="24" rows="4" style="width: 100%;"></textarea>
                      </div>
                    </div>
                    
                  </div>
              </div>
           </li>
        </ul>
          <x-dialog v-model="isDirect" class="dialog-demo">
            <div class="img-box">
              <div class="good-warehouse">
                <div class="warehouse-title-num">
                  <span>4</span>
                  <span>可直拨</span>
                </div>                
                <div class="warehouse-list">
                    <ul class="warehouse-isDefault">
                        <li>
                          <span>江阳1仓</span>
                          <input type="text" placeholder="11" class="ezt-smart">
                        </li>
                        <li>
                          <span>江阳2仓</span>
                          <input type="text" placeholder="22" class="ezt-smart">
                        </li>
                    </ul>
                </div>
              </div>
            </div>
            <div @click="isDirect=false">
              <span class="ezt-close">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </div>
          </x-dialog>
      </div> 
      <ezt-footer>
         <div class="ezt-foot-temporary" slot="confirm">
          <div class="ezt-foot-total">合计：
            <b>品项</b><span>12</span>，
            <b>数量</b><span>100</span>，
            <b>￥</b><span>22422.01</span>
          </div>
          <div class="ezt-foot-button">
            <a href="javascript:(0)" class="ezt-foot-storage" @click="confirmReceive"> 提交</a>  
            <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive"> 提交并审核</a>   
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
    private orderType:any=[{
      name:'仓库1',
      id:'01'
    }]
    created() {     
       this.pager = new Pager()
       this.service = ReceiveGoodService.getInstance();
       this.goodList = [];
      //  this.getGoodList();
    }

    mounted(){  
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
 .detail-acount-title{
      font-size: 12px;
      color: #95A7BA;
      letter-spacing: 0;
      text-align: left;
      margin-left: 10px;
  }
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
</style>
