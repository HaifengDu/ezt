<!--调拨-->
<template>
    <div class="ezt-page-con"  ref="listContainer" 
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="allLoaded" infinite-scroll-immediate-check="false"
        infinite-scroll-distance="10">
        <ezt-header :back="true" title="店内调拨" @goBack="goBack" :isInfoGoback="true">
            <div slot="action">
                <div>
                    <span class='ezt-action-point' @click="toPage(null,'/inStoreAllotAdd')">
                        <i class="fa fa-plus" aria-hidden="true" ></i>
                    </span>
                    <span class='ezt-action-point' @click="searchTitle">
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </span>          
                </div>
            </div>
        </ezt-header>
        <div class="ezt-main">
            <tab :line-width=2 active-color='#fc378c'>
                <tab-item 
                class="vux-center" 
                :selected="item.active" 
                v-for="(item, index) in tabList.TabList"
                @on-item-click="tabClick(index)" 
                :key="index">
                {{item.name}}
                </tab-item>
            </tab>  
            <div class="ezt-add-conten">
                <!--无任何数据时 -->
                <div v-if="goodList.length==0" class="done-none">
                    <div></div>
                    <span>暂无记录</span>
                </div>
                <!-- 调拨单列表       -->
                <div v-if="goodList.length>0" class="receive-dc-list" v-for="(item,index) in goodList" :key="index" @click="toPage(item,'')">
                    <div class="ezt-list-show" v-swipeleft="handlerSwipe.bind(this,item,true)" 
                         v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}" >
                        <div class="receive-icon-title">
                            <span class="receive-icon-dcName"></span>
                            <span class="receive-dc-title">单号：<span class="receive-dc-content">{{item.bill_no}}</span></span> 
                            <span class="receive-status">{{item.arrive_date}}</span>
                        </div>
                        <div class="receive-icon-content">                        
                            <div style="display:flex">
                                <span class="receive-dc-title">调出：<span class="receive-dc-content">{{item.mater_name}}</span></span>
                                <span class="receive-dc-title">数量：<span class="receive-dc-content">{{item.exportNum}}</span></span>
                            </div>
                            <div style="display:flex">
                                <span class="receive-dc-title">调入：<span class="receive-dc-content">{{item.mater_name}}</span></span>
                                <span class="receive-dc-title">金额：<span class="receive-dc-content">￥{{item.exportNum}}</span></span>
                            </div>
                            <span class="receive-dc-title">货物摘要：<span class="receive-dc-content">{{item.details}}</span></span>
                            <span class="receive-dc-title">备注：<span class="receive-dc-content">{{item.remark}}</span></span>
                        </div>
                    </div>
                    <div class="ezt-list-del" @click.stop="deleteBill(item)">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </div>
                </div>
                <span v-show="allLoaded">已全部加载</span> 
            </div> 
        </div>
        <div v-show="isSearch" class="search-dialog">
            <ul class="ezt-title-search">
                <li class="select-list">
                <span class="title-search-name ">调出仓库：</span>
                <span class="title-select-name item-select">
                <select placeholder="请选择" class="ezt-select" v-model="searchParam.warehouse">
                    <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                    <option :value="item.id" :key="index" v-for="(item,index) in outWareList">{{item.name}}</option>
                </select>
                </span>
            </li>
            <li>
                <span class="title-search-name">调出日期</span>
                <span>
                <ezt-canlendar ref="startDate" :max="searchParam.endDate" :defaultValue="new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd')"
                    placeholder="开始时间" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.startDate"></ezt-canlendar>
                    <span>至</span>
                <ezt-canlendar ref="endDate" :min="searchParam.startDate" :defaultValue="new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')"
                    placeholder="结束时间" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar" v-model="searchParam.endDate"></ezt-canlendar>
                </span>
            </li>
            <li>
                <span class="title-search-name">单据：</span>
                <input type="text" placeholder="请输入单据号" class="ezt-middle" v-on:input="handlerChangeNo($event)" v-model="searchParam.billNo">
            </li>
            <li>
                <span class="title-search-name">物料：</span>
                <input type="text" placeholder="请输入物料名称" class="ezt-middle" v-model="searchParam.material">
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
import noInput from "../../../mixin/noInput";
import { INoop, INoopPromise } from "../../../helper/methods";
import { TabList } from "../../../common/ITab";
import { FactoryService } from '../../../factory/FactoryService';
import { IInStoreAllotService } from '../../../interface/service/IInStoreAllotService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
    components: {
        TabItem
    },
    mixins: [maskMixin,noInput],
})
export default class allotment extends Vue{
    private cache = CachePocily.getInstance();
    private service: IInStoreAllotService;
    private pager:Pager;
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
    private searchParam:any={
        warehouse:'',
        startDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
        endDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')
    };
    private tabList:TabList = new TabList();

