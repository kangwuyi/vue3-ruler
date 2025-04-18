<template>
  <div class="container">
    <h1 @click="console.log('hi~')">Vue3-sketch-ruler</h1>
    <div class="ruler-box">
      <Ruler
        :scaleFigure="scaleFigure"
        :wdpRatio="wdpRatio"
        :thick="thick"
        :width="width"
        :height="height"
        :startX="startX"
        :startY="startY"
        :rect="rect"
      />
    </div>
  </div>
  <Linking repo="vue3-spinkit" />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Ruler from './components/ruler.vue'
const scaleFigure = ref(1)
const wdpRatio = ref(1)
const thick = ref(24)
const width = ref(500)
const height = ref(500)
const startX = ref(0)
const startY = ref(0)
const rect = reactive({
  x: 200,
  y: 100,
  width: 200,
  height: 100,
})
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: calc(100vw - 16px);
  height: calc(100vh - 16px);
  overflow: hidden;
  background-color: black;
  .ruler-box {
    flex: 1;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: black;
    overflow: hidden;
  }
}
</style>
