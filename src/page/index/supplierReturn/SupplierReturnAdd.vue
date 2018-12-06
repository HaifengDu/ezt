<template>
    <div class="ezt-page-con">
        <ezt-header :back="true" title="添加供应商退货单" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li class="select-list">
                        <span class="title-search-name is-required">仓库：</span>
                        <span class="title-select-name item-select">
                            <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.warehouse" 
                                @change="handlerBillType('warehouse','您已维护物料信息，如调整仓库，须重新选择退货类型、供货机构、源单号、物料信息。')"
                                :class="[{'selectError':billFiles[0].warehouse}]">
                                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                                <option :value="item.id" :key="index" v-for="(item,index) in pullList.warehouseList">{{item.name}}</option>
                            </select>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name is-required">退货类型：</span>
                        <span class="title-select-name item-select">
                            <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.returnType" 
                                @change="handlerBillType('returnType','您已维护物料信息，如调整退货类型，须重新选择供货机构、源单号、物料信息。')"
                                :class="[{'selectError':billFiles[1].returnType}]">
                                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                                <option :value="item.id" :key="index" v-for="(item,index) in pullList.returnType">{{item.typeName}}</option>
                            </select>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name is-required">供应商：</span>
                        <span class="title-select-name item-select">
                            <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.supplier" 
                                @change="handlerBillType('supplier','您已维护物料信息，如调整供货机构，须重新选择源单号及物料。')"
                                :class="[{'selectError':billFiles[2].supplier}]">
                                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                                <option :value="item.id" :key="index" v-for="(item,index) in pullList.supplierList">{{item.name}}</option>
                            </select>
                        </span>
                    </li>
                    <li class="select-list">
                        <span class="title-search-name" :class="[{'is-required':isRequired}]">源单号：</span>
                        <span class="title-select-name item-select">
                            <select value placeholder="请选择" class="ezt-select" v-model="addBillInfo.sourceBillno" 
                                @change="handlerBillType('sourceBillno','您已维护物料信息，如调整源单号，须重新选择物料。')"
                                :class="[{'selectError':billFiles[3].sourceBillno}]">
                                <option value="" style="display:none;" disabled="disabled" selected="selected">请选择</option>
                                <!-- （1）可退数量为0，隐藏（2）有待处理的退货信息，样式 置灰（3）点击置灰选项 弹框 提示 -->
                                <option v-if="item.returnNum!=0" :class="[{'disNum':item.noHand!=0}]" :value="item"
                                 :key="index" v-for="(item,index) in sourceBillList"><span v-if="item.noHand!=0">禁用</span>{{item.sourceBillName}}</option>
                            </select>
                        </span>
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
                                    <span class="good-detail-sort" v-if="(addBillInfo.returnType == 'store' && materialSetting.show_back_price)||addBillInfo.returnType == 'supplier'">￥{{item.price}}/{{item.utilname}}</span>
                                    <span class="title-search-name ezt-dense-box">{{item.num}}</span>                         
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
                    <div class="ezt-foot-total" v-if="this.selectedGood.length>0">合计：
                        <b>品项</b><span>{{this.selectedGood.length}}</span>，
                        <b>数量</b><span>{{Total.num}}</span>，
                        <b v-if="(addBillInfo.returnType == 'store'&&materialSetting.show_back_price)||addBillInfo.returnType == 'supplier'">￥</b>
                        <span v-if="(addBillInfo.returnType == 'store'&&materialSetting.show_back_price)||addBillInfo.returnType == 'supplier'">{{(Total.Amt).toFixed(2)}}</span>
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
import {Component,Watch} from 'vue-property-decorator';
import {mapActions,mapGetters} from "vuex";
import { FactoryService } from '../../../factory/FactoryService';
import { ISupplierReturnService } from '../../../interface/service/ISupplierReturnService';
import { INoop, INoopPromise } from '../../../helper/methods';
import ObjectHelper from '../../../common/objectHelper'
import { CachePocily } from "../../../common/Cache";
import { ECache } from "../../../enum/ECache";
import CACHE_KEY from '../../../constans/cacheKey'
@Component({
    components:{
    },
    computed:{
        ...mapGetters({
            'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
            'materialSetting':'materialSetting',//物流设置
        })
    },
    methods:{
        ...mapActions({
            'setSelectedGood':'publicAddGood/setSelectedGood',
        })
    }
})
export default class ReturnGood extends Vue{
    private cache = CachePocily.getInstance();
    private service : ISupplierReturnService;
    /**
     * 调出仓库列表
     *  */
    private orderType:any[] = [];
    private addBillInfo:any = {
        warehouse:'',
        returnType:'',
        supplier:'',
        sourceBillno:''
    };
    /**
     * 下拉列表 
     */
    private pullList: any = {
        warehouseList: [],  //仓库 列表
        returnType: [{     //退货类型
            id:'store',
            typeName:'配送退货'
        },{
            id:'supplier',
            typeName:'供应商退货'
        }],
        supplierList: [],  //供应商列表
        sourceBillList: [] //源单号 列表
    };
    /**
     * 源单号列表
     */
    private sourceBillList:any[] = [];
    private _isRequired:boolean;
    private selectedGood:any[];//store中selectedGood的值
    private setSelectedGood:INoopPromise;//store中给selectedGood赋值
    private materialSetting:any;
    /**
     * 源单号 picker中value值
     */
    private :any[]=[{}];
    private values:[{}];
    /**
     * 自定义select 
     */
    private sourceBillData:any = {
        isSourceVisible:false,
        sourceList:[{
            values:['']
        }],
        values:['']
    };
    private addBeforeBillInfo:any = {
        sourceBillnoName:''
    };//保存第一次选择的单据信息，以免在弹框 取消的时候还原之前的值
     /**
     * 枚举 表单字段
     */
    private billFiles=[
        {id:"warehouse",msg:"请选择仓库",warehouse:false},
        {id:"returnType",msg:"请选择退货类型",returnType:false},
        {id:"supplier",msg:"请选择供应商",supplier:false},  
        {id:"sourceBillno",msg:"请选择源单号",sourceBillno:false}     
    ];
    mounted(){
      
    }  
    created(){
        const factory = FactoryService.getInstance().createFactory();
        this.service = factory.createSupplierReturn();
        this.getSupplierList(); //供应商下拉列表
        this.getWarehouseList(); //仓库下拉列表
        if(this.cache.getData(CACHE_KEY.SOURCERBILLLIST)){
            this.sourceBillList = JSON.parse(this.cache.getDataOnce(CACHE_KEY.SOURCERBILLLIST));

            this.sourceBillList.forEach((item,index)=>{
                this.sourceBillData.values.push(item.sourceBillName);            
            })
            this.$set(this.sourceBillData.sourceList[0],'values',this.sourceBillData.values);
        }else{
            this.getSourceBillList();
        } 
        this.addBillInfo.warehouse = this.pullList.warehouseList[0].id;
        if(this.cache.getData(CACHE_KEY.SUPPLIERRETURN_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.SUPPLIERRETURN_ADDINFO));
        }
       
