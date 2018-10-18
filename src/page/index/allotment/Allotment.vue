<!--调拨-->
<template>
    <div class="ezt-page-con"  ref="listContainer" 
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
        <ezt-header :back="true" title="店内调拨" @goBack="goBack" :isInfoGoback="true">
            <div slot="action">
                <div>
                    <span class='ezt-action-point' @click="toPage('/allotAdd')">
                        <i class="fa fa-plus" aria-hidden="true" ></i>
                    </span>
                    <span class='ezt-action-point' @click="searchTitle">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </span>          
                </div>
            </div>
        </ezt-header>
        <div v-show="isSearch" class="search-dialog">
            <ul class="ezt-title-search">
                <li class="select-list">
                <span class="title-search-name ">调出仓库：</span>
                <span class="title-select-name item-select">
                <select placeholder="请选择" class="ezt-select" v-model="searchParam.warehouse">
                    <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                    <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                </select>
                </span>
            </li>
            <li>
                <span class="title-search-name">调出日期</span>
                <span>
                <ezt-canlendar placeholder="开始时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
                    <span>至</span>
                <ezt-canlendar placeholder="结束时间" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
                </span>
            </li>
            <li>
                <span class="title-search-name">单据或物料：</span>
                <input type="text" class="ezt-middle">
            </li>
            <li>
                <div class="ezt-two-btn" @click="toSearch">查询</div>
            </li>
            </ul>
        </div> 
    </div>
    
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from "vue-property-decorator";
import Pager from "../../../common/Pager";
import { TabItem, LoadingPlugin } from "vux";
import { mapActions, mapGetters } from "vuex";
import { maskMixin } from "../../../helper/maskMixin";
import { INoop, INoopPromise } from "../../../helper/methods";
import { TabList } from "../../../common/ITab";
import { CachePocily } from "../../../common/Cache";
import {ECache} from '../../../enum/ECache';
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
    components: {
        TabItem
    },
    mixins: [maskMixin],
})
export default class allotment extends Vue{
    private cache = CachePocily.getInstance();
    private addMaskClickListener:(...args:any[])=>void;
    private hideMask:()=>void;
    private showMask:()=>void;
     /**
     * 列表页list数据
     */
    private goodList:any[] = [];
    /**
     * 数据是否已经全部加载完
     */
    private allLoaded:boolean= false;
    /**
     * 搜索显示
     */
    private isSearch:boolean= false; 
    /**
     * 搜索时的查询条件
     */
    private searchParam:any={};
    private tabList:TabList = new TabList();

    /**
     * 仓库下拉列表
     */
    private orderType:any=[{
      name:'仓库1',
      id:'01'
    }]

    //下拉加载更多
    // private loadMore() {
    //   if(!this.allLoaded){
    //     this.showMask();
    //     this.$vux.loading.show({
    //         text:'加载中..'
    //     });
    //     this.pager.setNext();
    //     this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{  
    //         if(this.pager.getPage().limit>res.data.data.length){
    //         this.allLoaded=true;
    //         }
    //         this.goodList=this.goodList.concat(res.data.data);
    //         setTimeout(()=>{
    //         this.$vux.loading.hide();
    //         this.hideMask();
    //         },500); 
    //     },err=>{
    //         this.$toasted.show(err.message);
    //     })
    //   }     
    // }
     
    /**
     * 搜索选择的条件显示/隐藏
     */
    private searchTitle(){
      this.isSearch = !this.isSearch;
      this.isSearch?this.showMask():this.hideMask();
    }
    /**
     * 查询
     */
    private toSearch(){
        this.isSearch = false;
        this.hideMask();
        this.cache.save(CACHE_KEY.RECEIVE_SEARCH,JSON.stringify(this.searchParam));
        this.$router.push('/allotSearch');
    }
    /**
     * 单据跳转
     */
    private toPage(info:any){
        if(info){
            this.$router.push(info);
        }
    }
    /**
     * 返回
     *  */
    private goBack(){
        this.$router.push('/');
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
    .ezt-action-point{
      width: 20px;
      height: 26px;
      display: inline-block;
    }
    //搜索弹框
    .search-dialog{
      width: 100%; 
      position:absolute;
      top:45px; 
      z-index:10001;
    }
    .oo{
      display: inline-block;
      width:10px;
      height: 10px;
    }
</style>


