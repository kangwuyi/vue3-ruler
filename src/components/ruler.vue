<template>
  <!-- 水平方向 -->
  <RulerWrapper
    :isVertical="false"
    :markLineList="lineList['horizontal']"
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
    :markLineList="lineList['vertical']"
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
  defineEmits,
  provide,
  ref,
  type PropType,
  type CSSProperties,
} from 'vue'
import { IconEye, IconEyeX } from '@tabler/icons-vue'
import RulerWrapper from './Ruler/wrapper.vue'
import {
  DEFAULT_THEME,
  DEFAULT_WDP_RATIO,
  DEFAULT_SCALE_FIGURE,
  wdpRatioKey,
  scaleFigureKey,
  rectKey,
  DEFAULT_RECT,
  lineListCbKey,
} from './config/index.ts'
import type {
  IFLineListByProps,
  IFLineList,
  IFRect,
  TLineActionType,
  TLineDirectionType,
} from './config/index.ts'

const emit = defineEmits([
  // 选中组件的坐标值发生改变, rect.rect|rect.y
  // 可能的情况，选中组件移动过程中发生吸附其他组件或中轴线或边界线
  // 标注线
  'onMarkLineList',
])

const {
  wdpRatio = DEFAULT_WDP_RATIO,
  scaleFigure = DEFAULT_SCALE_FIGURE,
  rect = DEFAULT_RECT,
  thick = 24,
  width = 0,
  height = 0,
  startX = 0,
  startY = 0,
  markLineList = [],
} = defineProps({
  // 变量
  // Window.devicePixelRatio = {物理像素分辨率/CSS 像素分辨率}
  wdpRatio: Number,
  // ------------------
  scaleFigure: Number,
  // 传入阴影部分，选中画布组件，在标尺中标注组件位置
  rect: Object as PropType<IFRect>,
  // 常量
  thick: Number,
  width: Number,
  height: Number,
  startX: Number,
  startY: Number,
  markLineList: Array as PropType<IFLineListByProps[]>,
})
// --- wdpRatio ---
const wdpRatioRef = computed(() => wdpRatio)
provide(wdpRatioKey, wdpRatioRef)
// --- scale ---
const scaleFigureRef = computed(() => scaleFigure)
provide(scaleFigureKey, scaleFigureRef)
// ------ rect ----------
const updateRect = () => console.log('updateRect')
provide('updateRect', updateRect)
const rectReactive = computed(() => rect)
provide(rectKey, rectReactive)
// ---- 标注线 ----------
const lineList = computed(
  () =>
    markLineList.reduce((_: Partial<IFLineList>, o: IFLineListByProps) => {
      if (!_['horizontal']) _['horizontal'] = []
      if (!_['vertical']) _['vertical'] = []

      if (o.type === 'horizontal') _['horizontal'].push(o.value)
      else if (o.type === 'vertical') _['vertical'].push(o.value)

      return _
    }, {} as IFLineList) as IFLineList,
)
const updateLineList = (f: TLineDirectionType, t: TLineActionType, i: number) => {
  emit('onMarkLineList', t, f, i)
}
provide(lineListCbKey, updateLineList)
// --------------
const cornerStyle = computed<CSSProperties>(() => ({
  backgroundColor: DEFAULT_THEME.bgColor,
  width: `${thick}px`,
  height: `${thick}px`,
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
