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
       defaultValue:String,
    },
    computed: {
    
    },
    methods: {
      selectChange(val){
          this.$emit('change',val.target.value);
      }
    },
    mounted(){
      let _this=this;
      //日历
      const instance = mobiscroll.date(this.$refs.canlendar, {
        theme: 'material', 
        display: 'bottom',
        lang: 'zh',
        dateFormat: 'yyyy-mm-dd',
        // defaultValue: new Date(this.defaultValue),
        onSet: function(val){
          _this.$emit(val.valueText)
        }
      });
      if(this.defaultValue){
        instance.setVal(new Date(this.defaultValue));
      }
     
     
    },
    watch: {
    
    }
  }
</script>
<style lang="less" scoped>
 

</style>
