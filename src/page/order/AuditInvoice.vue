<!-- 审核要货单 -->
<template>
    <div class="ezt-page-con AuditInvoice">
        <ezt-header  title="审核要货单" :back="true" @goBack="goBack" :isInfoGoback="true"></ezt-header>
        <div class="ezt-main">
            <div class="ezt-add-content">
                <ul class="ezt-title-search">
                    <li>
                        <span class="title-search-name">单号：</span>{{addBillInfo.billNo}}
                    </li>
                    <li>
                        <span class="title-search-name">来货单位：</span>{{addBillInfo.supplierName}}
                    </li>
                    <li>
                        <span class="title-search-name">要货日期：</span>
                        <input type="text" class="ezt-middle" disabled v-model="addBillInfo.orderDate" :max="addBillInfo.arriveDate" ref="startDate">
                    </li>
                    <li class="select-list" v-if="!InterfaceSysTypeBOH">
                        <span class="title-search-name is-required">到货日期：</span>
                        <span>
                            <ezt-canlendar ref="endDate" v-model="addBillInfo.arriveDate" :min="addBillInfo.arrivalDate" :defaultValue="new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd')" placeholder="到货日期" @change="selectDateChange" type="text" :formate="'yyyy-MM-dd'" class="input-canlendar">
                           </ezt-canlendar>
                        </span>
                    </li>
                    <li>
                        <x-input title="备注：" :max="100" v-model="addBillInfo.memo"></x-input>
                    </li>
                    <li>
                        <span class="title-search-name is-required">物料明细</span>
                        <span class="title-search-right" @click="renderUrl('/publicAddGood')">
                        <i class="fa fa-angle-right" aria-hidden="true"></i>
                        </span>
                    </li> 
                </ul>
                <div v-if="selectedGood.length==0" class="done-none">
                    <div></div>
                    <span>暂无物品明细</span>
                </div>
                <ul v-if="selectedGood.length>0">
                    <li class="good-detail-content" v-for="(item,index) in selectedGood" :key="index"> 
                        <div class="ezt-detail-good" v-swipeleft="handleSwipe.bind(this,item,true)" 
                        v-swiperight="handleSwipe.bind(this,item,false)" :class="{'swipe-transform':item.active}">
                            <div class="good-detail-l">
                                <div>
                                    <span class="good-detail-name">{{item.name || item.goodsName}}
                                        <span v-if="!InterfaceSysTypeBOH" class="good-detail-sort">（规格）</span>
                                    </span>
                                </div>
                                <div> 
                                    <span class="good-detail-billno">{{item.goodsCode || ''}}</span>
                                     <span class="good-detail-sort" v-if="InterfaceSysTypeBOH">
                                         ￥{{item.price||item.distributePrice1}}/{{item.utilname||item.unitName}}
                                    </span>
                                    <span class="good-detail-sort">数量：{{item.num || item.finalOrderQty}}</span>
                                </div> 
                            </div>
                            <div class="good-detail-r">
                                <div class="park-input">
                                    <span class="title-search-name">备注：{{item.remark || item.memo}}</span>
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
                    <b>数量</b><span>{{Total.num || Total.finalOrderQty}}</span>
                    <b>，￥</b><span>{{Total.Amt.toFixed(2)}}</span>
                </div>
                <div class="ezt-foot-button">
                    <a href="javascript:(0)" class="ezt-foot-storage" @click="saveReceive"> 提交</a>  
                    <a href="javascript:(0)" class="ezt-foot-sub" @click="confirmReceive"> 提交并审核</a>   
                </div>  
            </div>
           </ezt-footer>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Watch} from "vue-property-decorator";
