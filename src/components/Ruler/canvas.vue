<template>
  <canvas
    class="ruler-_-canvas"
    ref="canvasRef"
    @click="handleClick"
    @mouseenter="handleEnter"
    @mousemove="handleMove"
  ></canvas>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, onMounted, defineEmits, inject } from 'vue'
import { drawHorizontalRuler, drawVerticalRuler } from './utils.ts'
import { lineListKey, DEFAULT_LINELIST, type IFDrawRulerOption } from '../config/index.ts'

const { updateLineList } = inject(lineListKey, DEFAULT_LINELIST)

const emit = defineEmits(['onIndicatorShow', 'onIndicatorMove', 'onIndicatorHide'])

const getValueByOffset = (offset: number, start: number, scale: number): number =>
  Math.round(start + offset / scale)

const canvasRef = ref<HTMLCanvasElement>()
const canvasContext = ref<CanvasRenderingContext2D>()

const props = defineProps({
  vertical: { type: Boolean, required: true },
  start: { type: Number, required: true },
  scale: { type: Number, required: true },
  ratio: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  selectStart: { type: Number, required: true },
  selectLength: { type: Number, required: true },
})
watch(
  () => [props.start, props.selectStart, props.selectLength],
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

  if (props.vertical) {
    drawVerticalRuler(
      canvasContext.value!,
      props.start,
      { y: props.selectStart, height: props.selectLength, x: 0, width: 0 },
      options,
    )
  } else {
    drawHorizontalRuler(
      canvasContext.value!,
      props.start,
      { x: props.selectStart, width: props.selectLength, y: 0, height: 0 },
      options,
    )
  }
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
}
</style>
