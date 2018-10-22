<!-- 调拨新增 -->
<template>
    <div class="ezt-page-con">
        <ezt-header :back='true' title="添加调拨出库单" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name is-required">调出仓库：</span>
                        <span class="title-select-name item-select">
                            <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.outWarehouse" 
                                @change="handlerBillType('outWarehouse','您已选择物料，调整出库仓库，需重新选择调入仓库及物料。')"
                                :class="[{'selectError':billFiles[0].outWarehouse}]">
                                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                                <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                            </select>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name is-required">调入仓库：</span>
                        <span class="title-select-name item-select">
                        <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.inWarehouse" 
                            @change="handlerBillType('inWarehouse','您已选择物料，调整入库仓库，需重新选择调整物料。')"
                             :class="[{'selectError':billFiles[1].inWarehouse}]">
                            <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                            <option :value="item.type" :key="index" v-for="(item,index) in orderType">{{item.name}}</option>
                        </select>
                        </span>
                    </li>
                    <li>
                        <span class="title-search-name">备注：</span>
                        <input type="text" class="ezt-middle" v-model="addBillInfo.remark">
                    </li>
                    <li>
                        <span class="title-search-name is-required">选择物料：</span>
                        <span class="title-search-right" @click="renderUrl('/publicAddGood')">
                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </span>
                        
                    </li>
                </ul>
                <ul>
                    <li class="good-detail-content" :class="{'':item.active}" v-for="(item,index) in selectedGood" :key="index">              
                        <div class="ezt-detail-good" v-swipeleft="handleSwipe.bind(this,item,true)" 
                        v-swiperight="handleSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}">
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">
                                    <span class="good-detail-break">{{item.name}}</span> 
                                    <span class="good-detail-sort">（规格）</span>
                                    </span>
                                </div>
                                <div class="good-detail-nobreak">
                                    <span class="good-detail-billno ">编码：003222</span>
                                    <span class="good-detail-sort">￥{{item.price}}/{{item.utilname}}</span>
                                    <span class="title-search-name ezt-dense-box">{{item.num}}</span>                         
                                </div>                     
                            </div>
                            <div class="good-detail-r">
                            <div class="park-input"> 
                                <span class="title-search-name">备注：{{item.remark}}</span>
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
import {Component, Watch} from "vue-property-decorator"
import { mapActions, mapGetters } from 'vuex';
import { AllotmentService} from '../../../service/AllotmentService';
import { INoop, INoopPromise } from '../../../helper/methods';
import ObjectHelper from '../../../common/objectHelper'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
    computed:{
        ...mapGetters({
            'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
        })
    },
    methods:{
        ...mapActions({
            'setSelectedGood':'publicAddGood/setSelectedGood',
        })
    }

})
export default class allotment extends Vue{
    private cache = CachePocily.getInstance();
    private service : AllotmentService;
    /**
     * 调出仓库列表
     *  */
    private orderType:any[] = [];
    private addBillInfo:any = {};
    private selectedGood:any[];//store中selectedGood的值
    private setSelectedGood:INoopPromise//store中给selectedGood赋值
    private addBeforeBillInfo:any = {};//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
     /**
     * 枚举 表单字段
     */
    private billFiles=[
        {id:"outWarehouse",msg:"请选择调出仓库",outWarehouse:false},
        {id:"inWarehouse",msg:"请选择调入仓库",inWarehouse:false},
    ];


