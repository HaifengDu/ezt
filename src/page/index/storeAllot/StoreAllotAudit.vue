<!-- 审核调拨单 -->
<template>
    <div class="ezt-page-con">
        <ezt-header :back='true' title="审核平调出库单" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li>
                        <span class="title-search-name">单号：</span>
                        {{addBillInfo.bill_no}}
                    </li>
                    <li>
                        <span class="title-search-name">调出日期：</span>
                        {{addBillInfo.outDate}}
                    </li>
                    <li>
                        <span class="title-search-name">调出仓库：</span>
                        {{addBillInfo.outWarehouse}}
                    </li>
                    <li>
                        <span class="title-search-name">调入门店：</span>
                        {{addBillInfo.inStore}}
                    </li>
                    <li class="input-list">
                        <span class="title-search-name">备注：</span>
                        <input type="text" class="ezt-middle" v-model="addBillInfo.remark">
                    </li>
                    <li>
                        <span class="title-search-name">选择物料：</span>
                        <span class="title-search-right" @click="renderUrl('/publicAddGood')">
                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </span>                        
                    </li>  
                </ul>
                <ul>
                    <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index"> 
                        <div class="ezt-detail-good" v-swipeleft="handleSwipe.bind(this,item,true)" 
                        v-swiperight="handleSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}">
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">{{item.name}}
                                        <span class="good-detail-sort">（规格）</span>
                                    </span>                         
                                </div>
                                <div>
                                    <span class="good-detail-billno">编码：003222</span>
                                    <span class="good-detail-sort">￥360.001</span>
                                    <span class="title-search-name ezt-dense-box">
                                        {{item.num}}
                                    </span>
                                </div>                     
                            </div>
                            <div class="good-detail-r">
                                <div class="park-input">
                                备注：<input v-model="item.remark" class="ezt-middle" placeholder="请输入备注" type="text"/>
                                </div>                    
                            </div>            
                        </div> 
                        <div class="ezt-detail-del" @click="delAction(item)">删除</div> 
                    </li>
                </ul>
            </div>
            <ezt-footer>
                <div class="ezt-foot-temporary" slot="confirm">
                <div class="ezt-foot-total" v-if="this.selectedGood.length>0">合计：
                    <b>品项</b><span>{{this.selectedGood.length}}</span>，
                    <b>数量</b><span>{{Total.num}}</span>，
                    <b>￥</b><span>{{(Total.Amt).toFixed(2)}}</span>
                </div>
                <div class="ezt-foot-button">
                    <a href="javascript:(0)" class="ezt-foot-storage" @click="saveAllot">提交</a>  
                    <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmAllot"> 提交并审核</a>   
                </div>  
                </div>
            </ezt-footer>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Watch} from "vue-property-decorator";
import ObjectHelper from '../../../common/objectHelper'
import { INoop, INoopPromise } from '../../../helper/methods';
import { mapActions, mapGetters } from 'vuex';
import { StoreAllotService } from '../../../service/StoreAllotService';
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
    computed:{
        ...mapGetters({
            selectedGood:"publicAddGood/selectedGood",
        })
    },
    methods:{
        ...mapActions({
            setSelectedGood:"publicAddGood/setSelectedGood",
        })
    }
})
export default class allotment extends Vue{
    private cache = CachePocily.getInstance();
    private service : StoreAllotService;
    private selectedGood: any[];
    private setSelectedGood: INoopPromise;
    private addBillInfo: any = {};
    private addBeforeBillInfo: any = {};

