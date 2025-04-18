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
        :markLineList="markLineList"
        @onMarkLineList="handleMarkLineList"
      />
    </div>
  </div>
  <Linking repo="vue3-spinkit" />
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Ruler from './components/ruler.vue'
import type { TLineActionType, TLineDirectionType, IFLineListByProps } from './components/config'
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
const markLineList = ref<IFLineListByProps[]>([
  {
    type: 'horizontal',
    value: 24,
  },
  {
    type: 'vertical',
    value: 45,
  },
  {
    type: 'horizontal',
    value: 243,
  },
])
const handleMarkLineList = (f: TLineDirectionType, t: TLineActionType, v: number) => {
  console.log('-- updateLineList', f, t, v)
  const i: number = markLineList.value.findIndex((_) => _.type === f && _.value === v)
  if (i === -1 && t === 'add')
    markLineList.value.splice(markLineList.value.length, 1, {
      type: f,
      value: v,
    })
  else if (i !== -1 && t === 'add') return console.log('标注线已经存在')
  else if (i !== -1 && t === 'del') markLineList.value.splice(i, 1)
  else if (i === -1 && t === 'del') return console.log('标注线不存在')
  else if (i !== -1 && t === 'update')
    markLineList.value.splice(i, 1, {
      type: f,
      value: v,
    })
}
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
