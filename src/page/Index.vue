  <!--首页的页面-->
<template>
 <div class="ezt-page-con">
    <ezt-header :back="false" custom>       
       <div slot="action" class="title-date-position" v-if="!InterfaceSysTypeBOH">
           <span ref="canlendar">日结</span>
       </div>
       <div slot="title" class="indexPop" @click="handleSelect">
         <span >{{user.auth.store_name||'-'}}</span>
         <i class="icon-trun-on" v-if="!titleSelect"></i>
         <i class="icon-trun-on off" v-if="titleSelect"></i>       
       </div>
    </ezt-header>
    <div class="header-mine" @click="renderUrl('/mine')">
      <a class="mine-css"></a>
    </div>         
    <div class="ezt-main">
      <div class="header-date">        
        <div class="busiDate">
            <span>{{user.auth.busi_date}}</span>
        </div>
      </div>
       <div class="storeList" v-if="titleSelect">
         <div class="ezt-tab">
           <ul>
             <li :class="[{'active':!tabStatus}]" @click="handlerStatus(false)">最近查看过的门店</li>
             <li :class="[{'active':tabStatus}]" @click="handlerStatus(true)">全部门店</li>
           </ul>
         </div>
          <div class="ezt-history" v-if="!tabStatus">
            <ul>
                <li>历史记录</li>
            </ul> 
          </div>
          <div class="ezt-checkList" v-if="tabStatus">
            <!-- <div>搜索</div> -->
            <mt-index-list>
              <mt-index-section :index="letter" :key="index" v-for="(stores, letter, index) in storeGroupData">
                <div @click="handlerStore(item)" class="list-line" :key="index" v-for="(item,index) in stores">{{item.text}}</div>
              </mt-index-section>
            </mt-index-list>
          </div>
        </div>
        <ul class="icon-menu"  v-if="!titleSelect"><!--主页内容菜单-->
            <!--<li @click="noAction()">
              <div class="jiadan"></div>
              <span>加单</span></li> -->
            <li @click="renderUrl('/receiveGood')">
              <div class="shouhuo"><span v-if='!InterfaceSysTypeBOH' class="ezt-reddot-s"></span></div>
              <span>收货</span></li>
            <li @click="renderUrl('/supplierReturn')">
              <div class="tuihuo"></div>
              <span>退货</span></li>
            <li @click="renderUrl('/stockTaking')">
              <div class="panku"></div>
              <span>盘库</span></li>
            <li @click="renderUrl()" v-if='!InterfaceSysTypeBOH'>
              <div class="kucun"><span v-if='!InterfaceSysTypeBOH' class="ezt-reddot-s"></span></div>
              <span>库存初始化</span></li>
            <li @click="renderUrl('/spilledSheet')" v-if='!InterfaceSysTypeBOH'>
              <div class="overflowing"></div>
              <span>损溢</span>
            </li>
            <li @click="renderUrl('/inStoreAllotment')" v-if='!InterfaceSysTypeBOH'>
              <div class="diaobo"></div>
              <span>店内调拨</span>
            </li>
            <li @click="renderUrl('/storeAllotment')" v-if='!InterfaceSysTypeBOH'>
              <div class="shouhuo"></div>
              <span>店间平调</span>
            </li>
            <li @click="renderUrl('/leadbackMaterial')" v-if='!InterfaceSysTypeBOH'>
              <div class="overflowing"></div>
              <span>领退料</span>
            </li>
        </ul>
        <!--内容-->
        
    </div>
    <ezt-footer v-if="!titleSelect">
      <ul slot="confirm" class="ezt-footer-tab">
        <li @click="renderUrl('/')" class="active">
          <span class="footer-index"></span>
          <div>首页</div>
        </li>
        <li @click="renderUrl('/orderGood')">
          <span class="footer-order"></span>
          <div>订货</div>
        </li>
        <li @click="renderUrl('/chartContent')" v-if='!InterfaceSysTypeBOH'>
          <span class="footer-chart"></span>
          <div>报表</div>
        </li>
      </ul>
    </ezt-footer>
  </div>

