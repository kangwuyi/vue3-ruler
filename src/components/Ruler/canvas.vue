<template>
  <canvas
    :class="{
      'ruler-_-canvas': true,
      'ruler-_-canvas-noevent': !lineVisible,
    }"
    ref="canvasRef"
    @click="handleClick"
    @mouseenter="handleEnter"
    @mousemove="handleMove"
    @mouseleave="handleLeave"
  ></canvas>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, onMounted, defineEmits, inject, reactive, computed } from 'vue'
import { drawCanvaslRuler } from './utils.ts'
import {
  scaleFigureKey,
  DEFAULT_SCALE_FIGURE,
  wdpRatioKey,
  DEFAULT_WDP_RATIO,
  rectKey,
  DEFAULT_RECT,
  lineListCbKey,
  ELineActionType,
  ELineDirectionType,
} from '../config/index.ts'
import type { IFDrawRulerOption, TUpdateLineList } from '../config/index.ts'

// ---------------------------
const emit = defineEmits(['onLineVisible', 'onLineMove', 'onLineDisable', 'onVisibleDotted'])
// ----- wdpRatio --------
const wdpRatio = inject(wdpRatioKey, ref(DEFAULT_WDP_RATIO))
watch(wdpRatio, (_) => console.log('inject wdpRatio', _), { deep: true })
// ----- scaleFigure --------
const scaleFigure = inject(scaleFigureKey, ref(DEFAULT_SCALE_FIGURE))
// ---------- rect ---------
const rect = inject(
  rectKey,
  computed(() => DEFAULT_RECT),
)
watch(
  [rect, scaleFigure],
  ([_rect, _scaleFigure]) => {
    drawRuler()
    console.log('inject _rect,_scaleFigure', _rect, _scaleFigure)
  },
  { deep: true },
)
// ----------
const updateLineList = inject<TUpdateLineList>(lineListCbKey, () => {})
// --------

const getValueByOffset = (offset: number, start: number, scale: number): number =>
  Math.round(start + offset / scale)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasContext = ref<CanvasRenderingContext2D | null>(null)

const props = defineProps({
  isVertical: { type: Boolean, required: true },
  lineVisible: { type: Boolean, required: true },
  start: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
})

watch(
  () => [props.start],
  () => {
    console.log('watch [props.start, rect]')
    drawRuler()
  },
)
watch(
  () => [props.width, props.height],
  () => {
    updateCanvasContext()
    drawRuler()
  },
)
// ---------
onMounted(() => {
  updateCanvasContext()
  drawRuler()
})
// -------------------
const updateCanvasContext = () => {
  console.log('wdpRatio.value', wdpRatio.value)
  if (!canvasRef.value) return
  // 比例宽高
  canvasRef.value.width = props.width * wdpRatio.value
  canvasRef.value.height = props.height * wdpRatio.value
  const ctx = canvasRef.value.getContext('2d')!
  ctx.font = `normal ${12 * wdpRatio.value}px   'PingFang SC', 'Microsoft YaHei', monospace, sans-serif`
  ctx.lineWidth = 1
  ctx.textBaseline = 'middle'
  //
  canvasContext.value = ctx
}

const drawRuler = () => {
  if (!canvasContext.value) return
  const options: IFDrawRulerOption = {
    scale: scaleFigure.value,
    ratio: wdpRatio.value,
    width: props.width,
    height: props.height,
  }

  drawCanvaslRuler(
    props.isVertical,
    canvasContext.value,
    props.start,
    {
      x: props.isVertical ? 0 : rect.value.x,
      width: props.isVertical ? 0 : rect.value.width,
      y: props.isVertical ? rect.value.y : 0,
      height: props.isVertical ? rect.value.height : 0,
    },
    options,
  )
}
const handleClick = (e: MouseEvent) => {
  const offset = props.isVertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, scaleFigure.value) // 获取标尺数值
  updateLineList(
    props.isVertical ? ELineDirectionType.VERTICAL : ELineDirectionType.HORIZONTAL,
    ELineActionType.ADD,
    value,
  )
}
const handleEnter = (e: MouseEvent) => {
  const offset = props.isVertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, scaleFigure.value)
  emit('onLineVisible', value)
  emit('onVisibleDotted', true)
}

const handleMove = (e: MouseEvent) => {
  const offset = props.isVertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, scaleFigure.value)
  emit('onLineMove', value)
}
const handleLeave = () => emit('onVisibleDotted', false)
</script>

<style lang="less">
.ruler-_-canvas {
  // width: 100%;
  // height: 100%;
  pointer-events: auto;
  &-noevent {
    pointer-events: none;
  }
}
</style>
