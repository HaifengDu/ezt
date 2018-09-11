<!--选择物品-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='选择物料' v-if="!isSelected&&!isSearch" @goBack="goBack">
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
          <span class="collect-good active">
            <span> <i class="fa fa-star-o" aria-hidden="true"></i></span>
            <span>收藏</span>
          </span>
           <div class="good-type-list">
             <span @click="changeSmallType(item)" :class="[{active:item.id==goodSmallType[0].id}]" :key=index v-for="(item,index) in goodBigType">{{item.name}}</span>
           </div>
        </div>
        <div class="good-cont">
           <ul class="good-category-list">
             <li class="category-item" :class="[{active:typeName.id==item.id}]" @click="loadGood(item)" :key=index v-for="(item,index) in goodSmallType">{{item.name}}</li>
           </ul>
           <div class="good-content-list">
             <div class="good-item" v-for="(item,index) in goodList" :key='index'>
               <div class="good-item-title">
                 <span class="good-item-name">{{item.name}}</span>
                 <span class="good-item-sort">{{item.price}}元/{{item.utilname}}（{{item.unit}}）</span>
               </div>
               <div class="good-item-bot">
                 <span class="good-remark">备</span>
                 <span>
                   <i class="fa fa-star-o" aria-hidden="true"></i>
                 </span>
                 <span>
                    <x-number name="" title="" fillable v-model="item.num" :min=0 @on-change="handlerNum(item)"></x-number>
                 </span>
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
          <div>
            <div class="good-item-title">
              <span class="good-item-name">{{item.name}}</span>
              <span class="good-item-sort">{{item.price}}元/{{item.utilname}}（{{item.unit}}）</span>
            </div>
            <div class="good-item-bot">
              <span class="good-remark">备</span>
              <span>
                <i class="fa fa-star-o" aria-hidden="true"></i>
              </span>
              <span>
                <x-number name="" title="" fillable v-model="item.num" :min=0 @on-change="handlerNum(item)"></x-number>
              </span>
            </div>
          </div>          
          <div @click="selectedDelGood(item)">
            删除
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
            <span class="good-item-sort">{{item.price}}元/{{item.utilname}}（{{item.unit}}）</span>
          </div>
          <div class="good-item-bot">
            <span class="good-remark">备</span>
            <span>
              <i class="fa fa-star-o" aria-hidden="true"></i>
            </span>
            <span>
              <x-number name="" title="" fillable v-model="item.num" :min=0 @on-change="handlerNum(item)"></x-number>
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
          <a href="javascript:(0)" class="ezt-foot-sub" @click="goToCommit">去提交</a>   
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
import _ from "lodash";

