 <!--选择物品-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='选择物料' v-if="!isSelected&&!isSearch">
      <div slot="action">
        <div class="add">
          <span class='ezt-action-point' @click="handlerSearchPage">
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>          
        </div>
      </div>
    </ezt-header>        
    <div class="ezt-main">
      <div class="ezt-add-content">
        <div class="good-type">
          <span class="collect-good active"  v-if="materialLimit.billsPageType!='initStock'&&!InterfaceSysTypeBOH">
            <span> <i class="fa fa-star-o" aria-hidden="true"></i></span>
            <span>收藏</span>
          </span>
          <div class="good-type-list" :class="{collect:materialLimit.billsPageType!='initStock'}">
            <span @click="changeSmallType(item)" :class="[{active:item.active}]" :key=index v-for="(item,index) in goodBigType">{{item.name}}</span>
          </div>
        </div>
        <div class="good-cont">
           <ul class="good-category-list">
             <li class="category-item" :class="[{active:typeName.id==item.id}]" @click="loadGood(item)" :key=index v-for="(item,index) in goodSmallType">
               {{item.name}}   
               <span class="ezt-reddot-s" v-if="item.addList&&item.addList.length>0">{{item.addList.length}}</span>
              </li>
           </ul>
           <div class="good-content-list">
             <div class="good-item" v-for="(item) in goodList" :key='item.id'>
                <div class="good-item-title">
                  <span class="good-item-name">{{item.name}}</span>  
                  <!--库存初始化-->
                    <span v-if="materialLimit.billsPageType == 'initStock'" class="good-item-sort edit">
                      <span v-if="materialLimit.costType =='0'">价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price"></span>                    
                      <span v-if="materialLimit.costType == '1'">金额：<input type="text" @change="pubChange(item,'amt')" class="ezt-smart" v-model="item.amt"></span>                    
                    </span> 
                  <!--默认显示价格 可编辑 盘库 订货不显示-->  
                  <span v-if="materialLimit.billsPageType != 'stocktaking'&& materialLimit.billsPageType!='initStock'&&materialLimit.billsPageType != 'orderGood'&&materialLimit.billsPageType != 'supplierReturn'&&
                  materialLimit.billsPageType!='inStoreAllot'&&materialLimit.billsPageType != 'spilledSheet' &&materialLimit.billsPageType !='leadbackMaterial'" class="good-item-sort edit">
                      价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price">
                  </span>   
                  <!---盘库显示规格账面数量-->
                  <span v-if="materialLimit.billsPageType == 'stocktaking'" class="good-item-sort">
                      规格： <span class="good-item-sort">{{item.utilname}}</span>
                      账面数量：<span class="good-item-sort">{{item.price}}</span>
                  </span>
                  <!--订货手工制单价格、退货价格、店内调拨、报损单、审核损溢 领退料 不可编辑-->  
                  <span class="good-item-sort" v-if="materialLimit.billsPageType == 'orderGood'||materialLimit.billsPageType=='inStoreAllot'||materialLimit.billsPageType == 'supplierReturn'||
                   materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType =='leadbackMaterial'">{{item.price}}元/{{item.utilname}}（{{item.unit}}）</span>                  
                </div>
               <div class="good-item-bot">
                 <!-- 编辑图标 -->
                 <span class="good-remark" @click="handlerRemark(item)">
                   <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                 </span>
                 <!-- 库存初始化、退货 收藏图标 -->
                 <span v-if="materialLimit.billsPageType != 'initStock'&&materialLimit.billsPageType != 'supplierReturn'&&!InterfaceSysTypeBOH" 
                    class="good-collect" :class="{'active':item.active}" @click="handlerCollect(item)">
                   <i class="fa fa-star-o" aria-hidden="true"></i>
                 </span>
                <!-- 库存量显示  店内调拨 新增、审核，店间平调 新增、审核，损溢 新增、审核，领退料 新增、审核 -->
                <span v-if="materialLimit.billsPageType == 'inStoreAllot' || materialLimit.billsPageType == 'storeAllot'||
                  materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType == 'leadbackMaterial'||(materialLimit.billsPageType=='supplierReturn' && logistics.isAnyReturn)" 
                  class="good-stock ezt-titleColor2">
                  库存：{{item.stock||0}}
                </span>
                <span v-if="materialLimit.billsPageType =='supplierReturn'&&!logistics.isAnyReturn" 
                class="good-stock ezt-titleColor2">
                  可退：{{item.returnNum||0}}
                </span>
                <span class="good-number">
                   <!-- 库存数量限制 -->  
                    <ezt-number type="number" v-if="materialLimit.billsPageType == 'inStoreAllot' || materialLimit.billsPageType == 'storeAllot'|| materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType == 'leadbackMaterial'||(materialLimit.billsPageType=='supplierReturn' && logistics.isAnyReturn)"
                      :returnMax="item.stock" :limitNum="true" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                    <!-- 可退数量限制  -->
                    <ezt-number type="number" v-if="materialLimit.billsPageType =='supplierReturn'&&!logistics.isAnyReturn"
                      :returnMax="item.returnNum" :limitNum="true" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                    <!-- 正常数量选择 -->
                    <ezt-number type="number" v-if="materialLimit.billsPageType!='inStoreAllot'&& materialLimit.billsPageType!= 'storeAllot' && materialLimit.billsPageType!='spilledSheet'
                      &&materialLimit.billsPageType!='leadbackMaterial'&&materialLimit.billsPageType!='supplierReturn'" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                </span>
               </div>
                  <div>
                    <x-dialog v-model="isRemark" class="dialog-demo"> 
                      <div class="ezt-dialog-header">
                        <div class="ezt-close" @click="isRemark=false" >
                          <i class="fa fa-times" aria-hidden="true"></i>
                        </div>
                        <!-- 默认编辑 备注 -->
                        <div class="header-name" v-if="materialLimit.billsPageType!='initStock'">
                          <textarea placeholder="请输入备注信息" style="height: 4em;" class="ezt-pri-remark" v-model="bindRemark.remark"></textarea>
                        </div>
                        
                      </div>
                      <!-- 只有收货模块时才有直拨 -->
                      <div v-if="materialLimit.billsPageType=='receiveGood'">
                          <div class="ezt-dialog-title">
                            <span>可直拨：<span class="num">{{(bindRemark.roundValue&&bindRemark.roundValue.num)||0}}</span></span>
                            <span>已直拨：<span class="num">{{DirectedNum}}</span></span>
                          </div>
                          <div class="warehouse-list">
                              <ul class="warehouse-isDefault">
                                  <li v-for="(item,index) in ((bindRemark.roundValue&&bindRemark.roundValue.list)||[])" :key="index">
                                    <span>{{item.name}}</span>
                                    <x-number v-model="item.num" @on-change="changeDirect(item)" button-style="round" :min="0"></x-number>
                                  </li>
                              </ul>
                          </div>
                      </div>
                      
                      <div class="mine-bot-btn">
                        <span class="ezt-lone-btn" @click="remarkConfirm">提交</span>
                      </div>
                    </x-dialog>
                  </div>
                <!-- 编辑价格信息时  -->
                <div>
                    <x-dialog v-model="isPrice" class="dialog-demo">
                    <div class="ezt-dialog-header">                                
                        <span class="ezt-close" @click="isPrice=false" >
                        <i class="fa fa-times" aria-hidden="true"></i>
                        </span>
                    </div>                            
                    <div class="warehouse-list">
                        <ul class="edit-good-list">
                            <li>
                                <span class="title-select-name">数量：</span>
                                <x-number v-model="bindRemark.num" button-style="round" :min="0"></x-number>
                            </li>
                            <li v-if="materialLimit.costType=='0'">
                                <span class="title-dialog-name">价格：</span>
                                <span class="icon-input price">
                                    <input type="text" @change="pubChange(bindRemark,'price')" class="ezt-smart" v-model="bindRemark.price">
                                </span>                                       
                            </li>
                            <li v-if="materialLimit.costType=='1'">
                                <span class="title-dialog-name">含税额：</span>
                                <span class="icon-input price">
                                    <input type="text" @change="pubChange(bindRemark,'amt')" class="ezt-smart" v-model="bindRemark.amt">
                                </span>                                       
                            </li>
                            <li>
                                <span class="title-dialog-name">税率：</span>
                                <span class="icon-input">
                                    <input type="text" class="ezt-smart" @change="pubChange(bindRemark,'rate')" v-model="bindRemark.rate">
                                </span>
                            </li>
                            <li class="select-list">
                                <span class="title-dialog-name">供应商：</span>
                                <span class="title-select-name item-select">
                                <select name="" id="" placeholder="请选择" class="ezt-select" v-model="bindRemark.supplier">
                                    <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                                    <option :value="item.name" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                                </select>
                                </span>
                            </li>
                            <li>
                                <span class="title-dialog-name">备注：</span>
                                <input type="text" placeholder="请输入备注" class="ezt-middle" v-model="bindRemark.remark">
                            </li>
                        </ul>
                    </div>
                    <div class="mine-bot-btn">
                        <span class="ezt-lone-btn" @click="priceConfirm">确定</span>
                    </div>             
                    </x-dialog>
                </div>
             </div>           
          </div>
        </div>
      </div>
    </div>
    <!-- 已选择货品弹框 -->
    <div class="selected-item" v-if="isSelected">
      <ezt-header :back="false" title="已选货品">
        <div slot="action">
          <span class='ezt-action-point' @click="isSelected=false">
            <i class="fa fa-times" aria-hidden="true"></i>
          </span>  
       </div>
      </ezt-header>
      <div class="selected-good-content">       
        <div class="good-item delete" v-swipeleft="showDelete.bind(this,item)" v-for="(item,index) in selectedGoodList" :key='index'>
          <div class="item-left-good">
            <div class="good-item-title">
              <span class="good-item-name">{{item.name}}</span>
               <!--库存初始化-->
                <span v-if="materialLimit.billsPageType == 'initStock'" class="good-item-sort edit">
                  <span v-if="materialLimit.costType =='0'">价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price"></span>                    
                  <span v-if="materialLimit.costType == '1'">金额：<input type="text" @change="pubChange(item,'amt')" class="ezt-smart" v-model="item.amt"></span>                    
                </span>
                  <!---盘库显示规格账面数量-->
                <span v-if="materialLimit.billsPageType == 'stocktaking'" class="good-item-sort" style="margin-left:5px;">
                    规格： <span class="good-item-sort">{{item.utilname}}</span>
                    账面数量：<span class="good-item-sort">{{item.price}}</span>
                </span>
                <!--订货手工制单价格、退货价格、店内调拨、报损单、审核损溢 领退料 不可编辑-->  
                <span class="good-item-sort" v-if="materialLimit.billsPageType == 'orderGood'||materialLimit.billsPageType=='inStoreAllot'||materialLimit.billsPageType == 'supplierReturn'||
                  materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType =='leadbackMaterial'">{{item.price}}元/{{item.utilname}}（{{item.unit}}）</span>                  

                <!--默认显示价格 可编辑-->  
                 <span v-if="materialLimit.billsPageType != 'stocktaking'&& materialLimit.billsPageType != 'orderGood' && materialLimit.billsPageType!='initStock'&&materialLimit.billsPageType!='inStoreAllot'
                  &&materialLimit.billsPageType != 'supplierReturn'&&materialLimit.billsPageType != 'spilledSheet' &&materialLimit.billsPageType !='leadbackMaterial'" class="good-item-sort edit">
                    价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price">
                </span>
            </div>
            <div class="good-item-bot">
              <!-- 编辑图标 -->
              <span class="good-remark" @click="handlerRemark(item)">
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
              </span>
              <!-- 库存量显示  店内调拨 新增、审核，店间平调 新增、审核，损溢 新增、审核，领退料 新增、审核 -->
              <span v-if="materialLimit.billsPageType == 'inStoreAllot' || materialLimit.billsPageType == 'storeAllot'||
                materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType == 'leadbackMaterial'||(materialLimit.billsPageType=='supplierReturn' && logistics.isAnyReturn)" 
                class="good-stock ezt-titleColor2">
                库存：{{item.stock||0}}
              </span>
              <span v-if="materialLimit.billsPageType =='supplierReturn'&&!logistics.isAnyReturn" 
              class="good-stock ezt-titleColor2">
                可退：{{item.returnNum||0}}
              </span>
              <span class="good-number">
                <!-- 库存数量限制 -->  
                <ezt-number type="number" v-if="materialLimit.billsPageType == 'inStoreAllot' || materialLimit.billsPageType == 'storeAllot'|| materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType == 'leadbackMaterial'||(materialLimit.billsPageType=='supplierReturn' && logistics.isAnyReturn)"
                  :returnMax="item.stock" :limitNum="true" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                <!-- 可退数量限制  -->
                <ezt-number type="number" v-if="materialLimit.billsPageType =='supplierReturn'&&!logistics.isAnyReturn"
                  :returnMax="item.returnNum" :limitNum="true" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                <!-- 正常数量选择 -->
                <ezt-number type="number" v-if="materialLimit.billsPageType!='inStoreAllot'&& materialLimit.billsPageType!= 'storeAllot' && materialLimit.billsPageType!='spilledSheet'
                  &&materialLimit.billsPageType!='leadbackMaterial'&&materialLimit.billsPageType!='supplierReturn'" @change="handlerNum(item)" v-model="item.num"></ezt-number>
              </span>
            </div>
          </div>          
          <div @click="selectedDelGood(item)" class="item-delete">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 搜索所有物品 -->
    <div class="search-item" v-if="isSearch">
       <div class="search-header">
          <input type="text" placeholder="请输入" @input="handlerSearchData">
          <div class="search-icon">          
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
          <div class="search-close">
            <span class='ezt-action-point' @click="isSearch=false">
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>  
          </div>
      </div>
      <div class="selected-good-content">
        <div class="good-item" v-for="(item,index) in selectedGoodList" :key='index'>
          <div class="good-item-title">
            <span class="good-item-name">{{item.name}}</span>
            <!--库存初始化-->
            <span v-if="materialLimit.billsPageType == 'initStock'" class="good-item-sort edit">
              <span v-if="materialLimit.costType =='0'">价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price"></span>                    
              <span v-if="materialLimit.costType == '1'">金额：<input type="text" @change="pubChange(item,'amt')" class="ezt-smart" v-model="item.amt"></span>                    
            </span>
             <!-- 盘库显示规格账面数量 -->
            <span v-if="materialLimit.billsPageType == 'stocktaking'" class="good-item-sort">
                规格： <span class="good-item-sort" style="margin-right:5px;">{{item.utilname}}</span>
                账面数量：<span class="good-item-sort">{{item.price}}</span>
            </span>
            <!--默认显示价格 可编辑-->  
            <span v-if="materialLimit.billsPageType != 'stocktaking' && materialLimit.billsPageType != 'orderGood' && materialLimit.billsPageType!='initStock'||(materialLimit.billsPageType == 'supplierReturn'&&logistics.isAnyReturn)" class="good-item-sort edit">
                价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price">
            </span>
          </div>
          <div class="good-item-bot">
            <!-- 编辑图标 -->
            <span class="good-remark" @click="handlerRemark(item)">
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </span>
            <!-- 收藏图标 -->
            <span v-if="materialLimit.billsPageType != 'initStock'&&materialLimit.billsPageType != 'supplierReturn' && materialLimit.billsPageType != 'spilledSheet' && materialLimit.billsPageType != 'leadbackMaterial'" class="good-collect" :class="{'active':item.active}" @click="handlerCollect(item)">
              <i class="fa fa-star-o" aria-hidden="true"></i>
            </span>
            <span class="good-number">              
              <ezt-number type="number" @change="handlerNum(item)" v-model="item.num"></ezt-number>
            </span>
          </div>
        </div>
      </div>
    </div>
    <ezt-footer>
      <div class="ezt-foot-temporary" slot="confirm">
        <div class="ezt-foot-button">
          <a href="javascript:(0)" class="ezt-foot-storage" @click="viewSelectedItem">
            <span class="ezt-badge">{{selectedGoodList.length}}</span>已选择货品</a>  
          <a href="javascript:(0)" class="ezt-foot-sub" @click="goToCommit(pageType.ConfirmList)">去提交</a>   
        </div>  
      </div>       
    </ezt-footer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import store from '../../../store';