    /**
     * 仓库下拉列表
     */
    private outWareList:any=[]
    created() {
        this.tabList.push({
            name:"待审核",
            status:1,
            active:true,
        },{
            name:"已完成",
            status:3,
            active:false
        });
       this.pager = new Pager().setLimit(10)
       const factory = FactoryService.getInstance().createFactory();
       this.service = factory.createInStoreAllot();
       this.handlerOutWare();
    }
    mounted(){      
        this.getList();
        this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
            this.isSearch=false; 
            this.hideMask();
        }); 
        if(this.$route.params.purStatus=="已完成"){//tab 哪个是选中状态
            this.tabList.TabList.forEach((item,index)=>{
                item.active = item.name == this.$route.params.purStatus;
            })
        } 
    }
    /**
     * 调出仓库 下拉列表
     */
    private handlerOutWare(){
        this.outWareList = [{
            name: "调出仓库1",
            id: '1'
        },{
            name: "调出仓库2",
            id: '2' 
        }]
    }
    /**
     * 改变查询的日期
     */
    private selectDateChange(val:any){
        (<any>this.$refs.startDate).setMax(new Date(val));
        (<any>this.$refs.endDate).setMin(new Date(val));
    }
    /**
     * 左侧滑动删除
     */
    private handlerSwipe(item:any,active:boolean){
        const status = this.tabList.getActive().status;
        if(status =="1"){
            this.$set(item,'active',active);
        }  
    }
    /**
     * 左滑确认删除单据
     */
    private deleteBill(item:any){
        let _this = this;
        this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {
                let newIndex = _this.goodList.findIndex((info:any,index:any)=>{
                    return item.id == info.id;
                })
                _this.goodList[newIndex].active = false;
            },
            onConfirm () {
                let newIndex = _this.goodList.findIndex((info:any,index:any)=>{
                    return item.id == info.id;
                })
                _this.goodList.splice(newIndex,1);
                _this.getList();
            },
            content:'是否要删除该单据？'
        })
    }
    /**
     * 单据跳转
     */
    private toPage(item:any,info:string){
        let confirmGoodInfo = {};
        let detailList = {};
        if(info){
            this.$router.push(info);
            return false;
        }
        if(this.tabList.getActive().status==1){
            confirmGoodInfo={
                bill_no:item.bill_no,
                outWarehouse:'02',
                inWarehouse:'01',
                outDate:"2018-9-10",
                num:'2',
                remark:'在途中',         
            }
            this.cache.save(CACHE_KEY.INSTOREALLOT_ADDINFO,JSON.stringify(confirmGoodInfo));
            this.$router.push('/inStoreAllotAudit');
        }else if(this.tabList.getActive().status==3){
            detailList = {
                dc_name:"配送中心-8店",
                bill_no:"000111aab",         
            }
            this.cache.save(CACHE_KEY.INSTOREALLOT_DETAILLIST,JSON.stringify(detailList));
            this.$router.push('/inStoreAllotDetail');
        }      
    }
    /**
     * 列表页 tab切换
     */
    private tabClick(index:number){
        this.tabList.setActive(index);
        this.allLoaded=false;
        (this.$refs.listContainer as HTMLDivElement).scrollTop = 0;
        this.pager.resetStart();//分页加载还原pageNum值
        this.getList();     
    }
     /**
      * 获取列表
      */
    private getList(){
        const status = this.tabList.getActive().status;
        this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{
            this.showMask();
            this.$vux.loading.show({
                text: '加载中...'
            });
            this.goodList=res.data.list;
            setTimeout(()=>{
                this.$vux.loading.hide();
                this.hideMask();
            },400); 
        },err=>{
            this.$toasted.show(err.message);
        });
    }
    //下拉加载更多
    private loadMore() {
        if(!this.allLoaded){
            this.showMask();
            this.$vux.loading.show({
                text:'加载中..'
            });
            this.pager.setNext();
            this.service.getGoodList(status as string, this.pager.getPage()).then(res=>{  
                if(this.pager.getPage().limit>res.data.list.length){
                     this.allLoaded=true;
                }
                this.goodList=this.goodList.concat(res.data.list);
                setTimeout(()=>{
                    this.$vux.loading.hide();
                    this.hideMask();
                },500); 
            },err=>{
                this.$toasted.show(err.message);
            })
        }     
    }
     
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
        this.cache.save(CACHE_KEY.INSTOREALLOT_SEARCH,JSON.stringify(this.searchParam));
        this.$router.push('/inStoreAllotSearch');
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
    .oo{
      display: inline-block;
      width:10px;
      height: 10px;
    }
      // 左侧滑动删除
    .swipe-transform{
        transform: translateX(-60px);
    }
    .receive-dc-list{
        position: relative;
    }
    .ezt-list-del{
        position: absolute;
        right: 12px;
        top: 42px;
        // background: pink;
        width: 50px;
        height: 50px;
        text-align: center;
        margin: 25px 0px;
        font-size: 22px;
    }
    //左侧滑动删除
    .ezt-list-show{
        position: relative;
        transition: transform .5s;
        background: #fff;
        z-index: 2;
    }
</style>