    mounted(){
        if(this.cache.getData(CACHE_KEY.STOREALLOT_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.STOREALLOT_ADDINFO));
            this.addBillInfo.goodList = [{
                id:21,
                name:'牛肉',
                price:'15',
                utilname:'KG',
                num:2,
            },{
                id:2,
                name:'白菜',
                price:'1.5',
                utilname:'KG',
                num:3,
            }]
        }
        this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
        if(this.selectedGood.length==0&&this.addBillInfo.goodList){
            this.setSelectedGood(this.addBillInfo.goodList);         }
        (this.selectedGood||[]).forEach(item=> this.$set(item,'active',false));
    }
    created(){
        this.service =  StoreAllotService.getInstance();
    }
     /**
     * 提交并审核 调拨单
     */
    private confirmAllot(){
        let _this = this;
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        }
        if(false){
            this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {//返回
                },
                content:'物料a、物料b、物料c、物料...的物料关系未分配至仓库**，请重新选择仓库，或调整物料的仓库分配关系后再操作。',
                showConfirmButton: false,
                cancelText:"返回",
                title:"入库失败"
            })
        }else{
            this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {//审核不通过
                    _this.addBillInfo={},
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo={};
                    _this.$router.push('/storeAllotment'); 
                },
                onConfirm () {//审核通过
                    _this.addBillInfo={},
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo={};
                    _this.$toasted.success("审核成功！");
                    _this.$router.push({name:'StoreAllotment',params:{'purStatus':'已完成'}}); 
                },
                content:'确认审核该单据？',
                confirmText:"审核通过",
                cancelText:"审核不通过",
                hideOnBlur:true
            })
        }
       
    }    
    /**
     * 提交调拨单
     */
    private saveAllot(){
        if(this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        } 
        this.addBillInfo={},
        this.setSelectedGood([]);
        this.addBeforeBillInfo={};
        this.$toasted.success("提交成功！");
        this.$router.push("/storeAllotment");
    }
    /**
     * 物品总数量、总金额
     */
    private get Total(){
        return this.selectedGood.reduce((ori,item)=>{
            ori.num = ori.num+Number(item.num);       
            ori.Amt = ori.Amt + (Number(item.num) * Number(item.price));
            return ori;
        },{num:0,Amt:0})
    }

     /**
     * 左滑删除
     */
    private handleSwipe(item:any,active:boolean){ 
        item.active=active;        
    }
    /**
     * 确认删除物料
     */
    private delAction(item:any){
        let _this = this;
        this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {
                let newIndex = _this.selectedGood.findIndex((info:any,index:any)=>{
                return item.id == info.id;
                })
                _this.selectedGood[newIndex].active = false;
            },
            onConfirm () {
                let newIndex = _this.selectedGood.findIndex((info:any,index:any)=>{
                return item.id == info.id;
                })
                _this.selectedGood.splice(newIndex,1);
            },
            content:'请确认是否删除该物料。'
        })
    }
     /**
     * 选择物料
     */
    private renderUrl(info:string){
        let goodTerm = {}
        goodTerm={
            billsPageType: 'storeAllot',
        }  
        this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
        this.cache.save(CACHE_KEY.STOREALLOT_ADDINFO,JSON.stringify(this.addBillInfo));
        this.cache.save(CACHE_KEY.STOREALLOT_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        this.$router.push(info);
    }
    private goBack(){
        this.addBillInfo={},
        this.setSelectedGood([]);
        this.addBeforeBillInfo={};
        this.$router.push('/storeAllotment');
    }
}
</script>
<style lang="less" scoped>
 //物料信息
.good-detail-content{
    position: relative;
    overflow: hidden;
    text-align: left;
    margin: 8px 10px;
    padding: 12px 10px 12px 15px;
    background: #FFFFFF;
    border: 1px solid #DDECFD;
    box-shadow: 0 0 20px 0 rgba(71,66,227,0.07);
    display: flex;
    flex: row;
    flex-direction: column;
    .good-detail-l{
        display: inline-block;
        flex:.8;
    }
    .good-detail-l>div{
        display:flex;
        flex-direction: row;
    }
    .good-detail-l>div>span{
        // padding: 5px 0px;
        align-items: baseline;
        flex: 1;
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
        line-height: 3;
    }
    .good-detail-name{
        font-size: 14px;
        color: #395778;
        letter-spacing: 0;
        display: flex;
        line-height: 16px;
    }
    .good-detail-sort{
        font-size: 13px;
        color: #5F7B9A;
        letter-spacing: 0;
        display: flex;
        flex-direction: row;
    }
    .good-detail-nobreak{
        display:flex;
        flex:1;
        padding: 6px 0px 6px 0px;      
    }
    .ezt-dense-box{
        align-items: center;
        flex: 1 !important;
    }
    .good-detail-billno{
        font-size: 10px;
        color: #A3B3C2;
        letter-spacing: 0;
        padding: 0px 0px 5px;
    }
    .ezt-detail-good{
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        transition: transform .5s;
        background: #fff;
        z-index: 2;
    }
}
.swipe-transform{
    transform: translateX(-50px);
}
.ezt-detail-del{
    position: absolute;
    right: 10px;
    top: 30px;
    background: pink;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
}
   
//物料明细结束 
</style>