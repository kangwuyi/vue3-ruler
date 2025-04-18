<template>
  <div
    :class="{
      'ruler-_-wrapper': true,
      'ruler-_-wrapper-v': isVertical,
      'ruler-_-wrapper-h': !isVertical,
    }"
    :style="rwStyle"
  >
    <CanvasRuler
      :lineVisible="lineVisible"
      :isVertical="isVertical"
      :width="width"
      :height="height"
      :start="start"
      @onIndicatorMove="handleIndicatorMove"
      @onIndicatorShow="handleIndicatorShow"
      @onIndicatorHide="handleIndicatorHide"
      @onVisibleDotted="handleVisibleDotted"
    />
    <div v-if="lineVisible" class="ruler-_-line-box">
      <LineRuler
        v-for="(v, i) in markLineList"
        :key="'line' + v"
        :index="i"
        :start="start"
        :isVertical="isVertical"
        :rollback="rollback"
        :thick="thick"
        :value="v >> 0"
        @onMouseDown="handleLineDown"
        @onRelease="handleLineRelease"
        @onVisibleDotted="handleVisibleDotted"
      />
    </div>
    <div v-if="visibleDotted" class="indicator" :style="indicatorStyle" v-show="lineVisible">
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
  type CSSProperties,
  type PropType,
} from 'vue'
import lodash from 'lodash'
import LineRuler from './line.vue'
import CanvasRuler from './canvas.vue'
import {
  DEFAULT_THEME,
  scaleFigureKey,
  DEFAULT_SCALE_FIGURE,
  type TUpdateLineList,
  lineListCbKey,
} from '../config/index.ts'

const updateLineList = inject<TUpdateLineList>(lineListCbKey, () => {})
// 线的数组
// ----- scaleFigure --------
const scaleFigure = inject(scaleFigureKey, ref(DEFAULT_SCALE_FIGURE))
// ---------------
const emit = defineEmits(['update:lineVisible'])
const props = defineProps({
  isVertical: { type: Boolean, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  thick: { type: Number, required: true },
  // 缓存被 thick 替换的宽高
  rollback: { type: Number, required: true, defalut: 0 },
  start: { type: Number, required: true },
  lineVisible: { type: Boolean, required: true },
  markLineList: Array as PropType<number[]>,
})
// --------------
// ---------------
// --------
const rwStyle = computed<CSSProperties>(() => {
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
const indicatorStyle = computed<CSSProperties>(() => ({
  [props.isVertical ? 'top' : 'left']: `${(tmpValue.value - props.start) * scaleFigure.value}px`,
  [props.isVertical ? 'borderTop' : 'borderLeft']: `1px dashed ${DEFAULT_THEME.cornerActiveColor}`,
  [props.isVertical ? 'width' : 'height']: `${props.rollback + props.thick}px`,
}))

// 栅格线展示
const handleIndicatorShow = (value: number) => {
  if (!isMovingLine.value) {
    tmpValue.value = value
  }
}

// 栅格线跟随鼠标移动
const handleIndicatorMove = lodash.debounce((value: number) => {
  console.log('move')
  tmpValue.value = value
}, 1)
// 栅格线隐藏
const handleIndicatorHide = () => emit('update:lineVisible', false)

const handleLineDown = () => {
  // 点击标注线时，关闭虚线
  handleIsMovingLine(true)
  handleVisibleDotted(false)
}

const handleLineRelease = (value: number) => {
  // -----------------------------
  handleIsMovingLine(false)
  // 左右或上下超出时, 删除该条对齐线
  const offset = value - props.start
  const maxOffset = (props.isVertical ? props.height : props.width) / scaleFigure.value
  if (offset < 0 || offset > maxOffset) {
    updateLineList(props.isVertical ? 'vertical' : 'horizontal', 'del', value)
  } else {
    updateLineList(props.isVertical ? 'vertical' : 'horizontal', 'update', value)
  }
}
// 是否展示标注线的虚线
const visibleDotted = ref(false)
const handleVisibleDotted = (_: boolean) => (visibleDotted.value = _)
// 是否是移动标注线
const isMovingLine = ref(false)
const handleIsMovingLine = (_: boolean) => (isMovingLine.value = _)
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
