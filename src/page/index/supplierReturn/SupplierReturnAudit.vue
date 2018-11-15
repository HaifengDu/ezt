<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="审核供应商退货单" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li>
                        <span class="title-search-name">单号：</span>
                        {{addBillInfo.bill_no}}
                    </li>
                    <li>
                        <span class="title-search-name">仓库：</span>
                        {{addBillInfo.warehouse}}
                    </li>
                    <li>
                        <span class="title-search-name">供应商：</span>
                        {{addBillInfo.supplier}}
                    </li>
                    <li>
                        <span class="title-search-name">退货日期：</span>
                        {{addBillInfo.returnDate}}
                    </li>
                    <li>
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
                <div class="detail-acount-title">
                    物料明细
                </div> 
                <ul>
                    <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index">
                        <div class="ezt-detail-good"  v-swipeleft="handlerSwipe.bind(this,item,true)" 
                        v-swiperight="handlerSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}">
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">{{item.name}}
                                        <span class="good-detail-sort">(/{{item.utilname}})</span>
                                    </span>                         
                                </div>
                                <div>
                                    <span class="good-detail-billno">编码：003222</span>
                                    <span class="good-detail-sort" v-if="(addBillInfo.returnType == 'store'&&materialSetting.show_back_price)||addBillInfo.returnType == 'supplier'">￥{{item.price}}</span>
                                    <span class="title-search-name ezt-dense-box">
                                        {{item.num}}
                                    </span>
                                </div>                     
                            </div>
                            <div class="good-detail-r">
                                <div class="park-input">
                                    <span class="title-search-name">备注：{{item.remark}}</span>
                                </div>
                            </div>                 
                        </div> 
                        <div class="ezt-detail-del" @click="delAction(item)">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </div> 
                    </li>
                </ul>
            </div>
            <ezt-footer>
                <div class="ezt-foot-temporary" slot="confirm">
                <div class="ezt-foot-total">合计：
                    <b>品项</b><span>{{this.selectedGood.length}}</span>，
                    <b>数量</b><span>{{Total.num}}</span>，
                    <b v-if="(addBillInfo.returnType == 'store'&&materialSetting.show_back_price)||addBillInfo.returnType == 'supplier'">￥</b>
                    <span v-if="(addBillInfo.returnType == 'store'&&materialSetting.show_back_price)||addBillInfo.returnType == 'supplier'">{{Total.Amt.toFixed(2)}}</span>
                </div>
                <div class="ezt-foot-button">
                    <a href="javascript:(0)" class="ezt-foot-storage" @click="submitSave">提交</a>
                    <a href="javascript:(0)" class="ezt-foot-sub" @click="saveAndAudit">提交并审核</a>   
                </div>  
                </div>     
            </ezt-footer>  
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {mapActions,mapGetters} from 'vuex';
import {Component,Watch} from 'vue-property-decorator';
import { INoop, INoopPromise } from '../../../helper/methods';
import {SupplierReturnService} from '../../../service/SupplierReturnService';
import ObjectHelper from '../../../common/objectHelper'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
   components:{
   },
   computed:{
       ...mapGetters({
           selectedGood:"publicAddGood/selectedGood",
           'materialSetting':'materialSetting',//物流设置
       })
   },
   methods:{
       ...mapActions({
           setSelectedGood:"publicAddGood/setSelectedGood",
       })
   }
})
export default class ReturnGood extends Vue{
    private cache = CachePocily.getInstance();
    private selectedGood: any[];
    private setSelectedGood: INoopPromise;
    private addBillInfo:any={};
    private addBeforeBillInfo:any={};
    /**
     * 输入数量的时候校验，初始值
     */
    private oldValue = 1;
    private materialSetting:any;
    mounted() {
        if(this.cache.getData(CACHE_KEY.SUPPLIERRETURN_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.SUPPLIERRETURN_ADDINFO));
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
            this.setSelectedGood(this.addBillInfo.goodList); 
        }
        (this.selectedGood||[]).forEach(item=> this.$set(item,'active',false));
    }
    /**
     * 提交
     */
    private submitSave(){
        //过滤掉物料中数量为0的物品；
        this.setSelectedGood(this.selectedGood.filter(checkItem => (checkItem.num&&checkItem.num!=0)));
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        }
        this.addBillInfo={},
        this.setSelectedGood([]);
        this.addBeforeBillInfo={};
        this.$toasted.success("提交成功！");
        this.$router.push("/supplierReturn");
    }
    /**
     * 提交并审核
     */
    private saveAndAudit(){
        let _this = this;
        this.setSelectedGood(this.selectedGood.filter(checkItem => (checkItem.num&&checkItem.num!=0)));
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("请添加物料！");
            return false;
        }
        this.$vux.confirm.show({
            // 组件除show外的属性
            onCancel () {//审核不通过
                _this.addBillInfo={},
                _this.setSelectedGood([]);
                _this.addBeforeBillInfo={};
                _this.$router.push("/supplierReturn");
            },
            onConfirm () {//审核通过
                _this.addBillInfo={},
                _this.setSelectedGood([]);
                _this.addBeforeBillInfo={};
                _this.$toasted.success("审核成功！");
                _this.$router.push({name:'SupplierReturn',params:{'purStatus':'已完成'}}); 
            },
            content:'确认审核该单据？',
            confirmText:"审核通过",
            cancelText:"审核不通过",
            hideOnBlur:true
        })
    }
    /**
     * 
     * 物料总数量\总金额
     */
    private get Total(){
      return this.selectedGood.reduce((ori,item)=>{
       ori.num = ori.num+Number(item.num);       
       ori.Amt = ori.Amt + (item.num * item.price);
      return ori;
      },{num:0,Amt:0});
    }
    /**
     * 左侧滑动物料删除
     */
    private handlerSwipe(item:any,active:boolean){     
        item.active = active;
    }
    /**
     * 修改物料的数量 
     */
    private numChange(item:any,info:any){
        if(item[info]==""||item[info]==0){
        item[info]=1;
        }
        if(!isNaN(item[info])){
        this.oldValue = item[info];//是一个数
        }else{
        item[info] = this.oldValue||1;
        }
        item[info] = parseFloat(item[info]);
        (this.addBeforeBillInfo.goodList).forEach((beforeInfo:any,beforeIndex:any)=>{
        if(item.id == beforeInfo.id && item[info]>beforeInfo[info] ){
            this.$toasted.show("收货数量不能超过采购数量！");
            item[info] = beforeInfo[info];
        }
        })
    }
     /**
     * 删除物料操作
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
    //选择物料
    private renderUrl(info:string){  
        let goodTerm = {};
        goodTerm={
            billsPageType: 'supplierReturn',
        } 
        if(this.addBillInfo.returnType == 'store'){//退货类型为配送退货时，单价根据参数控制
            this.$set(goodTerm,'showPrice',!this.materialSetting.show_back_price);
        }
        if(!this.addBillInfo.sourceBillno&&this.addBillInfo.returnType == 'supplier' && this.materialSetting.isAnyReturn){
            this.$set(goodTerm,'editPrice',true);//供应商退货（无源单号）并且任意退货， 价格可以编辑
        }
        this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件   
        this.cache.save(CACHE_KEY.SUPPLIERRETURN_ADDINFO,JSON.stringify(this.addBillInfo));
        this.cache.save(CACHE_KEY.SUPPLIERRETURN_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
        this.$router.push(info);
    } 
    /**
     * 返回上一页
     */
    private goBack(){
        this.addBillInfo={},
        this.setSelectedGood([]);
        this.addBeforeBillInfo={};
        this.$router.push('/supplierReturn')
    }
    
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
  }
.good-detail-l{
    display: inline-block;
    flex:.8;
}
.good-detail-l>div{
    display:flex;
    flex-direction: row;
    align-items: center;
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
    line-height: 3;
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
.good-detail-billno{
    font-size: 10px;
    color: #A3B3C2;
    letter-spacing: 0;
    margin: 12px 0px;
}
.ezt-detail-good{
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    // margin: 8px 10px;
    // padding: 12px 10px 12px 15px;
    transition: transform .5s;
    background: #fff;
    z-index: 2;
}
//物料明细结束 
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
.title-search-name.ezt-dense-box input{
    border: 1px solid #ccc;
}
// 左侧滑动删除
.swipe-transform{
    transform: translateX(-50px);
}
.ezt-detail-del{
    position: absolute;
    right: 10px;
    top: 30px;
    // background: pink;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 22px;
}
</style>


