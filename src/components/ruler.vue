<template>
  <!-- 水平方向 -->
  <RulerWrapper
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
    }"
    :style="cornerStyle"
    @click="handleLineVisibleChange"
  >
    <IconEye v-if="lineVisible" class="ruler-_-corner-icon" />
    <IconEyeX v-else class="ruler-_-corner-icon" />
  </span>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  // defineEmits,
  provide,
  reactive,
  ref,
  type PropType,
  type CSSProperties,
  watch,
} from 'vue'
import { IconEye, IconEyeX } from '@tabler/icons-vue'
import RulerWrapper from './Ruler/wrapper.vue'
import {
  DEFAULT_THEME,
  DEFAULT_WDP_RATIO,
  DEFAULT_SCALE_FIGURE,
  wdpRatioKey,
  lineListKey,
  scaleFigureKey,
  rectKey,
  DEFAULT_RECT,
  DEFAULT_LINELIST,
} from './config/index.ts'
import type { IFLineList, IFRect } from './config/index.ts'

// const emit = defineEmits([
//   // 选中组件的坐标值发生改变, rect.rect|rect.y
//   // 可能的情况，选中组件移动过程中发生吸附其他组件或中轴线或边界线
//   'update:rect',
// ])

const props = defineProps({
  // 变量
  // Window.devicePixelRatio = {物理像素分辨率/CSS 像素分辨率}
  wdpRatio: { type: Number, default: DEFAULT_WDP_RATIO },
  // ------------------
  scaleFigure: { type: Number, default: 1 },
  // 传入阴影部分，选中画布组件，在标尺中标注组件位置
  rect: {
    type: Object as PropType<IFRect>,
    default: () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }),
  },
  // 常量
  thick: { type: Number, default: 24 },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  startX: { type: Number, default: 0 },
  startY: { type: Number, default: 0 },
  markLineList: { type: Array, default: [] },
})
// --- wdpRatio ---
const wdpRatioRef = ref(props.wdpRatio || DEFAULT_WDP_RATIO)
provide(wdpRatioKey, wdpRatioRef)
watch(
  () => props.wdpRatio,
  (_) => (wdpRatioRef.value = _),
)
// --- scale ---
const scaleFigureRef = ref(props.scaleFigure || DEFAULT_SCALE_FIGURE)
provide(scaleFigureKey, scaleFigureRef)
watch(
  () => props.scaleFigure,
  (_) => (scaleFigureRef.value = _),
)
// ------ rect ----------
const updateRect = () => console.log('updateRect')
provide('updateRect', updateRect)
const rectReactive = reactive(props.rect || DEFAULT_RECT)
provide(rectKey, rectReactive)
watch(
  () => props.rect,
  (_) => Object.assign(rectReactive, _),
)
// ---- 标注线 ----------
const lineList = reactive<IFLineList>(DEFAULT_LINELIST.lineList)
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
const cornerStyle = computed<CSSProperties>(() => ({
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
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-sizing: content-box;
  background-color: #171a24 !important;
  &-icon {
    width: 16px;
    height: 16px;
    color: #ffffff4d;
  }
}
</style>
