<!-- 审核调拨单 -->
<template>
    <div class="ezt-page-con">
        <ezt-header :back='true' title="审核调拨单" @goBack="goBack" :isInfoGoback="true">

        </ezt-header>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component, Watch} from "vue-property-decorator"
@Component({

})
export default class allotment extends Vue{
    private goBack(){
        this.$router.push('/allotment');
    }
    
}
</script>
<style lang="less" scoped>

</style>