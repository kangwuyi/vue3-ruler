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
import { defineProps, ref, watch, onMounted, defineEmits, inject, type PropType } from 'vue'
import { drawCanvaslRuler } from './utils.ts'
import {
  lineListKey,
  DEFAULT_LINELIST,
  type IFDrawRulerOption,
  type IFRect,
} from '../config/index.ts'

const { updateLineList } = inject(lineListKey, DEFAULT_LINELIST)

const emit = defineEmits(['onIndicatorShow', 'onIndicatorMove', 'onIndicatorHide'])

const getValueByOffset = (offset: number, start: number, scale: number): number =>
  Math.round(start + offset / scale)

const canvasRef = ref<HTMLCanvasElement>()
const canvasContext = ref<CanvasRenderingContext2D>()

const props = defineProps({
  rect: { type: Object as PropType<IFRect>, required: true },
  vertical: { type: Boolean, required: true },
  lineVisible: { type: Boolean, required: true },
  start: { type: Number, required: true },
  scale: { type: Number, required: true },
  ratio: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
})
watch(
  () => props.rect,
  (_) => console.log(_),
)
watch(
  () => [props.start, props.rect],
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
  canvasRef.value!.width = props.width * props.ratio
  canvasRef.value!.height = props.height * props.ratio
  const ctx = canvasRef.value!.getContext('2d')!
  ctx.font = `${12 * props.ratio}px -apple-system, 
              "Helvetica Neue", ".SFNSText-Regular", 
              "SF UI Text", Arial, "PingFang SC", "Hiragino Sans GB", 
              "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif`
  ctx.lineWidth = 1
  ctx.textBaseline = 'middle'
}

const drawRuler = () => {
  const options: IFDrawRulerOption = {
    scale: props.scale,
    ratio: props.ratio,
    width: props.width,
    height: props.height,
  }

  drawCanvaslRuler(
    props.vertical,
    canvasContext.value!,
    props.start,
    {
      x: props.vertical ? 0 : props.rect.x,
      width: props.vertical ? 0 : props.rect.width,
      y: props.vertical ? props.rect.y : 0,
      height: props.vertical ? props.rect.height : 0,
    },
    options,
  )
}
const handleClick = (e: MouseEvent) => {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, props.scale) // 获取标尺数值
  updateLineList(props.vertical ? 'vertical' : 'horizontal', 'add', value)
}
const handleEnter = (e: MouseEvent) => {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, props.scale)
  emit('onIndicatorShow', value)
}

const handleMove = (e: MouseEvent) => {
  const offset = props.vertical ? e.offsetY : e.offsetX
  const value = getValueByOffset(offset, props.start, props.scale)
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