import {PublicAddGoodType} from '../../../store/PublicAddGood/mutation-types.ts';
import ErrorMsg from "../model/ErrorMsg"
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../../common/Pager';
import {TabItem,LoadingPlugin} from 'vux'
import { mapActions, mapGetters, mapMutations } from 'vuex';
import {maskMixin} from "../../../helper/maskMixin";
import { INoop, INoopPromise } from '../../../helper/methods';
import ObjectHelper from '../../../common/objectHelper';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
import { PageType } from "../../../enum/EPageType";
import _ from "lodash";

@Component({
  mixins:[maskMixin],
   computed:{
     ...mapGetters({
       'selectedGood':'publicAddGood/selectedGood',
       'logistics':'logistics',//物流设置
       InterfaceSysTypeBOH:'InterfaceSysTypeBOH'
     }),
   },
   methods:{
     ...mapActions({
       'setSelectedGood':'publicAddGood/setSelectedGood'
     })
   }
})
export default class AddGood extends Vue{
  private InterfaceSysTypeBOH:boolean;
  private addMaskClickListener:(...args:any[])=>void;
  private hideMask:()=>void;
  private showMask:()=>void;
  private cache = CachePocily.getInstance();
  private isSelected:boolean=false;//已选货品
  private isSearch:boolean=false;//搜索所有物品
  private selectedGoodList:any[] = [];    
  private setSelectedGood:INoopPromise//store中给selectedGood赋值
  private selectedGood:any[];//store中selectedGood的值
  private logistics:{
    isAnyReturn:boolean
  };
  private isRemark:boolean=false;//编辑备注
  // private useObj:any={
  //   GoodPriceIsEdit:"",
  //   GoodPriceOrAmt:0,
  // }
  private isPrice:boolean=false;//编辑价格
  // private addBillInfo:any;//价格与备注显示切换
  private orderType: any[] = [
    {
      //单据类型下拉数据
      name: "合同采购单",
      type: "q"
    },
    {
      name: "采购单",
      type: "m"
    }
  ];
  private goodBigType:any[] = [];
  private goodSmallType:any[] = [];
  private goodList:any[]=[];
  private allType:any[] = [];
  private typeName:any={};//记录type选择哪条 激活的那条数据添加样式
  private bindRemark:any={};//深拷贝存储的值 
  private restBindRemark:any={};//编辑备注时绑定的值
  private DirectedNum:number=0;//已直拨的数量
  private countFlag = 0;
  private oldValue = 0;
  private pageType = PageType; //页面类型
  private materialLimit: any = {};//限制 
  // private userpp:any[]=[];
  created(){ 
    
  }
  mounted() {  
    if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
      this.materialLimit = JSON.parse(this.cache.getDataOnce(CACHE_KEY.MATERIAL_LIMIT));
    }
    this.selectedGoodList = Array.prototype.slice.call(this.selectedGood);//添加物料把已经选过的物料从store中拿过来给页面    '   
    this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
      this.hideMask();
    });  
    this.allType = [{
        id:1,
        name:"牛羊肉",
        cdata:[{
          id:0,
          name:"全部",
          goodList:[{
            id:11,
            name:"草鱼半成品",
            price:12,
            returnNum:2,
            stock:3,
            amt:10,
            utilname:"KG",
            unit:"箱",
            roundValue:{//可直拨的数据
              num: 10,
              numed:3,
              list:[]
            }
          }]
        }]
      },{
        id:2,
        name:"成本类",
        cdata:[{
          id:3,
          name:"全部",
          goodList:[{
            id:21,
            name:"海参",
            price:9,
            amt:8,
            returnNum:0,
            stock:2,
            num:0,
            utilname:"KG",
            unit:"箱",
            roundValue:{//可直拨的数据
              num: 10,
              numed:3,
              list:[]
            }
          },{
            id:31,
            name:"土豆",
            price:3,
            amt:4,
            num:0,
            returnNum:8,
            stock:5,
            utilname:"KG",
            unit:"斤",
            roundValue:{//可直拨的数据
              num: 10,
              numed:3,
              list:[]
            }
          }]
        },{
          id:21,
          name:"速冻类",
          goodList:[{
            id:211,
            name:"牛肉",
            price:15,
            amt:22,
            returnNum:2,
            stock:8,
            utilname:"KG",
            unit:"斤",
            roundValue:{//可直拨的数据
              num: 10,
              numed:3,
              list:[{
                name:"仓库一号",
                num:0
              },{
                name:"仓库二号",
                num:0
              },{
                name:"仓库三号",
                num:0
              },{
                name:"仓库四号",
                num:0
              },{
                name:"仓库五号",
                num:0
              },{
                name:"仓库六号",
                num:0
              }]
            }
          }]
        },{
          id:22,
          name:"演示品项",
        }]
      },{
        id:3,
        name:"222222222222222222222222",
        cdata:[{
          id:2,
          name:"全部"
        }]
    }];
    //TODO:把收藏从货品类别里抽出来
    this.goodBigType = this.allType;
    this.changeSmallType(this.allType[0]);
    //TODO:默认加载货品
  }
  private changeSmallType(item:any){
    this.allType.forEach((bigSort,index)=>{
      this.$set(bigSort,'active',bigSort.id == item.id);
    })    
    this.typeName = item;   
    this.goodSmallType = item.cdata; 
    (item.cdata).forEach((info:any,index:any)=>{
      this.loadGood(info)
    })
    this.loadGood(item.cdata[0]);
    //TODO:加载货品this.goodSmallType[0]
  }
  private loadGood(item:any){
    if(!item.addList){
      this.$set(item,'addList',[]);
    }else{
      item.addList = [];
    }
   
    //TODO:item.id加载货品
    _.forEach(item.goodList,good=>{
      this.$set(good,'active',false);
      const index = _.findIndex(this.selectedGoodList,model=>good.id===model.id);
      if(index>=0){
        ObjectHelper.merge(good,this.selectedGoodList[index],true);
        this.selectedGoodList[index] = good;
        item.addList.push(good);
      }
    });
    this.goodList = item.goodList;
    this.typeName=item;    
  }
  // private showDelete(item:any){
  private showDelete(s:any,e:any){
  }

  // 价格\税率\税额 修改的时候
  private pubChange(item:any,info:any){
    if(item[info]==""){
        item[info]=0;
    }
    if(!isNaN(item[info])){
      this.oldValue = item[info];//是一个数
    }else{
      item[info] = this.oldValue||0;
    }
    item[info] = parseFloat(item[info]);
    if(info=="rate"){//税率 限制 1-100间
      if(item[info]>100){
        item[info]=100;
      }
      if(item[info]<0){
        item[info]=0;
      }
    }
  }
  /**
   * 添加/删除物品数量
   */
  private handlerNum(item:any){
    let _this = this;
    //退货数量 限制处理
    if(this.materialLimit.billsPageType == 'supplierReturn'){
      if(!item.isStock&&this.logistics.isAnyReturn){
        if(item.num == item.stock){
          this.$set(item,'isStock','true');
          return false;
        }
      }else if(!item.isStock){
        if(item.num == item.returnNum){
          this.$set(item,'isStock','true');
          return false;
        }
      }
     
      if(item.isStock&&this.logistics.isAnyReturn&&item.num == item.stock){//是任意退货 （库存）
        this.$vux.confirm.show({
          content:'实退数量不可大于库存数量',
          showCancelButton:false,
          hideOnBlur:true
        })
        return false;
      }else if(item.isStock&&!this.logistics.isAnyReturn&&item.num == item.returnNum){//不是任意退货（可退）
        this.$vux.confirm.show({
          content:'实退数量不可大于可退数量',
          showCancelButton:false,
          hideOnBlur:true
        })
        return false;
      }
    }
    if(item.num>0){
      //新增
      var ret = this.selectedGoodList.find((value:any)=>{
        return item.id == value.id;
      });
      if(!ret){
        this.selectedGoodList.push(item);
      }
      var smallRet = this.typeName.addList.find((value:any)=>{
        return item.id == value.id;
      })
      if(!smallRet){       
        this.typeName.addList.push(item);
      }
    }else{
      //删除
      const index = _.findIndex(this.selectedGoodList,model=>item.id===model.id);
      if(index>=0){
        this.selectedGoodList.splice(index,1);
      }
      const smallIndex =_.findIndex(this.typeName.addList,(model:any)=>item.id===model.id);
      if(smallIndex>=0){
        this.typeName.addList.splice(smallIndex,1);
      }
    }
  }
  /**
   * 查看已选择货品 显示/隐藏
   */
  private viewSelectedItem(){
    if(this.selectedGoodList.length>0){
      this.isSelected=true;
      this.isSearch = false;
      console.log(this.selectedGoodList,'0000')
      // this.showMask();
    }else{
      this.$toasted.show('请先选择物品');
    }   
  }
  /**
   * 删除已选择货品
   */
  private selectedDelGood(item:any){
    const index = _.findIndex(this.selectedGoodList,model=>item.id===model.id);
    this.selectedGoodList[index].num = 0;//删除完物品数量清空为0
    this.selectedGoodList.splice(index,1);
    
    if(this.typeName.addList.length>0){
      const smallIndex =_.findIndex(this.typeName.addList,(model:any)=>item.id===model.id);
      this.typeName.addList[smallIndex].num=0;
      this.typeName.addList.splice(smallIndex,1);
    }
  }
  /**
   * 搜索所有物品 显示/隐藏
   */
  private handlerSearchPage(){
    this.isSearch = true;
    this.isSelected=false;
  }
  // 修改直拨提交
  private submitDerict(){
    ObjectHelper.merge(this.bindRemark,this.bindRemark,true);
    this.isRemark=false;
  }
  /**
 * 改变直拨的 数量
 */