import ObjectHelper from '../../common/objectHelper'
import { INoop, INoopPromise } from '../../helper/methods';
import { mapActions, mapGetters } from 'vuex';
import { FactoryService } from '../../factory/FactoryService';
import { IOrderGoodsService } from '../../interface/service/IOrderGoodsService';
import { CachePocily } from "../../common/Cache";
import { ECache } from "../../enum/ECache";
import CACHE_KEY from '../../constans/cacheKey';
import formData from '../../dictory/formData';
@Component({
    computed:{
        ...mapGetters({
            'selectedGood':'publicAddGood/selectedGood',//已经选择好的物料
            'InterfaceSysTypeBOH':'InterfaceSysTypeBOH', //BOH接口
            'systemParamSetting':"systemParamSetting",//系统设置参数   
            'materialSetting' : 'materialSetting',//物流参数设置
        })
    },
    methods:{
        ...mapActions({
            setSelectedGood:"publicAddGood/setSelectedGood",
        })
    }
})
export default class OrderGoods extends Vue{
    private cache = CachePocily.getInstance();
    private materialSetting:any;
    private service : IOrderGoodsService;
    private InterfaceSysTypeBOH:boolean;
    private selectedGood: any[];
    private setSelectedGood: INoopPromise;
    private addBillInfo: any = {
        orderDate:new Date(new Date().setDate(new Date().getDate() - 6)).format('yyyy-MM-dd'),
        arriveDate:new Date(new Date().setDate(new Date().getDate())).format('yyyy-MM-dd'),
    };
    private addBeforeBillInfo: any = {};
    private type:string='';
    private delId:any[] = []; //把刪除的物品id存
    mounted(){
        
    }
    created(){
        const factory = FactoryService.getInstance().createFactory();
        this.service = factory.createOrderGood();
        if(this.cache.getData(CACHE_KEY.ORDER_ADDINFO)){
            this.addBillInfo = JSON.parse(this.cache.getDataOnce(CACHE_KEY.ORDER_ADDINFO));
        }
        if(this.selectedGood&&this.selectedGood.length>0){
            formData.modifyParams(this.selectedGood,{//将选择物料中的字段转为当前模块后台想要的字段
                num:"finalOrderQty",  
                price:"distributePrice1",    
                remark:'memo',  
                name:'goodsName',
                material_id:"goodsId"        
            })
        }  
        this.addBeforeBillInfo = ObjectHelper.serialize(this.addBillInfo);//深拷贝
        if(this.selectedGood.length==0&&this.addBillInfo.detailList){
            this.setSelectedGood(this.addBillInfo.detailList);         
        }
        (this.selectedGood||[]).forEach(item=> this.$set(item,'active',false));
        
    }
     /**
     * 要货到货日期限制
     */
     private selectDateChange(val:any){
      (<any>this.$refs.startDate).setMax(new Date(val));
      (<any>this.$refs.endDate).setMin(new Date(val));
     }
    