    mounted(){
       
    }
    created(){
        this.service = AllotmentService.getInstance();
        this.orderType = [{//单据类型下拉数据    
            name:"合同采购单",
            type:"q"
        },{
            name:"采购单",
            type:"m"
        }]
        this.addBillInfo.outWarehouse = this.orderType[0].type;
         this.addBillInfo.inWarehouse = this.orderType[0].type;
        if(this.cache.getData(CACHE_KEY.ALLOTMENT_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ALLOTMENT_ADDINFO));
        }
        this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
        //  this.getGoodList();
        (this.selectedGood||[]).forEach(item=>item.active = false);
        console.log(this.selectedGood,'00000');
    }
    /**
     * 物料总数量、总金额
     */
    private get Total(){
        return this.selectedGood.reduce((ori,item)=>{
            ori.num = ori.num+Number(item.num);       
            ori.Amt = ori.Amt + (Number(item.num) * Number(item.price));
            return ori;
        },{num:0,Amt:0});
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
     * 提交并审核 调拨单
     */
    private confirmAllot(){
        let _this = this;
        for(let i=0;i<this.billFiles.length;i++){
            let item = this.billFiles[i];
            if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
            }
        }
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
                    _this.$router.push('/inStoreAllotment'); 
                },
                onConfirm () {//审核通过
                    _this.addBillInfo={},
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo={};
                    _this.$toasted.success("审核成功！");
                    _this.$router.push({name:'InStoreAllotment',params:{'purStatus':'已完成'}}); 
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
        for(let i=0;i<this.billFiles.length;i++){
            let item = this.billFiles[i];
            if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                this.$toasted.show(item.msg);
                item[item.id]=true;
                return false;
            }
        }
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        } 
        this.addBillInfo={},
        this.setSelectedGood([]);
        this.addBeforeBillInfo={};
        this.$toasted.success("提交成功！");
        this.$router.push("/inStoreAllotment");
    }

    /**
   * 选择调入仓库、调出仓库
   */
    private handlerBillType(val:any,title:any){
        let _this = this;
        if(this.selectedGood.length>0){
            this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {
                    _this.addBillInfo[val] = _this.addBeforeBillInfo[val];
                },
                onConfirm () {
                    if(val == "outWarehouse"){//如果调整的出库仓库，需要重新选择入库仓库
                        // _this.addBillInfo.inWarehouse = "";
                        _this.addBillInfo.inWarehouse = _this.orderType[0].type;
                        _this.addBeforeBillInfo.inWarehouse = _this.orderType[0].type;
                    }
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo[val]=_this.addBillInfo[val];
                },
                content:title
            })
        }else{
            if(val == "outWarehouse"){//如果调整的出库仓库，需要重新选择入库仓库
                // _this.addBillInfo.inWarehouse = "";
                _this.addBillInfo.inWarehouse = _this.orderType[0].type;
                _this.addBeforeBillInfo.inWarehouse = _this.orderType[0].type;
            }
            _this.addBeforeBillInfo[val]=_this.addBillInfo[val];
            this.billFiles.forEach(item=>{
                if(item.id == val){
                    item[val]= false;
                }
            })         
        }
    }
    /**
     * 选择物料
     */
    private renderUrl(info:string){
        if(this.addBillInfo){
            let _this = this;
            for(let i=0;i<this.billFiles.length;i++){
                let item = this.billFiles[i];
                if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                    this.$toasted.show(item.msg);
                    item[item.id]=true;
                    return false;
                }
            }
            this.cache.save(CACHE_KEY.ALLOTMENT_ADDINFO,JSON.stringify(this.addBillInfo));
            this.cache.save(CACHE_KEY.ALLOTMENT_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
            // this.$router.push(info);
            this.$router.push({name:'PublicAddGood',params:{'allotOrderType':'true'}});
        }      
    }
    /**
     * 后退
     */
    private goBack(){
        let _this = this;
        if((this.addBillInfo&&this.addBillInfo.outWarehouse)||this.selectedGood.length>0){
        this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {
            console.log(this) // 非当前 vm
            },
            onConfirm () {
                _this.addBillInfo={},
                _this.setSelectedGood([]);
                _this.addBeforeBillInfo={};
                _this.$router.push('/allotment');
            },
            content:"返回后，本次操作记录将丢失，请确认是否离开？"
        })
        }else{
            this.$router.push('/allotment');
        }
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


