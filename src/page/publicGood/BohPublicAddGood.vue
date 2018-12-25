 <!--选择物品-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='选择物料' v-if="!isSelected&&!isSearch">
      <div slot="action" v-if="materialLimit.billsPageType!='stocktaking'">
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
            <i class="divide">|</i>
          </span>
          <div class="good-type-list" :class="{collect:(materialLimit.billsPageType!='initStock'&&!InterfaceSysTypeBOH)}">
            <span @click="changeSmallType(item)" :class="[{active:item.active}]" :key=index v-for="(item,index) in goodBigType">{{item.name}}</span>
          </div>
        </div>
        <div class="good-cont">
           <ul class="good-category-list">
              <li class="category-item" :class="[{active:(typeName.id==item.id)}]" @click="loadGood(item,goodSmallType.id)" :key=index v-for="(item,index) in goodSmallType.cdata">
               {{item.name}}   
                <span class="ezt-reddot-s" v-if="item.addList&&item.addList.length>0">{{item.addList.length}}</span>
              </li>
           </ul>
          <div class="good-content-list" ref="listContainer" v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
            infinite-scroll-distance="10">
             <div class="good-item" v-for="(item) in goodList" :key='item.id'>
                <div class="good-item-title">
                  <span class="good-item-name">{{item.name || item.material_name}}</span>  
                  <!--库存初始化-->
                  <span v-if="!InterfaceSysTypeBOH && !materialLimit.showPrice && materialLimit.billsPageType == 'initStock'" class="good-item-sort edit">
                    <span v-if="materialLimit.costType =='0'">价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price"></span>                    
                    <span v-if="materialLimit.costType == '1'">金额：<input type="text" @change="pubChange(item,'amt')" class="ezt-smart" v-model="item.amt"></span>                    
                  </span>
                  <!-- 默认不可以进行编辑  BOH不限制-->
                  <span class="good-item-sort" v-if="InterfaceSysTypeBOH || !materialLimit.showPrice && !materialLimit.editPrice  && materialLimit.billsPageType != 'initStock'">{{item.price||0}} 元/{{item.unitName}}</span>
                  <!-- 价格可以进行编辑  收货、平调 可以编辑的话找到单据选择物料处 editPrice控制 是否可以编辑-->
                  <span v-if="!InterfaceSysTypeBOH && !materialLimit.showPrice && materialLimit.editPrice " class="good-item-sort edit">
                    价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price">
                  </span>
                  <!---盘库显示规格账面数量-->
                  <span v-if="!materialLimit.showPrice &&materialLimit.billsPageType == 'stocktaking'" class="good-item-sort">
                     规格：<span class="good-item-sort" v-if="item.material_model || ''">{{item.material_model}} </span>
                     账面数量：<span class="good-item-sort">{{item.acc_qty}}</span>
                  </span>
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
                  materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType == 'leadbackMaterial'||(materialLimit.billsPageType=='supplierReturn' && materialSetting.isAnyReturn)" 
                  class="good-stock ezt-titleColor2">
                  库存：{{item.stock||0}}
                </span>
                <span v-if="materialLimit.billsPageType =='supplierReturn'&&!materialSetting.isAnyReturn" 
                class="good-stock ezt-titleColor2">
                  可退：{{item.returnNum||0}}
                </span>
                <span class="good-number">
                  <!-- 库存数量限制 -->  
                  <ezt-number type="number" v-if="materialLimit.billsPageType == 'inStoreAllot' || materialLimit.billsPageType == 'storeAllot'|| materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType == 'leadbackMaterial'||(materialLimit.billsPageType=='supplierReturn' && materialSetting.isAnyReturn)"
                    :returnMax="item.stock" :limitNum="true" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                  <!-- 可退数量限制  -->
                  <ezt-number type="number" v-if="materialLimit.billsPageType =='supplierReturn'&&!materialSetting.isAnyReturn"
                    :returnMax="item.returnNum" :limitNum="true" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                  <!-- 正常数量选择 -->
                  <ezt-number type="number" v-if="materialLimit.billsPageType!='inStoreAllot'&& materialLimit.billsPageType!= 'storeAllot' && materialLimit.billsPageType!='spilledSheet'
                    &&materialLimit.billsPageType!='leadbackMaterial'&&materialLimit.billsPageType!='supplierReturn'" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                </span>
               </div>
              
             </div>           
          </div>
        </div>
      </div>
       <!-- 编辑备注或者仓库时 -->
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
    <!-- 2、 已选择货品弹框 -->
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
              <span class="good-item-name">{{item.name || item.material_name}}</span>
              <!--库存初始化-->
              <span v-if="!InterfaceSysTypeBOH && !materialLimit.showPrice &&materialLimit.billsPageType == 'initStock'" class="good-item-sort edit">
                <span v-if="materialLimit.costType =='0'">价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price"></span>                    
                <span v-if="materialLimit.costType == '1'">金额：<input type="text" @change="pubChange(item,'amt')" class="ezt-smart" v-model="item.amt"></span>                    
              </span>              
              <!-- 默认不可以进行编辑 BOH不限制-->
              <span class="good-item-sort" v-if="InterfaceSysTypeBOH || !materialLimit.showPrice && !materialLimit.editPrice">{{item.price}} 元/{{item.unitName}}</span>
              <!-- 价格可以进行编辑  收货、平调 可以编辑的话找到单据处 editPrice控制 是否可以编辑--> 
              <span v-if="!InterfaceSysTypeBOH && !materialLimit.showPrice && materialLimit.editPrice " class="good-item-sort edit">
                价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price">
              </span>
              <!---盘库显示规格账面数量-->
              <span v-if="!materialLimit.showPrice &&materialLimit.billsPageType == 'stocktaking'" class="good-item-sort" style="margin-left:5px;">
                规格：<span class="good-item-sort" v-if="item.material_model || ''">{{item.material_model}}</span>
                账面数量：<span class="good-item-sort">{{item.acc_qty}}</span>
              </span>
            </div>
            <div class="good-item-bot">
              <!-- 编辑图标 -->
              <span class="good-remark" @click="handlerRemark(item)">
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
              </span>
              <!-- 库存量显示  店内调拨 新增、审核，店间平调 新增、审核，损溢 新增、审核，领退料 新增、审核 -->
              <span v-if="materialLimit.billsPageType == 'inStoreAllot' || materialLimit.billsPageType == 'storeAllot'||
                materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType == 'leadbackMaterial'||(materialLimit.billsPageType=='supplierReturn' && materialSetting.isAnyReturn)" 
                class="good-stock ezt-titleColor2">
                库存：{{item.stock||0}}
              </span>
              <span v-if="materialLimit.billsPageType =='supplierReturn'&&!materialSetting.isAnyReturn" 
              class="good-stock ezt-titleColor2">
                可退：{{item.returnNum||0}}
              </span>
              <span class="good-number">
                <!-- 库存数量限制 -->  
                <ezt-number type="number" v-if="materialLimit.billsPageType == 'inStoreAllot' || materialLimit.billsPageType == 'storeAllot'|| materialLimit.billsPageType == 'spilledSheet' || materialLimit.billsPageType == 'leadbackMaterial'||(materialLimit.billsPageType=='supplierReturn' && materialSetting.isAnyReturn)"
                  :returnMax="item.stock" :limitNum="true" @change="handlerNum(item)" v-model="item.num"></ezt-number>
                <!-- 可退数量限制  -->
                <ezt-number type="number" v-if="materialLimit.billsPageType =='supplierReturn'&&!materialSetting.isAnyReturn"
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
    <!-- 3、 搜索所有物品 -->
    <div class="search-item" v-if="isSearch">
       <div class="search-header">
          <input type="text" placeholder="请输入" @input="handlerSearchData" v-model="publicParam.searchData">
          <div class="search-icon">          
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
          <div class="search-close">
            <span class='ezt-action-point' @click="handlerSearchPage">
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>  
          </div>
      </div>
      <div class="selected-good-content" ref="searchContainer" v-infinite-scroll="searchLoadMore"
            :infinite-scroll-disabled="searchAllLoaded" infinite-scroll-immediate-check="false"
            infinite-scroll-distance="10">
        <div class="good-item" v-if="publicParam.searchList.length>0" v-for="(item,index) in publicParam.searchList" :key='index'>
          <div class="good-item-title">
            <span class="good-item-name">{{item.name || item.material_name}}</span>
            <!--库存初始化-->
            <span v-if="!InterfaceSysTypeBOH && !materialLimit.showPrice &&materialLimit.billsPageType == 'initStock'" class="good-item-sort edit">
              <span v-if="materialLimit.costType =='0'">价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price"></span>                    
              <span v-if="materialLimit.costType == '1'">金额：<input type="text" @change="pubChange(item,'amt')" class="ezt-smart" v-model="item.amt"></span>                    
            </span>
             <!-- 盘库显示规格账面数量 -->
            <span v-if="!materialLimit.showPrice &&materialLimit.billsPageType == 'stocktaking'" class="good-item-sort">
              规格： <span class="good-item-sort" v-if="item.material_model || ''">{{item.material_model}}</span>
              账面数量：<span class="good-item-sort">{{item.acc_qty}}</span>
            </span>
            <!-- 默认不可以进行编辑  BOH不限制-->
            <span class="good-item-sort" v-if="InterfaceSysTypeBOH || !materialLimit.showPrice && !materialLimit.editPrice">{{item.price}} 元/{{item.unitName}}</span>
            <!-- 价格可以进行编辑  收货、平调 可以编辑的话找到单据处 editPrice控制 是否可以编辑-->
            <span v-if="!InterfaceSysTypeBOH && !materialLimit.showPrice && materialLimit.editPrice " class="good-item-sort edit">
              价格：<input type="text" @change="pubChange(item,'price')" class="ezt-smart" v-model="item.price">
            </span>
          </div>
          <div class="good-item-bot">
            <!-- 编辑图标 -->
            <span class="good-remark" @click="handlerRemark(item)">
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </span>
            <!-- 收藏图标 -->
            <span v-if="!InterfaceSysTypeBOH && materialLimit.billsPageType != 'initStock'&&materialLimit.billsPageType != 'supplierReturn' && materialLimit.billsPageType != 'spilledSheet' && materialLimit.billsPageType != 'leadbackMaterial'" class="good-collect" :class="{'active':item.active}" @click="handlerCollect(item)">
              <i class="fa fa-star-o" aria-hidden="true"></i>
            </span>
            <span class="good-number">              
              <ezt-number type="number" @change="handlerNum(item)" v-model="item.num"></ezt-number>
            </span>
          </div>
        </div>
        <!--无任何数据时 -->
        <div v-if="publicParam.searchList.length == 0" class="done-none">
          <div></div>
          <span>暂无结果</span>
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
import store from '../../store';
import {Component,Watch} from "vue-property-decorator"
import Pager from '../../common/Pager';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import {maskMixin} from "../../helper/maskMixin";
import { INoop, INoopPromise } from '../../helper/methods';
import ObjectHelper from '../../common/objectHelper';
import { CachePocily } from "../../common/Cache";
import { ECache } from "../../enum/ECache";
import CACHE_KEY from '../../constans/cacheKey'
import { PageType } from "../../enum/EPageType";
import { FactoryService } from '../../factory/FactoryService';
import { IPublicAddGoodService } from '../../interface/service/IPublicAddGoodService';
import FormData from '../../dictory/formData';
import _ from "lodash";
import { clearTimeout, setTimeout } from 'timers';