    /**
     * 物品总数量、总金额
     */
     private get Total(){
        return this.selectedGood.reduce((ori,item) => {
            if(item.finalOrderQty){
                ori.finalOrderQty = ori.finalOrderQty + Number(item.finalOrderQty);   
                if(item.distributePrice1){
                    ori.Amt = ori.Amt + (item.finalOrderQty * item.distributePrice1);
                }else if(item.Amt){
                    ori.Amt = ori.Amt + (item.amt);
                }else{
                    ori.Amt = 0;
                    ori.finalOrderQty = 0;
                }
                return ori;
           }else{
                ori.num = ori.num+Number(item.num); 
                if(item.price){
                    ori.Amt = ori.Amt + (item.num * item.price);
                }else if(item.Amt){
                    ori.Amt = ori.Amt + (item.amt);
                }else{
                    ori.Amt = 0;
                    ori.num = 0;
                } 
                return ori;
           }
      },{num:0,Amt:0,distributePrice1:0,finalOrderQty:0});
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
    private delAction(item:any,delId:Array<any>){
        let _this = this;
        this.$vux.confirm.show({
            onCancel () {
            },
            onConfirm (i:any) {
                let newIndex = _this.selectedGood.findIndex((info:any,index:any)=>{
					return item.id == info.id;
                })
				_this.delId.push(_this.selectedGood[newIndex].id);
                _this.selectedGood.splice(newIndex,1);
				_this.cache.save(CACHE_KEY.ORDER_DELETEID,JSON.stringify(_this.delId))
            },
            content:'请确认是否删除该物料?'
        })
    }
     /**
     * 选择物料
     */
    private renderUrl(info: string) {
        let goodTerm = {};
        let material_param ={};
        goodTerm={
            billsPageType: 'orderGood',
            showPrice: !this.materialSetting.show_order_price
        }  
        material_param={
            id:this.addBillInfo.id,
            supplierId : this.addBillInfo.supplierId,
            orderDate : this.addBillInfo.orderDate,
            orderType : 'SCM_ORDER_TYPE_RULE'    
        }
        formData.modifyParams(this.selectedGood,{
            finalOrderQty:"num",//将当前模块后台想要的字段转换为选择物料所显示的公共字段
            distributePrice1:'price',
            memo:'remark',
            goodsName:'name',
            goodsId:"material_id"   
        })    
        this.cache.save(CACHE_KEY.MATERIAL_LIMIT,JSON.stringify(goodTerm));//添加物料的条件
        this.cache.save(CACHE_KEY.MATERIAL_PARAM,JSON.stringify(material_param))
        this.cache.save(CACHE_KEY.ORDER_ADDINFO,JSON.stringify(this.addBillInfo))
        this.cache.save(CACHE_KEY.ORDER_ADDBEFOREINFO,JSON.stringify(this.addBeforeBillInfo))
        this.setSelectedGood(this.selectedGood)     
        this.$router.push(info);
    } 
    /**
     * 提交
     */
    private saveReceive(rows:Array<any>,delId:Array<any>){
         if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("当前物料数量为0，请添加物料！");
            return false;
         } 
        if(!this.InterfaceSysTypeBOH){
            this.addBillInfo={};
            this.setSelectedGood([]);
            this.addBeforeBillInfo={};
            this.$toasted.success("保存成功！");
            this.$router.push('/orderGood');
        }else{
            if(this.cache.getData(CACHE_KEY.ORDER_DELETEID)){
               this.delId = JSON.parse(this.cache.getData(CACHE_KEY.ORDER_DELETEID));
            }
            var rows =[];
            this.selectedGood.forEach((item:any) => {
			   let obj = {
                "orderCategoryId": item.orderCategoryId,
                "salesAmt":item.salesAmt,
                "minSingleStock":item.minSingleStock,
                "isNew": item.minSingleStock,
                "billId": item.billId,
                "id": item.id,
                "orderUnitName":item.orderUnitName,
                "finalQty": item.finalQty,
                "maxSingleStock":item.maxSingleStock,
                "orderCategoryName": item.orderCategoryName,
                "finalOrderQty": item.finalOrderQty,
                "currentQty":item.currentQty,
                "orderUnitId": item.orderUnitId,
                "unitName": item.unitName,
                "goodsName": item.goodsName,
                "sendDate": item.sendDate,
                "unitQty":item.unitQty,
                "orderQty":item.orderQty,
                "estimateQty":item.estimateQty,
                "sysQty":item.sysQty,
                "distributePrice1":item.distributePrice1,
                "onPassageQty": item.onPassageQty,
                "goodsId": item.goodsId,
                "orderUnitRates":item.orderUnitRates,
                "busiDate": item.busiDate,
                "unitId": item.unitId,
                "upQty": item.upQty,
                "goodsCode": item.goodsCode,
                "memo":item.memo,
            };
			rows.push(obj);    
            });  
            let data={   
                "supplierName": this.addBillInfo.supplierName,
                "billNo": this.addBillInfo.billNo,
                "organId": this.addBillInfo.organId,
                "totalAmt": this.addBillInfo.totalAmt,
                "organName": this.addBillInfo.organName,
                "busiDate": this.addBillInfo.busiDate,
                "creator": this.addBillInfo.creator,
                "orderDate": this.addBillInfo.orderDate,
                "upBillId": this.addBillInfo.upBillId,
                "orderStatus":this.addBillInfo.orderStatus,
                "arrivalDate":this.addBillInfo.arrivalDate,
                "id":this.addBillInfo.id,
                "supplierId":this.addBillInfo.supplierId,
                "createDate":this.addBillInfo.createDate,
                "auditStatus": "SCM_AUDIT_NO",   //提交
                "memo": this.addBillInfo.memo,
                "receiveOrganName": this.addBillInfo.receiveOrganName,
                "orderType": this.addBillInfo.orderType,
                "receiveOrganId":this.addBillInfo.receiveOrganId,
                "detailList":rows,
                "delIds":this.delId || '',
            }  
        this.service.getAuditorderlistyes(data).then(res=>{ 
            this.addBillInfo={};
            this.setSelectedGood([]);
            this.addBeforeBillInfo={};
            this.$toasted.success("提交成功！");
            this.$router.push('/orderGood');
        },err=>{
            this.$toasted.show(err.message)
        })
      }
    }
    /**
     * 提交并审核
     */
    private confirmReceive(index:any){
        let _this = this;
        if(!this.selectedGood||this.selectedGood.length<=0){
            this.$toasted.show("当前物料数量为0，请添加物料！");
            return false;
        }
         this.$vux.confirm.show({
            /**
             * 审核不通过
             */
            onCancel () {
               
            },
            /**
             * 审核通过
             */
            onConfirm (row:Array<any>) { 
                if(!_this.InterfaceSysTypeBOH){
                    _this.setSelectedGood([]);
                    _this.$toasted.success("审核成功！");
                    _this.$router.push({name:'OrderGood',params:{'purStatus':'待支付'}}); 
                }else{
                    var row =[];
                    _this.selectedGood.forEach((item:any) => {
                        let objList = {
                            "orderCategoryId": item.orderCategoryId,
                            "salesAmt":item.salesAmt,
                            "minSingleStock":item.minSingleStock,
                            "isNew": item.minSingleStock,
                            "billId": item.billId,
                            "id": item.id,
                            "orderUnitName":item.orderUnitName,
                            "finalQty": item.finalQty,
                            "maxSingleStock":item.maxSingleStock,
                            "orderCategoryName": item.orderCategoryName,
                            "finalOrderQty": item.finalOrderQty,
                            "currentQty":item.currentQty,
                            "orderUnitId": item.orderUnitId,
                            "unitName": item.unitName,
                            "goodsName": item.goodsName,
                            "sendDate": item.sendDate,
                            "unitQty":item.unitQty,
                            "orderQty":item.orderQty,
                            "estimateQty":item.estimateQty,
                            "sysQty":item.sysQty,
                            "distributePrice1":item.distributePrice1,
                            "onPassageQty": item.onPassageQty,
                            "goodsId": item.goodsId,
                            "orderUnitRates":item.orderUnitRates,
                            "busiDate": item.busiDate,
                            "unitId": item.unitId,
                            "upQty": item.upQty,
                            "goodsCode": item.goodsCode,
                            "memo":item.memo,
                        };
                        row.push(objList);    
                    });  
                    let data={   
                        "supplierName": _this.addBillInfo.supplierName,
                        "billNo": _this.addBillInfo.billNo,
                        "organId": _this.addBillInfo.organId,
                        "totalAmt": _this.addBillInfo.totalAmt,
                        "organName": _this.addBillInfo.organName,
                        "busiDate": _this.addBillInfo.busiDate,
                        "creator": _this.addBillInfo.creator,
                        "orderDate": _this.addBillInfo.orderDate,
                        "upBillId": _this.addBillInfo.upBillId,
                        "orderStatus":_this.addBillInfo.orderStatus,
                        "arrivalDate":_this.addBillInfo.arrivalDate,
                        "id":_this.addBillInfo.id,
                        "supplierId":_this.addBillInfo.supplierId,
                        "createDate":_this.addBillInfo.createDate,
                        "auditStatus": "SCM_AUDIT_YES",   //提交并审核
                        "memo": _this.addBillInfo.memo,
                        "receiveOrganName": _this.addBillInfo.receiveOrganName,
                        "orderType": _this.addBillInfo.orderType,
                        "receiveOrganId":_this.addBillInfo.receiveOrganId,
                        "detailList":row,
                    }  
                _this.service.getAuditorderlistyes(data).then(res=>{ 
                    _this.addBillInfo={};
                    _this.setSelectedGood([]);
                    _this.addBeforeBillInfo={};
                    _this.cache.clear();
                    _this.$toasted.success("审核成功！");
                    _this.$router.push({name:'OrderGood',params:{'purStatus':'已完成'}}); 
                },err=>{
                    _this.$toasted.show(err.message)
                })
              }
            },
            content:'确认审核该单据？',
            confirmText:"审核通过",
            cancelText:"审核不通过",
            showCancelButton:!_this.InterfaceSysTypeBOH,
            hideOnBlur:true
        })
    }
    private goBack(){ 
        let _this = this;
        if((this.addBillInfo&&this.addBillInfo.arriveDate || this.addBillInfo.remark) ||this.selectedGood.length>0){
             this.$vux.confirm.show({
                // 组件除show外的属性
                onCancel () {
                },
                onConfirm () {
                    _this.addBillInfo={}
                    _this.setSelectedGood([])
                    _this.addBeforeBillInfo={}
                    _this.cache.clear()
                    _this.$router.push('/orderGood')
                },
                content:"返回后，本次操作记录将丢失，请确认是否离开？"
            })
        }else{
            this.$router.push('/orderGood')
        }       
    }
}
</script>
<style lang="less" scoped>
input{
    text-align: right;
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
</style>