private changeDirect(item:any){  
  if(!this.bindRemark.roundValue.list){
      this.DirectedNum = 0;
  }
  this.DirectedNum = this.bindRemark.roundValue.list.filter((item:any)=>item.num).reduce((ori:number,item:any)=>ori+=item.num,0);
  if(this.DirectedNum<=this.bindRemark.roundValue.num){
    item.oldNum = item.num;
  }else{
    item.num = item.oldNum;
  }
}
  /**
   * 搜索
   */
  private handlerSearchData(){
    
  }
  /**
   * 收藏物品
   */
  private handlerCollect(item:any){
    item.active = !item.active;
  }
  /**
   * 选择完货品去提交
   * */ 
  private goToCommit(types:PageType){
    this.setSelectedGood(this.selectedGoodList);
    if(this.$route.query.newType === 'manual'){
        this.$router.push({
          name:'LibraryDetails',
          query:{
            types:types.toString(),
        }
      });
    }else{
      this.$router.back();
    }    
  }
  //点击备注
  private handlerRemark(item:any){
    if(this.materialLimit.billsPageType!='initStock'){
      this.isRemark=true;//收货
    }else if(this.materialLimit.billsPageType=="initStock"){
      this.isPrice=true;//库存初始化
    }
    this.restBindRemark = item;
    this.bindRemark = ObjectHelper.serialize(this.restBindRemark);//深拷贝
  }
  //备注，价格弹框取消
  private remarkCancel(){
    this.isRemark = false;
  }
  //备注弹框确定
  private remarkConfirm(){
    alert('备注保存成功');
    ObjectHelper.merge(this.restBindRemark,this.bindRemark,true);
    this.isRemark=false;
  }
 //价格弹框确定
  private priceConfirm(){
    alert('价格修改成功');
    ObjectHelper.merge(this.restBindRemark,this.bindRemark,true);
    this.isPrice=false;
  }
}
</script>

