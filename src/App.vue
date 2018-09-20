<template>
  <div id="app">
    <div id="ezt-mask"></div>
    <div class="ezt-container">
      <router-view/> 
    </div>   
  </div>
</template>

<script>
export default {
  name: 'App'
}

</script>

<style>
#app {
  font-family: 'Microsoft Yahei','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;
  padding: 0;
  margin: 0;
}
#ezt-mask{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #000;
    opacity: .3;
    display: none;
    z-index: 10000;
}
</style>
