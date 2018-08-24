<!--整体页面的头部布局-->
<template>
<div>
    <input class="ezt-canlendar" ref="canlendar" @change="selectChange"/>
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
        event:'change'
    },
    props: {
       value:String
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
      mobiscroll.date(this.$refs.canlendar, {
        theme: 'material', 
        display: 'bottom',
        lang: 'zh',
        onSet: function(val){
          _this.$emit(val.valueText)
        }
      });
     
    },
    watch: {
    
    }
  }
</script>
<style lang="less" scoped>


</style>