@Component({
  mixins:[maskMixin],
   computed:{
     ...mapGetters({
       'selectedGood':'publicAddGood/selectedGood'
     }),
   },
   methods:{
     ...mapActions({
       'setSelectedGood':'publicAddGood/setSelectedGood'
     })
   }
})
export default class AddGood extends Vue{
  private addMaskClickListener:(...args:any[])=>void;
  private hideMask:()=>void;
  private showMask:()=>void;
  private isSelected:boolean=false;//已选货品
  private isSearch:boolean=false;//搜索所有物品
  private selectedGoodList:any[] = [];
  private setSelectedGood:INoopPromise//store中给selectedGood赋值
  private selectedGood:any[];//store中selectedGood的值
  private userpp:any[];
  // private goodList:any[]=[{
  //   id:1,
  //   name:'草鱼半成品',
  //   price:'12',
  //   utilname:'KG',
  //   unit:'箱'
  // },{
  //  id:2,
  //   name:'海参',
  //   price:'9',
  //   utilname:'KG',
  //   unit:'箱'
  // }]
  private goodBigType:any[] = [];
  private goodSmallType:any[] = [];
  private goodList:any[]=[];
  private allType:any[] = [];
  private typeName:any={};//记录type选择哪条
  // private userpp:any[]=[];
  created(){
    this.userpp=[]
    console.log(this.userpp,'000000')    
  }
  mounted() {
   this.selectedGoodList=this.selectedGood;//添加物料把已经选过的物料从store中拿过来给页面
    this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
      this.hideMask();
    });  
    this.allType = [{
        id:1,
        name:'牛羊肉',
        cdata:[{
          id:1,
          name:"全部",
          goodList:[{
            id:1,
            name:'草鱼半成品',
            price:'12',
            utilname:'KG',
            unit:'箱'
          }]
        }]
      },{
        id:2,
        name:'成本类',
        cdata:[{
          id:2,
          name:'全部',
          goodList:[{
            id:2,
            name:'海参',
            price:'9',
            utilname:'KG',
            unit:'箱'
          }]
        },{
          id:21,
          name:'速冻类',
          goodList:[{
            id:21,
            name:'牛肉',
            price:'15',
            utilname:'KG',
            unit:'斤'
          }]
        },{
          id:22,
          name:'演示品项',
        }]
      },{
        id:3,
        name:'222222222222222222222222',
        cdata:[{
          id:3,
          name:'全部'
        }]
    }];
    //TODO:把收藏从货品类别里抽出来
    this.goodBigType = this.allType;
    this.goodSmallType = this.allType[0].cdata;
    this.goodList = this.allType[0].cdata[0].goodList;
    //TODO:默认加载货品
  }
  private changeSmallType(item:any){
    this.typeName = item;   
    this.goodSmallType = item.cdata; 
    this.goodList = item.cdata[0].goodList;  
    //TODO:加载货品this.goodSmallType[0]
  }
  private loadGood(item:any){
    //TODO:item.id加载货品
    this.goodList = item.goodList;
    this.typeName=item;
  }
  // private showDelete(item:any){
  private showDelete(s:any,e:any){
  }
  /**
   * 添加/删除物品数量
   */
  private handlerNum(item:any){
    if(item.num>0){
      //新增
      var ret = this.selectedGoodList.find((value:any)=>{
        return item.id == value.id;
      });
      if(!ret){
        this.selectedGoodList.push(item);
      }
    }else{
      //删除
      const index = _.findIndex(this.selectedGoodList,model=>item.id===model.id);
      this.selectedGoodList.splice(index,1);
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
  }
  /**
   * 搜索所有物品 显示/隐藏
   */
  private handlerSearchPage(){
    this.isSearch = true;
    this.isSelected=false;
  }
  /**
   * 搜索
   */
  private handlerSearchData(){
    debugger
  }
  /**
   * 选择完货品去提交
   * */ 
  private goToCommit(){
    this.setSelectedGood(this.selectedGoodList);
    this.$router.push('/addReceiveGood');
    console.log(this.selectedGood,'111')
  }
  private goBack(){
    this.$router.push('/addReceiveGood');
  }
}
</script>

<style lang="less" scoped>
  .good-type{
    height: 45px;
    top: 0;
    z-index: 2;
    position: absolute;
    display:flex;
    flex-direction: row;
    align-items: baseline;
    text-align: left;
  }
  .good-type-list{
    width: calc(100vw - 70px);
    height: 100%;
    overflow-x:scroll;
    display:flex;
    white-space: nowrap;
    span{
      margin-right: 10px;
    }
    span.active{
      color: #1674fc;
    }
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
  }
  .good-item{
    background: #fff;
    padding: 10px;
    text-align: left;
    margin: 8px 0;
    .good-remark{
      border: 1px solid #ccc;
      padding: 1px;
      display:inline-block;
      margin-right: 20px;
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
  }
  .category-item.active{
    background: #fff;
    border-color: #fff;
    border-right-width: 0;
}
  .good-item-bot{
    display: flex;
    flex-direction: row;
    align-items: center;
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
  
  

</style>
