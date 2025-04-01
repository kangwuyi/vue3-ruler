<template>
  <div
    :class="{
      'ruler-_-wrapper': true,
      'ruler-_-wrapper-v': isVertical,
      'ruler-_-wrapper-h': !isVertical,
    }"
    @touchmove.prevent
    :style="rwStyle"
  >
    <CanvasRuler
      :lineVisible="lineVisible"
      :rect="rect"
      :isVertical="isVertical"
      :width="width"
      :height="height"
      :start="start"
      @onIndicatorMove="handleIndicatorMove"
      @onIndicatorShow="handleIndicatorShow"
      @onIndicatorHide="handleIndicatorHide"
    />
    <div v-if="lineVisible" class="ruler-_-line-box">
      <LineRuler
        v-for="(v, i) in curLineList"
        :key="'line' + v"
        :index="i"
        :start="start"
        :isVertical="isVertical"
        :rollback="rollback"
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
  type Reactive,
} from 'vue'
import LineRuler from './line.vue'
import CanvasRuler from './canvas.vue'
import {
  DEFAULT_THEME,
  lineListKey,
  DEFAULT_LINELIST,
  scaleFigureKey,
  DEFAULT_SCALE_FIGURE,
} from '../config/index.ts'
import type { IFLineList, IFRect } from '../config/index.ts'

// ----- scaleFigure --------
const scaleFigure = inject(scaleFigureKey, ref(DEFAULT_SCALE_FIGURE))
// ---------------
const emit = defineEmits(['update:lineVisible', 'onLineChange', 'onLineRemove'])
const props = defineProps({
  rect: { type: Object as PropType<IFRect>, required: true },
  isVertical: { type: Boolean, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  thick: { type: Number, required: true },
  // 缓存被 thick 替换的宽高
  rollback: { type: Number, required: true, defalut: 0 },
  start: { type: Number, required: true },
  lineVisible: { type: Boolean, required: true },
})
// --------------
// ---------------
// 线的数组
const { lineList } = inject(lineListKey, DEFAULT_LINELIST)
const curLineList = ref<number[]>([])
// 初始化
const refreshCurLineList = (_: Reactive<IFLineList>) =>
  (curLineList.value = props.isVertical ? _.vertical : _.horizontal)
onMounted(() => refreshCurLineList(lineList))
watch(lineList, (_) => refreshCurLineList(_))
// -------
const isDraggingLine = ref(false)
// --------
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
  return props.isVertical ? vContainer : hContainer
})

const tmpValue = ref<number>(0)
const indicatorStyle = computed(() => {
  const indicatorOffset = (tmpValue.value - props.start) * scaleFigure.value
  const positionKey = props.isVertical ? 'top' : 'left'
  const boderKey = props.isVertical ? 'borderTop' : 'borderLeft'
  const sizeKey = props.isVertical ? 'width' : 'height'
  return {
    [positionKey]: `${indicatorOffset}px`,
    [boderKey]: `1px dashed ${DEFAULT_THEME.cornerActiveColor}`,
    [sizeKey]: `${props.rollback + props.thick}px`,
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
const handleIndicatorHide = () => emit('update:lineVisible', false)

const handleLineDown = () => {
  isDraggingLine.value = true
}

const handleLineRelease = (value: number, index: number) => {
  isDraggingLine.value = false
  // 左右或上下超出时, 删除该条对齐线
  const offset = value - props.start
  const maxOffset = (props.isVertical ? props.height : props.width) / scaleFigure.value
  if (offset < 0 || offset > maxOffset) {
    emit('onLineRemove', index)
  } else {
    curLineList.value[index] = value
    emit('onLineChange', curLineList.value, props.isVertical)
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
