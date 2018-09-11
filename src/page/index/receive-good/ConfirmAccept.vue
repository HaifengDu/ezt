<!--收货修改页面-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='收货' @goBack="goBack">
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
              <select name="" id="" placeholder="请选择" class="ezt-select" @change="handlerWarehouse">
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
          <li class="good-detail-content" v-for="(item,index) in goodList" :key="index"> 
            <mt-cell-swipe
              :right="[
                {
                  content: '删除',
                  style: { background: '#ccc', color: '#000' },
                  handler: () => {deleteSection(item)}
                }
              ]"
             >
              <div class="ezt-detail-good">
                  <div class="good-detail-l">
                      <div>
                          <span class="good-detail-name">{{item.name}}
                              <span class="good-detail-sort">（规格）</span>
                          </span>
                          <span class="good-detail-sort">
                            ￥<span class="good-detail-sort">{{item.price}}</span><span>/kg</span>
                          </span>
                            <span class="title-search-name">
                              发：1000
                            </span>
                      </div>
                      <div>
                          <span class="good-detail-billno">编码：003222</span>
                          <span class="good-detail-sort">￥360.001</span>
                          <span class="title-search-name">
                            收：<input type="text" placeholder="10000" class="ezt-smart">
                          </span>
                      </div>                     
                  </div>
                  <div class="good-detail-r">
                    <span class="icon-dail" @click="handlerDirect">拨</span>
                    <div class="park-input">
                      <span class="title-search-name">备注：</span>
                      <input type="text" class="ezt-middle">
                    </div>
                    
                  </div>
              </div>                               
            </mt-cell-swipe>
             <div>
              <x-dialog v-model="isDirect" class="dialog-demo">
                <div @click="isDirect=false" class="ezt-dialog-header">
                  <span class="header-name">
                    直拨
                  </span>
                  <span class="ezt-close">
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </span>
                </div>
                <div class="ezt-dialog-title">
                  <span>可直拨：<span>{{roundValue.num}}</span></span>
                  <span>已直拨：<span>{{roundValue.numed}}</span></span>
                </div>
                <div class="warehouse-list">
                    <ul class="warehouse-isDefault">
                        <li v-for="(item,index) in roundValue.list" :key="index">
                          <span>{{item.name}}</span>
                          <x-number v-model="item.num" button-style="round" :min="0" :max="5"></x-number>
                        </li>
                    </ul>
                </div>            
              </x-dialog>
            </div> 
          </li>                   
        </ul>
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
      <!-- 切换仓库时校验 是否有以下物料 -->
      <confirm v-model="isWarehouse" @on-cancel="onWarehouseCancel" :show-confirm-button="false">
        <p style="text-align:center;"> 物料a、物料b、物料c、物料...的物料关系未分配至仓库**，请重新选择仓库。</p>
      </confirm>
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
import SlideDelete from '../../../components/SlideDelete.vue';
declare var mobiscroll:any;
@Component({
   components:{
     TabItem,SlideDelete
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
    private goodList:any[] = [{
            id:21,
            name:'牛肉',
            price:'15',
            utilname:'KG',
        },{
           id:2,
            name:'白菜',
            price:'1.5',
            utilname:'KG',
        }];

    private tabList:TabList = new TabList();
    private isDirect:boolean = false; //是否可直拨弹框
    private isWarehouse:boolean = false;//切换仓库校验物料
    private orderType:any=[{
      name:'仓库1',
      id:'01'
    }]
    private roundValue:any={//可直拨的数据
      num: 10,
      numed:3,
      list:[{
        name:'仓库一号',
        num:2
      },{
        name:'仓库二号',
        num:6
      }]
    };
    created() {     
       this.pager = new Pager()
       this.service = ReceiveGoodService.getInstance();
      //  this.goodList = [];
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
    /**
     * 左滑删除某一项
     */
    private deleteSection(item:any){
      let newIndex = this.goodList.findIndex((info:any,index:any)=>{
        return item.id == info.id;
      })
      this.goodList.splice(newIndex,1);
    }
    /**
     * 切换仓库校验
     */
    private handlerWarehouse(){
      this.service.checkWarehouse().then(res=>{
        if(res.data.errcode==0){
          this.isWarehouse= true;
        }
      })
    }
    /**
     * 仓库切换校验 失败 返回
     */
    private onWarehouseCancel(){
     
    }
    // 返回
    private goBack(){
      this.$router.push('/receiveGood');
    }
   
}
</script>

<style lang="less" scoped>
.warehouse-isDefault li{
  display:flex;
  flex-direction: row;
  align-items: center;
  flex:1;
  span{
    flex:1;
  }
}    
.ezt-dialog-header{
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  .header-name{
    flex:1;
    margin-right: -20px;
  }
  .ezt-close{
    margin-right:20px;
  }
}
.ezt-dialog-title{
  padding: 10px 0px;
  background: #ccc;
}
.weui-cell:before{
  border:none;
}
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
        // margin: 8px 10px;
        // padding: 12px 10px 12px 15px;
        background: #fff;
    }
    //物料明细结束 
    .ezt-detail-good input{
      // width: 50px;
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
      flex:2;
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