@Component({
  mixins:[maskMixin],
    computed:{
      ...mapGetters({
        'selectedGood':'publicAddGood/selectedGood',
        'materialSetting':'materialSetting',//物流设置
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
  private service:IPublicAddGoodService;
  private InterfaceSysTypeBOH:boolean;
  private addMaskClickListener:(...args:any[])=>void;
  private hideMask:()=>void;
  private showMask:()=>void;
  private cache = CachePocily.getInstance();
  private publicParam: any={
    searchData:'',//查询的物品名称
    searchList:[],//查询完的结果
    listPage:Number,
    searchPage:Number
  };
  private isSelected:boolean=false;//已选货品
  private isSearch:boolean=false;//搜索所有物品
  private selectedGoodList:any[] = [];    
  private setSelectedGood:INoopPromise//store中给selectedGood赋值
  private selectedGood:any[];//store中selectedGood的值
  private materialSetting:{
    isAnyReturn:boolean
  };
  private isRemark:boolean=false;//编辑备注
  private isPrice:boolean=false;//编辑价格
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
  private allType:any[];
  private typeName:any={};//记录type选择哪条 激活的那条数据添加样式
  private bindRemark:any={};//深拷贝存储的值 
  private restBindRemark:any={};//编辑备注时绑定的值
  private DirectedNum:number=0;//已直拨的数量
  private countFlag = 0;
  private oldValue = 0;
  private pageType = PageType; //页面类型
  private materialLimit: any = {};//限制
  /**
   * 各个模块查询分类时传的参数，自己存在缓存里，统一的一个参数
   *  */ 
  private materialParam:any;
  /**
   * 下拉加载更多时需要 把参数保存起来
   *  */ 
  private loadMoreParam:any = {};
  private pager:Pager;
  private allLoaded: boolean = false;
  private searchAllLoaded: boolean = false;

  private timer:any = null;
  created(){ 
    this.pager = new Pager().setLimit(10)
    const factory = FactoryService.getInstance().createFactory();
    this.service = factory.createPublicGood();
    if(this.cache.getData(CACHE_KEY.MATERIAL_PARAM)){
      this.materialParam = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_PARAM));
    } 
    /**
     * 获取 类 物品列表
     */
    this.service.getGoodClass(this.materialParam,this.pager.getPage()).then(res=>{
      this.allType = res.data.sortList;
      this.goodBigType = this.allType;
      this.changeSmallType(this.allType[0]);//默认加载第一个类别的物品
    },err=>{
      this.$toasted.show(err.message);
      this.$router.back();
    });
  }
  mounted() {  

    if(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT)){
      this.materialLimit = JSON.parse(this.cache.getData(CACHE_KEY.MATERIAL_LIMIT));
    }
    this.selectedGoodList = Array.prototype.slice.call(this.selectedGood);//添加物料把已经选过的物料从store中拿过来给页面    '   
    this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
      this.hideMask();
    });
    //TODO:把收藏从货品类别里抽出来
    }
    //TODO:默认加载货品
  // }
  private changeSmallType(item:any){
    this.allLoaded=false;
    this.pager.resetStart();//分页加载还原pageNum值
    (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;

    this.allType.forEach((bigSort,index)=>{
      this.$set(bigSort,'active',bigSort.id == item.id);
    })    
    this.typeName = item; 
    this.$set(item,'categoryId',item.id);  
    this.goodSmallType = item;
   /*  (item.cdata).forEach((info:any,index:any)=>{
      this.loadGood(info,info.id);
    }) */
    this.loadGood(item.cdata[0],item.id);
  
    // TODO:加载货品this.goodSmallType[0]   
  }
  /**
   * item 小类 所谓的cdata
   * categoryId 大类的id
   */
  private loadGood(item:any,categoryId:any){
    this.allLoaded=false;
    this.pager.resetStart();//分页加载还原pageNum值
    this.publicParam.listPage = 1;
    (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
    
    let _this_ = this;
    if(!item.addList){
      this.$set(item,'addList',[]);
    }else{
      item.addList = [];
    }
    this.loadMoreParam = {
      categoryId:categoryId,//大类id
      orderGoodsName:item.name,//小类名称 
      stockGoodsSortId:item.id,//小类id
      allGoods: item//下拉加载的时候分类中已经有返回全部的物品，加载更多
    }
    if(item.id==-1 || (item.id == 0 && !isNaN(0))){//加载全部
      if(item.goodsList && item.goodsList.length>0){//全部里面找出已经选择的货品
        // this.allGoods(item);
        this.goodList = this.allGoods(item);
        // _this_.typeName = this.allGoods(item);
        _this_.typeName=item; 
        return false;
      }
    }      
    _this_.service.getGoodClass( Object.assign(this.loadMoreParam,this.materialParam),this.pager.getPage()).then(res=>{
      let goodsList = res.data.goodsList || [];
      this.goodList = this.allGoods(res.data);
      // this.goodList = goodsList;
    },err=>{
      this.$toasted.show(err.message);      
    });
    _this_.typeName=item; 
  }
  /**
   * 加载全部的物品
   */
  private allGoods(item:any){
    let _this_ = this;    
    if(!item.addList){
      this.$set(item,'addList',[]);
    }else{
      item.addList = [];
    }
    //TODO:item.id加载货品
    _.forEach(item.goodsList,good=>{
      this.$set(good,'active',false);
      const index = _.findIndex(this.selectedGoodList,model=>good.material_id===model.material_id);
      if(index>=0){
        ObjectHelper.merge(good,this.selectedGoodList[index],true);
        this.selectedGoodList[index] = good;
        item.addList.push(good);
      }
    });
    // this.goodList = item.goodsList;    
    return item.goodsList;
  }

  /**
   * 下滑加载更多物品
   */
  private loadMore(){
    if(!this.allLoaded && this.goodList.length >= this.pager.getPage().limit){
      let _this_ = this;
      this.showMask();
      this.$vux.loading.show({
        text:'加载中..'
      });
      this.pager.setPage(this.publicParam.listPage);  //list懒加载的page为list的page
      // this.publicParam.listPage = this.pager.getPage();
      this.pager.setNext();
      this.publicParam.listPage = this.pager.getPage().page;//重新给list的page值
      
      if(this.loadMoreParam.allGoods.goodsList&&this.loadMoreParam.allGoods.goodsList.length>0){//从分类中返回的物品 分页加载
        _this_.service.getGoodClass(this.materialParam,this.pager.getPage()).then(res=>{
          let goodsList = res.data.sortList[0].cdata[0].goodsList;          
          goodsList = this.allGoods(res.data.sortList[0].cdata[0]);//已选择的物品数量

          if(this.pager.getPage().limit>goodsList.length){
            this.allLoaded = true;
          }
          this.goodList = this.goodList.concat(goodsList);
          setTimeout(()=>{
            this.$vux.loading.hide();
            this.hideMask();
          },500);
        },err=>{
          this.$toasted.show(err.message);
        });
      }else{//分类当中并没有返回全部的物品，要去单独请求一次物品的接口
        _this_.service.getGoodClass(Object.assign(this.loadMoreParam,this.materialParam),this.pager.getPage()).then(res=>{
          let goodsList = res.data.goodsList;
          goodsList = this.allGoods(res.data);//已选择的物品数量

          if(this.pager.getPage().limit>goodsList.length){
            this.allLoaded = true;
          }
          this.goodList = this.goodList.concat(goodsList);
          setTimeout(()=>{
            this.$vux.loading.hide();
            this.hideMask();
          },500);
        },err=>{
          this.$toasted.show(err.message);          
        })
      } 
    }    
  }

  /**
   * 查询物品中的下拉加载 
   */
  private searchLoadMore(){
    if(!this.searchAllLoaded && this.publicParam.searchList.length >= this.pager.getPage().limit){
      let _this_ = this;
      this.showMask();
      this.$vux.loading.show({
        text:'加载中..'
      });
      this.pager.setPage(this.publicParam.searchPage);  //search懒加载的page为search的page
      this.pager.setNext();
      this.publicParam.searchPage = this.pager.getPage().page;//重新给search的page值
      this.service.getGoodList(Object.assign({goodsName:this.publicParam.searchData},...this.materialParam),this.pager.getPage())
      .then((res:any)=>{
        let goodsList = res.data.goodsList;
        goodsList = this.allGoods(res.data);//已选择的物品数量

        if(this.pager.getPage().limit>goodsList.length){
          this.searchAllLoaded = true;
        }
        this.publicParam.searchList = this.publicParam.searchList.concat(goodsList);
        setTimeout(()=>{
          this.$vux.loading.hide();
          this.hideMask();
        },500);
      })
    }
    
  }

  /**
   * 搜索
   */
  private handlerSearchData(){
    clearTimeout(this.timer);

    this.publicParam.searchData = this.publicParam.searchData.replace(/\s+/g,'');//查询字段有空格
    this.timer = setTimeout(()=>{
      //函数抖动 控制用户输入频繁
      this.service.getGoodList(Object.assign({goodsName:this.publicParam.searchData},...this.materialParam),this.pager.getPage())
      .then((res:any)=>{
        if(res.data.errcode == 0){
          if(res.data.goodsList && res.data.goodsList.length == 0){//不能搜出来
            this.searchAllLoaded=false;
            this.pager.resetStart();//分页加载还原pageNum值
            this.publicParam.searchPage = 1;            
          }
          this.publicParam.searchList = this.allGoods(res.data);
         
        }
      })
    }, 800);
  }

  @Watch('publicParam.searchData',{
    deep:true
  })
  private WatchSearchList(newValue:any[],oldValue:any[]){
    if(!oldValue || this.pager.getPage().limit>this.publicParam.searchList.length){//有值 搜索不出来
      this.searchAllLoaded=false;
      this.pager.resetStart();//分页加载还原pageNum值
      this.publicParam.searchPage = 1;
      
    }
  }
  
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
    if(this.materialLimit.billsPageType == 'inStoreAllot' || this.materialLimit.billsPageType == 'storeAllot'||
        this.materialLimit.billsPageType == 'spilledSheet' || this.materialLimit.billsPageType == 'leadbackMaterial'||(this.materialLimit.billsPageType=='supplierReturn' && this.materialSetting.isAnyReturn)){
      if(!item.isStock){
        if(item.num == item.stock){//库存量
          this.$set(item,'isStock','true');
          return false;
        }
      }else{
        if(item.num == item.returnNum){//可退量
          this.$set(item,'isStock','true');
          return false;
        }
      }     
      let confirmTitle="";
      if(this.materialLimit.billsPageType == 'supplierReturn'){
        if(item.isStock&&this.materialSetting.isAnyReturn&&item.num == item.stock){//是任意退货 （库存）
          confirmTitle = '实退数量不可大于库存数量';
        }else if(item.isStock&&!this.materialSetting.isAnyReturn&&item.num == item.returnNum){//不是任意退货（可退）
          confirmTitle ='实退数量不可大于可退数量';
        }
      }else if(item.isStock&&item.num == item.stock){
          confirmTitle ='添加数量不可大于库存量';
      }
      if(confirmTitle){
        this.$vux.confirm.show({
          content:confirmTitle,
          showCancelButton:false,
          hideOnBlur:true
        })
        return false;
      }
    }
    if(item.num>0){
      //新增
      var ret = this.selectedGoodList.find((value:any)=>{
        return item.material_id == value.material_id;
      });
      if(!ret){
        this.selectedGoodList.push(item);
      }
      var smallRet = this.typeName.addList.find((value:any)=>{
        return item.material_id == value.material_id;
      })
      if(!smallRet){       
        this.typeName.addList.push(item);
      }
    }else{
      //删除
      const index = _.findIndex(this.selectedGoodList,model=>item.material_id===model.material_id);
      if(index>=0){
        this.selectedGoodList.splice(index,1);
      }
      const smallIndex =_.findIndex(this.typeName.addList,(model:any)=>item.material_id===model.material_id);
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
    const index = _.findIndex(this.selectedGoodList,model=>item.material_id===model.material_id);
    this.selectedGoodList[index].num = 0;//删除完物品数量清空为0
    this.selectedGoodList.splice(index,1);
    if(this.typeName.addList.length>0){
      const smallIndex =_.findIndex(this.typeName.addList,(model:any)=>item.material_id===model.material_id);
      this.typeName.addList[smallIndex].num=0;
      this.typeName.addList.splice(smallIndex,1);
    }
  }
  /**
   * 搜索所有物品 显示/隐藏
   */
  private handlerSearchPage(){
    // this.isSearch = true;
    // this.isSelected=false;
    this.isSearch = !this.isSearch;
    this.isSelected = !this.isSelected;  
    if(this.publicParam.searchList.length == 0){
      this.searchAllLoaded=false;
      this.pager.resetStart();//分页加载还原pageNum值
      this.publicParam.searchPage = 1;
    } 
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
      // this.showMask();
    }else if(this.materialLimit.billsPageType=="initStock"){
      this.isPrice=true;//库存初始化
      // this.showMask();
    }
    this.restBindRemark = item;
    this.bindRemark = ObjectHelper.serialize(this.restBindRemark);//深拷贝
  }
  //备注弹框确定
  private remarkConfirm(){
    // alert('备注保存成功');
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
  top: 40px;
  z-index: 2;
  line-height: 45px;   
  // position: absolute;
  position: fixed;
  display:flex;
  flex-direction: row;
  align-items: baseline;
  text-align: left;
  width: 100%;
  background: #fff;
}
.good-type-list{
  // width: calc(100vw - 70px);
  height: 100%;
  width: 100%;
  overflow-x:scroll;
  display:flex;
  white-space: nowrap;
  padding-left: 10px;
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
  padding-left: 6px;
  max-width: 70px;
  // text-align: center;
  border-bottom-width: 1.5px;
  border-bottom-color: #fff;
}
.collect-good.active{
  color: #1674fc;
}
.collect-good .divide{
  display: inline-block;
  font-style: normal;
  color: #ccc;
}
.good-cont{
  display: flex;
  padding: 5px;
  width: 100%;
  position: fixed;
  top: 44px;
  bottom: 50px;
}
.good-category-list{
  padding: 0;
  margin-top: 45px;
  position: fixed;
  overflow-y: scroll;
  top: 48px;
  bottom: 50px;
}
.good-content-list{
  margin-top: 44px;
  padding: 0;
  padding-left: 1px;
  margin-left: 26%;
  width: 70%;
  overflow-y: scroll;
}
.good-item{
  background: #fff;
  padding: 10px;
  text-align: left;
  margin: 0px 0px 8px 0px;
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
  max-width: 60px;  
  position: relative;  
}
.category-item .ezt-reddot-s{
  position: absolute;
  width: 16px;
  height: 16px;
  background: red;
  color: #fff;
  top: 0;
  right: 0px;
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
  height: 120%;
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
  overflow-x: hidden;
  height: calc(100% - 210px);
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
.ezt-page-con{
  overflow: hidden !important;
}

</style>