<style lang="less" scoped>
.mine-bot-btn{
    width: 100%;
    // position: absolute;
    margin-top: 20px;
        .ezt-lone-btn{
        display: inline-block;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        padding: 8px 90px;
        margin-bottom: 10px;
        border-radius: 40px;
        background-image: -webkit-gradient(linear, left top, right top, from(#5A12CC), to(#3C82FB));
        background-image: linear-gradient(90deg, #018BFF 0%, #4A39F3 100%);
        -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
        box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);   
    }
  }
  .item-delete{
    flex:1;
    text-align: center;
    align-self: center;
    font-size: 20px;
  }
  .good-type{
    height: 45px;
    top: 0;
    z-index: 2;
    position: absolute;
    display:flex;
    flex-direction: row;
    align-items: baseline;
    text-align: left;
    width: 100%;
  }
  .good-type-list{
    // width: calc(100vw - 70px);
    height: 100%;
    width: 100%;
    overflow-x:scroll;
    display:flex;
    white-space: nowrap;
    span{
      margin-right: 10px;
      max-width: 82px;
      min-width: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span.active{
      color: #1674fc;
    }
  }
  .good-type-list.collect{
     width: calc(100vw - 70px);
  }
  .collect-good{
    height: 44px;
    float: left;
    font-size: 14px;
    padding: 12px 8px;
    max-width: 70px;
    // text-align: center;
    border-bottom-width: 1.5px;
    border-bottom-color: #fff;
  }
  .collect-good.active{
    color: #1674fc;
  }
  .good-cont{
    display: flex;
    padding: 5px;
    width: 100%;
  }
  .good-category-list{
    padding: 0;
    margin-top: 44px;
  }
  .good-content-list{
    margin-top: 44px;
    padding: 0;
    padding-left: 1px;
    margin-left: 3%;
    width: 78%;
  }
  .good-item{
    background: #fff;
    padding: 10px;
    text-align: left;
    margin: 8px 0;
    .good-remark{     
      padding: 1px;
      display:inline-block;
      // margin-right: 20px;
      flex:.4;
      font-size: 20px;
    }
    .good-number{
      flex:1;
    }
    .good-collect{
      flex:.4;
      font-size: 20px;
    }
    .good-stock{
      flex:.4;
      font-size: 12px;
      margin-right: 4px;
    }
    .good-collect.active{
      color:#1674fc;
    }
  }
  .category-item{
    background: #eee;
    border-bottom: 1px solid #fff;
    border-width: .1px;
    padding: 13px 10px;
    font-size: 14px;
    text-align: center;
    max-width: 30px;  
    position: relative;  
  }
  .category-item .ezt-reddot-s{
    position: absolute;
    width: 16px;
    height: 16px;
    background: red;
    color: #fff;
    top: 0;
    right: -4px;
    border-radius: 10px;
  }
  .category-item.active{
    background: #1188FC;
    border-color: #fff;
    border-right-width: 0;
    color: #fff;
}
  .good-item-bot{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 14px;
  }
  .ezt-foot-storage{
    position: relative;
  }
  .ezt-badge{
    display: inline-block;
    width: 16px;
    height: 16px;
    content: "";
    position: absolute;
    background: red;
    border-radius: 16px;
    right: 30px;
    top: 4px;
    color: #fff;
    line-height: 16px;
  }
  //已选 货品//搜索所有物品
  .selected-item,.search-item{
    height: 90%;
    transition: height 2s;
    position: absolute;
    background: #F1F6FF;
    top: 1px;
    bottom: 40px;
    width: 100%;
    z-index: 5;   
  }
  .searcted-item{
    margin-top: 45px;
  }
  .selected-good-content{
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .search-header{
    position: fixed;
    display: flex;
    background-image: linear-gradient(139deg, #018BFF 0%, #4A39F3 100%);
    background-color: transparent;
    width: 100%;
    padding: 8px 10px;
    input{
      width: 74%;
      padding: 4px 4px 4px 35px;
    }
    .search-close{
      flex: .6;
      line-height: 100%;
      margin: auto 0;
      color: #fff;
    }
    .search-icon{
      position: absolute;
      left: 22px;
      top: 10px;
      color: #ccc;
      font-size: 16px;
    }
  }

  //带有删除的物料
  .good-item.delete{
    display:flex;
    flex-direction: row;
  }
  // 编辑备注时样式
  .good-item-title{
    display: flex;
    .good-item-name{
      flex:1;
    }
    .good-item-sort.edit{
      border: 1px solid #ccc;
    }
  }
  //编辑物品 修改的字段
.dialog-demo {
  .ezt-dialog-header {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
  .edit-good-list {
    flex-direction: column;
    text-align: center;
    display: inline-block;
    li {
      display: flex;
      // flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #ccc;
      position: relative;
      .title-dialog-name {
        flex: inherit;
        padding: 10px 0px;
        font-size: 13px;
        color: #5f7b9a;
      }
      .weui-cell:before {
        border: none;
      }
      select {
        height: 36px;
      }
      .icon-input::before {
        display: inline-block;
        content: "%";
        position: absolute;
        right: 16px;
      }
      .icon-input.price::before {
        content: "￥";
      }
    }
  }
}
//按钮
.mine-bot-btn {
  width: 100%;
  // position: absolute;
  margin-top: 20px;
  .ezt-lone-btn {
    display: inline-block;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    padding: 8px 90px;
    margin-bottom: 10px;
    border-radius: 40px;
    background-image: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#5a12cc),
      to(#3c82fb)
    );
    background-image: linear-gradient(90deg, #018bff 0%, #4a39f3 100%);
    -webkit-box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
    box-shadow: 0 3px 10px 0 rgba(60, 130, 251, 0.43);
  }
}
  //直拨仓库   
  .warehouse-list{
      flex: 1;
      text-align: center;
      margin-left: 10px;
      max-height: 160px;
      overflow-x: auto;
      .warehouse-isDefault{           
        display: inline-block;               
          
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
  // display: flex;
  flex-direction: column;

  .header-name{
    flex:1;
    margin-right: 5px;
  }
  .ezt-close{
    margin-bottom:10px;
    text-align: right;
    font-size: 18px;
  }
}
.ezt-dialog-title{
  padding: 10px 0px;
  background: #FFF8DD;
  display:flex;
  flex-direction: row;
  span.num{
    font-size: 15px;
    color:red;
  }
}
.ezt-dialog-title>span{
  flex:1;
}
.weui-cell:before{
  border:none;
}
.item-left-good{
  min-width: 200px;
}

</style>