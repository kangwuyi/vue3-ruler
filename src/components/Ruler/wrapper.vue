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
      :vertical="vertical"
      :scale="scale"
      :ratio="ratio"
      :width="width"
      :height="height"
      :start="start"
      :selectStart="getSelectStart"
      :selectLength="getSelectLength"
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
import { computed, defineProps, defineEmits, inject, ref, watch } from 'vue'
import LineRuler from './line.vue'
import CanvasRuler from './canvas.vue'
import { DEFAULT_THEME, lineListKey, DEFAULT_LINELIST } from '../config/index.ts'

const emit = defineEmits(['update:lineVisible', 'onLineChange', 'onLineRemove'])
const props = defineProps({
  vertical: { type: Boolean, required: true },
  scale: { type: Number, required: true },
  ratio: { type: Number, required: true },
  width: { type: Number, required: true },
  thick: { type: Number, required: true },
  height: { type: Number, required: true },
  start: { type: Number, required: true },
  selectStart: { type: Number, required: true },
  selectLength: { type: Number, required: true },
  lineVisible: { type: Boolean, required: true },
})
// --------------
const { lineList } = inject(lineListKey, DEFAULT_LINELIST)
const curLineList = ref<number[]>([])
watch(
  () => props.vertical,
  (_) => (curLineList.value = _ ? lineList.vertical : lineList.horizontal),
)
watch(lineList, (_) => (curLineList.value = props.vertical ? _.vertical : _.horizontal))
// -------
const isDraggingLine = ref(false)
// --------
const getSelectLength = computed(() => props.selectLength)
const getSelectStart = computed(() => props.selectStart)
const rwStyle = computed(() => {
  const hContainer = {
    width: `calc(100% - ${props.thick}px)`,
    height: `${props.thick}px`,
    left: `${props.thick}px`,
  }
  const vContainer = {
    width: `${props.thick}px`,
    height: `calc(100% - ${props.thick}px)`,
    top: `${props.thick}px`,
  }
  return props.vertical ? vContainer : hContainer
})

const tmpValue = ref<number>(0)
const indicatorStyle = computed(() => {
  const indicatorOffset = (tmpValue.value - props.start) * props.scale
  let positionKey = 'top'
  let boderKey = 'borderLeft'
  positionKey = props.vertical ? 'top' : 'left'
  boderKey = props.vertical ? 'borderBottom' : 'borderLeft'
  return {
    [positionKey]: `${indicatorOffset}px`,
    [boderKey]: `1px dashed ${DEFAULT_THEME.cornerActiveColor}`,
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
    padding: 0 2px;
    width: auto;
    .value {
      border: 1px solid #ffffff21;
      background: #e06a6a;
      color: #ffffff;
      font-size: 10px;
    }
  }
  &-h {
    top: 0;
    box-shadow: 0 10px 40px 0 #00000026;
    .indicator {
      top: 7px;
      height: 100vw;
      .value {
        margin-left: 1px;
        margin-top: 5px;
      }
    }
  }

  &-v {
    left: 0;
    // border-right: 1px solid #3b3b3b;
    box-shadow: 0 10px 40px 0 #00000026;
    .indicator {
      width: 100vw;
      .value {
        left: 0px;
        margin-left: 12px;
        margin-top: 0;
        transform-origin: 0 0;
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
