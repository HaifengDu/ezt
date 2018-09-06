<!--选择物品-->
<template>
  <div class="ezt-page-con">
    <ezt-header :back="true" title='选择物料'>
       <div slot="action">
         <div class="add">
          <span class='ezt-action-point'>
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>          
         </div>
       </div>
    </ezt-header>    
    <div class="ezt-main">
      <!-- <div class="ezt-add-content"> -->
        <div class="good-type">
          <span class="collect-good active">
            <span> <i class="fa fa-star-o" aria-hidden="true"></i></span>
            <span>收藏</span>
          </span>
           <div class="good-type-list">
             <span :key=index v-for="(item,index) in goodType">{{item.name}}</span>
           </div>
        </div>
        <div class="good-cont">
           <ul class="good-category-list">
             <li class="category-item" :key=index v-for="(item,index) in goodType">全部</li>
             <li class="category-item">速冻类</li>
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
                    <x-number name="" title="" v-model="selectedItem.num" :min=0 @on-change="handlerNum(item)"></x-number>
                 </span>
               </div>
             </div>
           </div>
        </div>
         
       
      <!-- </div>  -->
      <ezt-footer>
        <div class="ezt-foot-temporary" slot="confirm">
          <div class="ezt-foot-button">
            <a href="javascript:(0)" class="ezt-foot-storage" @click="">
              <span class="ezt-badge">{{selectedItem.good.length}}</span>已选择货品</a>  
            <a href="javascript:(0)" class="ezt-foot-sub" @click="">去提交</a>   
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
import { INoop, INoopPromise } from '../../../helper/methods';


@Component({

})
export default class AddGood extends Vue{
  private selectedItem:any= {//已选择的货口数量 
    num:0,
    good:[]
  };
  private goodList:any[]=[{
    id:1,
    name:'草鱼半成品',
    price:'12',
    utilname:'KG',
    unit:'箱'
  }]
  private goodType:any[] = [{
    id:1,
    name:'牛羊肉',
    cdata:[{
      id:1,
      name:"全部"
    }]
  },{
    id:2,
    name:'成本类',
    cdata:[{
      id:2,
      name:'全部'
    },{
      id:1-2,
      name:'速冻类'
    },{
      id:1-3,
      name:'演示品项'
    }]
  },{
    id:3,
    name:'222222222222222222222222',
  }]; 
  /**
   * 添加/删除物品数量
   */
  private handlerNum(item:any){
    var ret = this.selectedItem.good.find((value:any)=>{
      return item.id == value.id;
    })
    if(!ret){
      this.selectedItem.good.push(item);
    }
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
  }
  .collect-good{
    height: 44px;
    float: left;
    font-size: 14px;
    padding: 12px 10px;
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
    background: #eee;
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

</style>
