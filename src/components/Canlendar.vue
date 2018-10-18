<!--整体页面的头部布局-->
<template>
  <div class="ezt-sanjiao">
      <input class="ezt-canlendar" :placeholder="placeholder" ref="canlendar" 
      :disabled="disabled" :type="type" @change="selectChange" :value="defaultValue"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  export default {
    components: {},
    name: 'canlendar',
    data () {
      return {
        
      }
    },
    model:{
      prop:'value',
      event:'change',
      placeholder:'placeholder'
    },
    props: {
      value:String,
      type:String,
      disabled:Boolean,
      placeholder:String,
      defaultValue:String,//默认值
      max:String,//最大值 小于某个值
      min:String,//最小值 大于某个值
    },
    computed: {
    },
    methods: {
      selectChange(val){
        this.$emit('change',val.target.value);
      },
      setMax(date){
        this.instance.option({
          max:date
        });
      },
      setMin(date){
        this.instance.option({
          min:date
        })
      },
      setDefaultVal(date){
        this.instance.setVal(date);
      }
    },
    mounted(){
      const opt = {
        theme: 'material', 
        display: 'bottom',
        lang: 'zh',
        dateFormat: 'yyyy-mm-dd',
        // defaultValue: new Date(this.defaultValue),
        onSet: function(val){
          _this.$emit(val.valueText)
        }
      }
      if(this.max){
        this.$set(opt,'max',new Date(this.max));
      }
      if(this.min){
        this.$set(opt,'min',new Date(this.min));
      }      
      let _this=this;
      //日历
      this.instance = mobiscroll.date(this.$refs.canlendar,opt);
      if(this.defaultValue){
        this.instance.setVal(new Date(this.defaultValue));
      }
    },
    watch: {
    
    }
  }
</script>
<style lang="less" scoped>
 

</style>