        this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
        //  this.getGoodList();
        (this.selectedGood||[]).forEach(item=>item.active = false);
        console.log(this.materialSetting,'00000');
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
     * 退货类型为配送退货，必填源单号
     */
    private get isRequired(){
        return this.addBillInfo.returnType == 'store'||
        (this.addBillInfo.returnType == 'supplier' && !this.materialSetting.isAnyReturn);
    }
    private set isRequired(isRequired){
        this._isRequired == isRequired;
    }
    private get dataList(){
        let dateSlots = [
            {
                flex:1,
                values:this.sourceBillList,
                className:'slot1',
                textAlign:'center'
            }
        ]
        return dateSlots
    }
    /**
     * 获取  仓库列表
     */
    private getWarehouseList(){
        this.pullList.warehouseList = [{
            name: '仓库1',
            id: 1
        },{
            name: '仓库2',
            id: 2
        }]
    }
    /**
     * 获取 供应商列表
     */
    private getSupplierList(){
        this.pullList.supplierList = [{
            name: '供应商1',
            id: 1
        },{
            name: '供应商2',
            id: 2
        }]
    }
    /**
     * 获取 源单号列表
     */
    private getSourceBillList(){
        this.service.getSourceBillList().then(res=>{
            this.sourceBillList = res.data.data;
            this.sourceBillList.forEach((item,index)=>{
                this.sourceBillData.values.push(item.sourceBillName);            
            })
            this.$set(this.sourceBillData.sourceList[0],'values',this.sourceBillData.values);
        },err=>{
            this.$toasted.show(err.message);
        })
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
     * 选择仓库、供应商、退货类型、源单号
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
                    _this.billFiles.forEach(item=>{
                        if(val == 'warehouse'&&item.id !='warehouse'){
                           _this.addBillInfo[item.id] = '';
                           _this.addBeforeBillInfo[item.id] = '';
                        }                        
                    })
                    if(val == 'returnType'){//退货类型
                        _this.addBillInfo['supplier'] = '';
                        _this.addBillInfo['sourceBillno'] = '';
                        _this.addBeforeBillInfo['supplier'] = '';
                        _this.addBeforeBillInfo['sourceBillno'] = '';
                    }
                    if(val == 'supplier'){//供货机构 
                        _this.addBillInfo['sourceBillno'] = '';
                        _this.addBeforeBillInfo['sourceBillno'] = '';
                    }
                    if(val == 'sourceBillno' && _this.addBillInfo[val].noHand!=0){
                        _this.changeSourceBill(val);
                    }else{
                        _this.setSelectedGood([]);
                        _this.addBeforeBillInfo[val]=_this.addBillInfo[val];
                    }
                   
                },
                content:title
            })
        }else{
            if(val == 'sourceBillno'){
                if(this.addBillInfo.sourceBillno.noHand!=0){
                    this.changeSourceBill(val);
                }else{
                    this.addBeforeBillInfo[val] = this.addBillInfo[val];
                    this.billFiles.forEach(item=>{
                        if(item.id == val){
                            item[val]= false;
                        }
                    }) 
                }               
            }else{
                _this.addBeforeBillInfo[val]=_this.addBillInfo[val];
                if(!_this.isRequired){//退货类型为配送退货 源单号必填
                    this.billFiles[3]['sourceBillno'] = false;
                }
            
                this.billFiles.forEach(item=>{
                    if(item.id == val){
                        item[val]= false;
                    }
                })  
            }
           
                 
        }
    }
    /**
     * 切换源单号 有未处理单据弹框校验显示
     */
    private changeSourceBill(val:any){
        let _this = this;     
        this.$vux.confirm.show({
            onConfirm(){
            },
            onCancel(){
                _this.addBillInfo.sourceBillno=_this.addBeforeBillInfo.sourceBillno;
            },
            confirmText:'查看',
            content:"该收货单有待处理的退货单："+ _this.addBillInfo.sourceBillno.billNo
        })
    }
      /**
     * 提交
     */
    private saveAllot(){
        for(let i=0;i<this.billFiles.length;i++){
            let item = this.billFiles[i];
            if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                if(!this.isRequired&&item.id=='sourceBillno'){//退货类型为供应商退货，非必填
                    item[item.id] = false;
                }else{
                    this.$toasted.show(item.msg);
                    item[item.id]=true;
                    return false;
                }
               
            }
        }
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
    private confirmAllot(){
        let _this = this;
        for(let i=0;i<this.billFiles.length;i++){
            let item = this.billFiles[i];
            if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                if(!this.isRequired&&item.id=='sourceBillno'){//退货类型为供应商退货，非必填
                    item[item.id] = false;
                }else{
                    this.$toasted.show(item.msg);
                    item[item.id]=true;
                    return false;
                }
              
            }
        }
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
                _this.$router.push('/supplierReturn'); 
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
     * 选择物料
     */
    private renderUrl(info:string){
        let goodTerm = {}
        if(this.addBillInfo){
            let _this = this;
            for(let i=0;i<this.billFiles.length;i++){
                let item = this.billFiles[i];
                if(!this.addBillInfo[item.id]||this.addBillInfo[item.id]==""){
                    if(!this.isRequired&&item.id=='sourceBillno'){//退货类型为供应商退货，非必填
                        item[item.id] = false;
                    }else{
                        this.$toasted.show(item.msg);
                        item[item.id]=true;
                        return false;
                    }
                   
                }
            }
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
            this.cache.save(CACHE_KEY.SOURCERBILLLIST,JSON.stringify(this.sourceBillList));
            this.cache.save(CACHE_KEY.SUPPLIERRETURN_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo));
            this.$router.push(info);
        }      
    }
    /**
     * 返回上一页
     */
    private goBack(){
         let _this = this;
        if((this.addBillInfo&&this.addBillInfo.warehouse)||this.selectedGood.length>0){
            this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {
                    console.log(this) // 非当前 vm
                },
                onConfirm () {
                    _this.addBillInfo={},
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo={};
                    _this.$router.push('/supplierReturn');
                },
                content:"返回后，本次操作记录将丢失，请确认是否离开？"
            })
        }else{
            this.$router.push('/supplierReturn')
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
        // background: pink;
        width: 50px;
        height: 50px;
        text-align: center;
        margin: 10px 0px;
        font-size: 22px;
    }
   
    //物料明细结束 
    .ezt-select .disNum{
        color: red;
        border-bottom: 1px solid #000;
    }
</style>


