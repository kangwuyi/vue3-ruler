<template>
  <div
    :class="{
      'ruler-_-wrapper': true,
      'ruler-_-wrapper-v': vertical,
      'ruler-_-wrapper-h': !vertical,
    }"
    :style="rwStyle"
  >
    <CanvasRuler
      :shadow="shadow"
      :vertical="vertical"
      :scale="scale"
      :ratio="ratio"
      :width="width"
      :height="height"
      :start="start"
      @onIndicatorMove="handleIndicatorMove"
      @onIndicatorShow="handleIndicatorShow"
      @onIndicatorHide="handleIndicatorHide"
    />
    <div class="ruler-_-line-box">
      <LineRuler
        v-for="(v, i) in curLineList"
        :key="'line' + v"
        :index="i"
        :start="start"
        :vertical="vertical"
        :scale="scale"
        :thick="thick"
        :value="v >> 0"
        @onMouseDown="handleLineDown"
        @onRelease="handleLineRelease"
      />
    </div>
    <div class="indicator" :style="indicatorStyle" v-show="lineVisible">
      <div class="value">{{ tmpValue }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
  inject,
  ref,
  watch,
  onMounted,
  type PropType,
} from 'vue'
import LineRuler from './line.vue'
import CanvasRuler from './canvas.vue'
import { DEFAULT_THEME, lineListKey, DEFAULT_LINELIST, type IFShadow } from '../config/index.ts'

const emit = defineEmits(['update:lineVisible', 'onLineChange', 'onLineRemove'])
const props = defineProps({
  shadow: { type: Object as PropType<IFShadow>, required: true },
  vertical: { type: Boolean, required: true },
  scale: { type: Number, required: true },
  ratio: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  start: { type: Number, required: true },
  lineVisible: { type: Boolean, required: true },
})
// --------------
// 标尺高度
const thick = ref(0)
// 线的数组
const { lineList } = inject(lineListKey, DEFAULT_LINELIST)
const curLineList = ref<number[]>([])
// 初始化
onMounted(() => {
  curLineList.value = props.vertical ? lineList.vertical : lineList.horizontal
  thick.value = props.vertical ? props.width : props.height
})

watch(lineList, (_) => (curLineList.value = props.vertical ? _.vertical : _.horizontal))
// -------
const isDraggingLine = ref(false)
// --------
const rwStyle = computed(() => {
  const hContainer = {
    width: `calc(100% - ${thick.value}px)`,
    height: `${thick.value}px`,
    left: `${thick.value}px`,
  }
  const vContainer = {
    width: `${thick.value}px`,
    height: `calc(100% - ${thick.value}px)`,
    top: `${thick.value}px`,
  }
  return props.vertical ? vContainer : hContainer
})

const tmpValue = ref<number>(0)
const indicatorStyle = computed(() => {
  const indicatorOffset = (tmpValue.value - props.start) * props.scale
  const positionKey = props.vertical ? 'top' : 'left'
  const boderKey = props.vertical ? 'borderBottom' : 'borderLeft'
  const sizeKey = props.vertical ? 'width' : 'height'
  return {
    [positionKey]: `${indicatorOffset}px`,
    [boderKey]: `1px dashed ${DEFAULT_THEME.cornerActiveColor}`,
    [sizeKey]: `${props.vertical ? props.height : props.width}px`,
  }
})

// 栅格线展示
const handleIndicatorShow = (value: number) => {
  if (!isDraggingLine.value) {
    tmpValue.value = value
  }
}

// 栅格线跟随鼠标移动
const handleIndicatorMove = (value: number) => {
  tmpValue.value = value
}
// 栅格线隐藏
const handleIndicatorHide = () => {
  console.log('handleIndicatorHide')
  emit('update:lineVisible', false)
}

const handleLineDown = () => {
  isDraggingLine.value = true
}

const handleLineRelease = (value: number, index: number) => {
  isDraggingLine.value = false
  // 左右或上下超出时, 删除该条对齐线
  const offset = value - props.start
  const maxOffset = (props.vertical ? props.height : props.width) / props.scale
  if (offset < 0 || offset > maxOffset) {
    emit('onLineRemove', index)
  } else {
    curLineList.value[index] = value
    emit('onLineChange', curLineList.value, props.vertical)
  }
}
</script>

<style lang="less">
.ruler-_-wrapper {
  box-sizing: border-box;
  &-v,
  &-h {
    position: absolute;

    .ruler-_-line-box {
      pointer-events: none;
    }
    &:hover .ruler-_-line-box {
      pointer-events: auto;
    }
  }
  .indicator {
    position: absolute;
    pointer-events: none;
    padding: 0 2px;
    width: auto;
    height: auto;
    .value {
      display: inline-block;
      border: 1px solid #ffffff21;
      background: #e06a6a;
      color: #ffffff;
      font-size: 10px;
      padding: 0 2px;
    }
  }
  &-h {
    top: 0;
    box-shadow: 0 10px 40px 0 #00000026;
    .indicator {
      top: 0;
      .value {
        margin-left: 0;
        margin-top: 0;
      }
    }
  }

  &-v {
    left: 0;
    // border-right: 1px solid #3b3b3b;
    box-shadow: 0 10px 40px 0 #00000026;
    .indicator {
      .value {
        margin-left: 0;
        margin-top: 0;
        // transform-origin: 0 0;
        // transform: rotate(-90deg);
      }
    }
  }
}
</style>