</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
import IUser from "../interface/IUserModel"
import { FactoryService } from "../factory/FactoryService";
import { IIndexService } from '../interface/service/IIndexService';
import {mapGetters,mapActions} from "vuex";
import {maskMixin} from "../helper/maskMixin";
import ErrorMsg from "../model/ErrorMsg";
import commonService from '../service/commonService.js';
import {EGoodType} from '../enum/EGoodType';
import _ from "lodash";
declare var mobiscroll:any;//全局定义日历
@Component({
   components:{
    //  'ezt-header':eztHeader
   },
   mixins:[maskMixin],
   computed:{
     ...mapGetters({
       "user":"user",
      'isFirstStore':'initStock/isFirstStore',//是否是新门店未初始化
       InterfaceSysTypeBOH:'InterfaceSysTypeBOH'
     })   
   },
  methods:{
    ...mapActions({
      'setIsFirstStore':'initStock/setIsFirstStore'//是否是新门店未初始化
    })
  }
})
export default class Index extends Vue{
   private EGoodType = EGoodType;//添加物料限制 
   /**
    * 库存初始化门店是否是第一次
    */
   private isFirstStore:boolean;
   private selected = 'index';
   private service:IIndexService;
   private user:IUser;
   private titleSelect:boolean=false;
   private newEle:any={};
   private addMaskClickListener:(...args:any[])=>void;
   private showMask:()=>void;
   private hideMask:()=>void;
   private storeGroupData:{[index:string]:any[]} = {};
   private tabStatus:boolean=true;//门店下拉默认显示全部门店 
   private testData:any[];
   private InterfaceSysTypeBOH:boolean;
    created() {
      const factory = FactoryService.getInstance().createFactory();
      this.service = factory.createIndex();
      this.testData = this.user.auth.storeAll;
      this.storeGroupData = commonService.sortLetter(this.user.auth.storeAll||[]); 
    }
    mounted(){     
      //日历
      mobiscroll.date(this.$refs.canlendar, {
          theme: 'material', 
          display: 'bottom',
          lang: 'zh',
          dateFormat:'yyyy-mm-dd',
          valid:[
            {start: new Date(new Date().getFullYear(),1,1),end: new Date(new Date().getFullYear(),1,1)},
            {start: new Date(new Date().getFullYear(),2,1),end: new Date(new Date().getFullYear(),2,1)},
            {start: new Date(new Date().getFullYear(),12,1),end: new Date(new Date().getFullYear(),12,1)},
          ],
          onSet: (val:{
              valueText:string
          })=>{
            this.checkDate(val.valueText);
          },
          onShow:(event:any,inst:any)=>{
            // this.hideMask();
            this.titleSelect=false;
          }
      });
      // this.addMaskClickListener(()=>{//点击遮罩隐藏下拉
      //   this.titleSelect=!this.titleSelect; 
      //   // this.hideMask();
      // });
    }
    //首页菜单跳转
    private renderUrl(info:string){
      if(info){
        this.$router.push(info);
      }else{
        if(this.isFirstStore){
          this.$router.push('/initSet');
        }else{
          this.$router.push('/initStock');
        }
      }        
    }
    //日结事件
    private checkDate(date:string){
      this.service.checkDay(date).then(res=>{
        console.log(res,'res00000')
      },err=>{
        this.$toasted.error(err.message);
      })
    }
    //顶部选择门店下拉点击事件
    private handleSelect(){
      if(!this.InterfaceSysTypeBOH){ 
          this.titleSelect=!this.titleSelect; 
      }
    }
    //门店下拉列表中切换门店事件
    private handlerStore(item:any){
      console.log(item);
      this.titleSelect = false;
      this.$router.push("/");
      // user.auth.store_name=item.storeName;
    }
    private handlerStatus(item:boolean){
      this.tabStatus = item;
    }
    private noAction(){
      this.$toasted.show("暂未开通！");
    }
   
}
</script>

<style lang="less" scoped> 
   .icon-menu {
    width: 100%;
    margin-top: 26px;
  }
  .icon-menu li {
    width: 33.3%;
    float: left;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    border-right: 1px solid #E1ECFF;
    border-bottom: 1px solid #E1ECFF;
  }

  .icon-menu li:nth-child(4n) {
    border-right: none;
  }

  .icon-menu .yaohuo, .shouhuo, .tuihuo, .panku, .jiadan, .kucun ,.overflowing,.diaobo{
    width: 64px;
    height: 64px;
    display: inline-block;
    position: relative;
  }
  .ezt-reddot-s{
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background: red;
    position: absolute;
    top: 0px;
    right: -4px;
  }

  .icon-menu .yaohuo {
    background: url(../assets/images/icon-yaohuo.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .shouhuo {
    background: url(../assets/images/icon-shouhuo.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .tuihuo {
    background: url(../assets/images/icon-tuihuo.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .panku {
    background: url(../assets/images/icon-panku.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .kucun{   
    background: url(../assets/images/icon-kucun.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .overflowing{   
    background: url(../assets/images/icon_require.png) no-repeat;
    background-size: 64px 64px;
  }
  .icon-menu .diaobo{
    background: url(../assets/images/icon-jiadan.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu .jiadan {
    background: url(../assets/images/icon-jiadan.png) no-repeat;
    background-size: 64px 64px;
  }

  .icon-menu span {
    margin: 10px 0px;
    font-size: 12px;
    color: #395778;
  } 
  .header-date{
    position: fixed;
    width: 100%;
    height: 30px;
    background-image: linear-gradient(139deg, #018BFF -11%, #4A39F3 100%);
    margin-top: -5px;
    z-index: 10;
}
.busiDate {
    /*display: flex;*/
    width: 88px;
    height: 22px;
    justify-content: start;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 16px;
    background: url('../assets/images/index_date.png') no-repeat;
    background-size: 88px 22px;
    position: absolute;
    bottom:0;
    left: 50%;
    margin-left: -40px;
  }

  .busiDate span {
    float: left;
    /*background: #3D94FD;*/
    padding: 3px 10px 3px 10px;
    border-top-right-radius: 11px;
    border-bottom-right-radius: 11px;
  }
  // 顶部下拉
  .indexPop>span{
    width: 82%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
  }
  .storeList{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 30px;
    left: 0;
    background: #F1F6FF;
    z-index: 9;
    color:#000;
    // display:flex;
    // flex-direction: row;
  }
  .pop-before{
    z-index: 3;
  }
  .list-line{
    padding: 6px 0;
  }
  .ezt-history{
    flex:.5;
  }
  .ezt-checkList{
    flex: 1;
  }
  /* 我的用户头像 */
  .mine-css{
    display: inline-block;
    width: 40px;
    height: 40px;
    position: fixed;
    left: 10px;
    top: 10px;
    background: url(../assets/images/user_logo.png) 0 0 no-repeat;
    background-size: 40px 40px;
    z-index: 11;
  } 
  .ezt-tab{
    display: flex;
    flex-direction: row;
    width: 100%;
    background: #FFF;
    padding-top: 10px;
    ul{
      display:flex;
      flex-direction: row;
      flex:1      
    }
    li{
        flex:1;
      }
    li.active{
      border-bottom: 2px solid #DDECFD;
      padding-bottom: 10px;
    }
  }
  .title-date-position{
    position: fixed;
    right: 10px;
    top: 22px;
    z-index: 11;
  }
  
</style>
