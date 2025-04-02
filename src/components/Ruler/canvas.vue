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
  ></canvas>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, onMounted, defineEmits, inject, reactive } from 'vue'
import { drawCanvaslRuler } from './utils.ts'
import {
  lineListKey,
  DEFAULT_LINELIST,
  scaleFigureKey,
  DEFAULT_SCALE_FIGURE,
  wdpRatioKey,
  DEFAULT_WDP_RATIO,
  rectKey,
  DEFAULT_RECT,
} from '../config/index.ts'
import type { IFDrawRulerOption } from '../config/index.ts'

// ----- wdpRatio --------
const wdpRatio = inject(wdpRatioKey, ref(DEFAULT_WDP_RATIO))
watch(wdpRatio, (_) => console.log('inject wdpRatio', _), { deep: true })
// ----- scaleFigure --------
const scaleFigure = inject(scaleFigureKey, ref(DEFAULT_SCALE_FIGURE))
watch(scaleFigure, (_) => console.log('inject scaleFigure', _), { deep: true })
// ---------- rect ---------
const rect = inject(rectKey, reactive(DEFAULT_RECT))
watch(rect, (_) => console.log('inject rect', _), { deep: true })

// ----------
const { updateLineList } = inject(lineListKey, DEFAULT_LINELIST)
// --------
const emit = defineEmits(['onIndicatorShow', 'onIndicatorMove', 'onIndicatorHide'])

const getValueByOffset = (offset: number, start: number, scale: number): number =>
  Math.round(start + offset / scale)

const canvasRef = ref<HTMLCanvasElement>()
const canvasContext = ref<CanvasRenderingContext2D>()

const props = defineProps({
  isVertical: { type: Boolean, required: true },
  lineVisible: { type: Boolean, required: true },
  start: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
})

watch(
  () => [props.start, rect],
  () => drawRuler(),
)
watch(
  () => [props.width, props.height],
  () => {
    updateCanvasContext()
    drawRuler()
  },
)

const initCanvasRef = () => {
  canvasContext.value = (canvasRef.value && canvasRef.value.getContext('2d')) || undefined
}
const updateCanvasContext = () => {
  // 比例宽高
  canvasRef.value!.width = props.width * wdpRatio.value
  canvasRef.value!.height = props.height * wdpRatio.value
  const ctx = canvasRef.value!.getContext('2d')!
  ctx.font = `${12 * wdpRatio.value}px -apple-system,
              "Helvetica Neue", ".SFNSText-Regular",
              "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB",
              "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
  ctx.lineWidth = 1
  ctx.textBaseline = 'middle'
}

const drawRuler = () => {
  const options: IFDrawRulerOption = {
    scale: scaleFigure.value,
    ratio: wdpRatio.value,
    width: props.width,
    height: props.height,
  }

  drawCanvaslRuler(
    props.isVertical,
    canvasContext.value!,
    props.start,
    {
      x: props.isVertical ? 0 : rect.x,
      width: props.isVertical ? 0 : rect.width,
      y: props.isVertical ? rect.y : 0,
      height: props.isVertical ? rect.height : 0,
    },
    options,
  )
}
const handleClick = (e: MouseEvent) => {
  const offset = props.isVertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, scaleFigure.value) // 获取标尺数值
  updateLineList(props.isVertical ? 'vertical' : 'horizontal', 'add', value)
}
const handleEnter = (e: MouseEvent) => {
  const offset = props.isVertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, scaleFigure.value)
  emit('onIndicatorShow', value)
}

const handleMove = (e: MouseEvent) => {
  const offset = props.isVertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, scaleFigure.value)
  emit('onIndicatorMove', value)
}

onMounted(() => {
  initCanvasRef()
  updateCanvasContext()
  drawRuler()
})
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
