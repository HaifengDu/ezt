<!--新增订货-->
<template>
    <div class="ezt-page-con">
        <ezt-header title="新增" :back="true" @goBack="goBack">

        </ezt-header>

    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Component} from "vue-property-decorator"
@Component({
    
})
export default class Order extends Vue{

    private goBack(){
        this.$router.push('/orderGood')
    }
}
</script>
<style lang="less" scoped>

</style>


