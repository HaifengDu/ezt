<!--覝货页面-->
<template>
  <div>
    <layout type="selectTemplate" :disFalse="true" back="/needGood" v-if="!showSure">
      <template slot="append">
        <select-template></select-template>
      </template>   
    </layout>
    <layout type="needGood" back="/index" v-if="showSure">
      <template slot="append">
       <div class="requiregoods">
         <div class="query">  
          <mt-cell title="要货门店" class="">
            <span class="distribution">{{store_name}}</span>
          </mt-cell>    
          <mt-cell title="到货日期" class="">
              <span class="distribution" @click="open('picker2')">{{busi_date}}</span>
              <span class="icon-bottom"></span>
                <mt-datetime-picker
                  ref="picker2"
                  type="date"
                  v-model="busi_date"
                  @confirm="handleChange">
                </mt-datetime-picker>
          </mt-cell>
          <mt-cell title="配送中心">
              <span class="distribution" @click="sheetVisible">{{dataItem.text}}</span>
              <span class="icon-bottom"></span>
               <mt-popup
                  v-model="isDistribution"
                  position="bottom">
                  <div class="distributionList">
                    <div></div>
                    <mt-radio    
                      :max="1"
                      align="right"
                      title="请选择配送中心" 
                      @change="handlerChangList"
                      v-model="dataItem.text"
                      :options="distributionList">
                    </mt-radio>
                  </div>
                </mt-popup>
          </mt-cell>  
         </div>   
          <div class="Wayofdelivery">
               <div class="order">
                  <span class="line"></span>
                  <span class="txt">要货方式</span>
                  <span class="line"></span>
              </div>
              <div class="button">
                <div class="templateimport" @click="selectTemplate">模板导入</div>
                <div class="manualproduction"  @click="manualProduction">手工制单</div>
              </div>
           </div>
        </div>
      </template>
    </layout>
  </div>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import layout from '../../../components/layout.vue'
  import "../../../assets/css/mintUI-rest.css"
  import selectTemplate from './selectTemplate.vue'
  import {dateUtil} from '../../../utils/dateUtils'
  export default {
    name: 'needGood',
    data() {
      return {
        busi_date:null,
        isDistribution:false,
        distributionList: [],//配送中心列表
        distributionType:[], 
      }
    },
     components:{
      layout,
      selectTemplate,
    },
     computed:{
       ...mapGetters(['showSure','userInfo']),
       ...mapGetters('needGood',['dataItem']),
    },
    methods:{
      ...mapMutations(['setShowSure',]),
      ...mapActions([]),
        open(picker) {
           this.$refs[picker].open();
        },
        handleChange(value) {
          this.busi_date = dateUtil.formatDate(this.$refs.picker2.value)
        },
      deliveryDate(){  
          this.distributionList = [],//配送中心列表
          this.$store.dispatch('needGood' + '/postData', {
            typeName: 'distribution',
            options: {
              data: [],
              "oper": "DC_STORES",
              "pagination": null,
              "store_id": this.userInfo.store_id,
              "tenancy_id": this.userInfo.tenancy_id,
              "timestamp": 0,
            }
          }).then(res => {
            if (res.errcode != 0) {
              return false;
            } else {
              this.$set(this.dataItem,'text',res.data[0].text)
              this.distributionType=res.data;
              res.data.forEach(distributionItem => {
                this.distributionList.push(distributionItem.text)
              });
              return false;
            }
          })
      },
      handlerChangList(item){
        this.distributionType.forEach((info,index)=>{
            if(info.text==item){
                this.$set(this.dataItem,'text',info.text);
            }
        });
      },
      //配送中心
      sheetVisible(){
         this.deliveryDate()
         this.isDistribution = true
      },
      selectTemplate(){
        this.setShowSure(!this.showSure);
      },
      manualProduction(){

      },
      
    },
    created(){
      this.store_name = this.userInfo.store_name
      let date = this.userInfo.busi_date
      this.busi_date = date
      this.deliveryDate()

      console.log(this.userInfo.busi_date)
      // console.log(this.userInfo,'this.userInfo新新新')
    },
    mounted(){
       

    }
  }
</script>
<style lang="less" scoped>
  .requiregoods{
    position: absolute;
    left:0;
    top:0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
     .query{
        width: 100%;
        height: 150px;
        background-color: #fff;
        .distribution {
            font-size: 14px;
            color: #5F7B9A;
            margin-right: 5px;
            display: block;
            width: 200px;
            height: 40px;
            text-align: right;
        }
        .icon-bottom {
          width: 15px;
          height: 15px;
          background: url('../../../assets/images/icon-trunright.png') no-repeat;
          background-size: 16px 15px;
          transform:rotate(90deg);
        }
      }
      .Wayofdelivery{
          background-color: #F1F6FF;
          flex: 1;
          width: 100%;
          .order {
            height: 50px;
            text-align: center;
            display: flex;
            margin-top: 50px;
            span{
              flex-direction:column;
            }
            .line {
              display: inline-block;
              flex: 2;
              border-top: 1px solid #C1CFDE ;
            }
            .txt {
                color: #95A7BA;
                vertical-align: middle;
                line-height: 5px;
                width: 88px;
              }
          }
          .button{
            display: flex;
            flex-direction: column;
            align-items: center;
            .templateimport{
              margin-bottom: 25px;
            }
            .templateimport,.manualproduction{
              background-color: #fff;
              width: 90%;
              height: 50px;
              line-height: 50px;
              border-radius:25px;
              color: #1188FC;
              font-size: 16px;
              cursor: pointer;
            }
          }
        }
  }
</style>
