<template>
  <!-- 水平方向 -->
  <RulerWrapper
    :rect="rect"
    :isVertical="false"
    :width="width"
    :height="thick"
    :thick="thick"
    :rollback="height"
    :start="startX"
    v-model:lineVisible="lineVisible"
  />
  <!-- 竖直方向 -->
  <RulerWrapper
    :rect="rect"
    :isVertical="true"
    :width="thick"
    :height="height"
    :thick="thick"
    :rollback="width"
    :start="startY"
    v-model:lineVisible="lineVisible"
  />
  <span
    class=""
    :class="{
      'ruler-_-corner': true,
      'ruler-_-corner-active': cornerActive,
    }"
    :style="cornerStyle"
    @click="handleLineVisibleChange"
  ></span>
</template>

<script lang="ts" setup>
import { computed, defineProps, provide, reactive, ref, type PropType, watch } from 'vue'
import RulerWrapper from './Ruler/wrapper.vue'
import {
  DEFAULT_THEME,
  DEFAULT_WDP_RATIO,
  DEFAULT_SCALE_FIGURE,
  wdpRatioKey,
  lineListKey,
  scaleFigureKey,
} from './config/index.ts'
import type { IFLineList, IFRect } from './config/index.ts'

const props = defineProps({
  // Window.devicePixelRatio = {物理像素分辨率/CSS 像素分辨率}
  wdpRatio: {
    type: Number,
    default: DEFAULT_WDP_RATIO,
  },
  // ------------------
  scaleFigure: {
    type: Number,
    default: 1,
  },
  thick: {
    type: Number,
    default: 16,
  },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  startX: {
    type: Number,
    default: 0,
  },
  startY: {
    type: Number,
    default: 0,
  },
  // 传入阴影部分，选中画布组件，在标尺中标注组件位置
  rect: {
    type: Object as PropType<IFRect>,
    default: () =>
      ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }) as IFRect,
  },
  cornerActive: {
    type: Boolean,
    default: false,
  },
})
// --- wdpRatio ---
const wdpRatioRef = ref(DEFAULT_WDP_RATIO)
provide(wdpRatioKey, wdpRatioRef)
watch(
  () => props.wdpRatio,
  (_) => (wdpRatioRef.value = _),
)
// --- scale ---
const scaleFigureRef = ref(DEFAULT_SCALE_FIGURE)
provide(scaleFigureKey, scaleFigureRef)
watch(
  () => props.scaleFigure,
  (_) => (scaleFigureRef.value = _),
)
// ---- 标注线 ----------

const lineList = reactive<IFLineList>({
  // 横向
  horizontal: [],
  // 纵向
  vertical: [],
})
type lineActionType = 'del' | 'add'
type lineDirectionType = 'horizontal' | 'vertical'
const updateLineList = (f: lineDirectionType, t: lineActionType, i: number) => {
  console.log('-- updateLineList', f, t, i)
  if (t === 'del' && f === 'horizontal') lineList.horizontal.splice(i, 1)
  else if (t === 'del' && f === 'vertical') lineList.vertical.splice(i, 1)
  else if (t === 'add' && f === 'horizontal') lineList.horizontal.push(i)
  else if (t === 'add' && f === 'vertical') lineList.vertical.push(i)
}
provide(lineListKey, {
  lineList,
  updateLineList,
})
// --------------
const cornerStyle = computed(() => ({
  backgroundColor: DEFAULT_THEME.bgColor,
  width: `${props.thick}px`,
  height: `${props.thick}px`,
  borderRight: `1px solid ${DEFAULT_THEME.borderColor}`,
  borderBottom: `1px solid ${DEFAULT_THEME.borderColor}`,
}))

// 标注线 [展示|隐藏]
const lineVisible = ref<boolean>(false)
const handleLineVisibleChange = () => (lineVisible.value = !lineVisible.value)
</script>

<style lang="less">
.ruler-_-corner {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-sizing: content-box;
  &-active {
    background-color: white !important;
  }
}
</style>
