<!--整体页面的头部布局-->
<template>
<div class="ezt-count">
    <span class="ezt-minus" @click="handlerMinus" :class="{'number-diabled':minusDisabled}">-</span>    
    <input class="ezt-number" v-model="dValue" :type="type" :disabled="disabled" @input="selectChange" :value="dValue"/>
    <span class="ezt-plus" @click="handlerPlus">+</span>  
</div>

</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
import { parse } from 'querystring';
  export default {
    components: {},
    name: 'canlendar',
    data () {
      return {
        dValue:0,
        // minusDisabled:true,
      }
    },
    model:{
        prop:'value',
        event:'change',
        placeholder:'placeholder'
    },
    props: {
       value:Number,
       type:String,
       disabled:Boolean,
       placeholder:String,
    },
    computed:{
        minusDisabled:{
            get(){
                if(this.dValue>0){
                    return false;
                }else{
                    return true;
                }
            },
            set(){
                if(this.dValue>0){
                    return false;
                }else{
                    return true;
                }
            }
           
        }
    },
    watch: {
       'value':function(newValue,oldValue){
           this.dValue = newValue;
       }
    },
    created(){
        this.dValue = this.value||0;
    },
    methods: {
        pubChange(){
            if(this.dValue==""){
                this.dValue=0;
            }
            if(!isNaN(parseFloat(this.dValue))){
                this.oldValue = parseInt(this.dValue);
            }else{
                this.dValue = this.oldValue||0;
            }
            this.dValue = parseInt(this.dValue);
            this.$emit('change',this.dValue);
        },
        selectChange(){
           this.pubChange();
        },
        handlerPlus(){
            //加
            this.dValue=this.dValue+1;
            this.minusDisabled=false;
            this.pubChange();
        },
        handlerMinus(){
            //减
            if(this.dValue>1){
                this.dValue=this.dValue-1;
            }else{           
                this.dValue=0;
                this.minusDisabled=true;   
            }
            this.pubChange();
        }
    }
  }
</script>
<style lang="less" scoped>
 .ezt-count{
    display: flex;
    flex-direction: row;
    min-width: 104px;
    .ezt-number{
        border: 1px solid #ccc;
        width: 50px;
        border-radius: 0;
        text-align: center;
    }
    .ezt-plus,.ezt-minus{
        background: #1188FC;
        display: inline-block;
        width: 26px;
        text-align: center;
        color: #fff;
        line-height: 24px;
    }
    .ezt-minus.number-diabled{
        background: #ccc;
    }
 }

</style>
