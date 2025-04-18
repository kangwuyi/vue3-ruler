<template>
  <div
    :class="{
      'ruler-_-line': true,
      'ruler-_-line-v': isVertical,
      'ruler-_-line-h': !isVertical,
    }"
    :style="[offset, borderCursor, sizeStyle]"
    @dblclick.stop.prevent="handleDelLine"
    @mousedown.stop.prevent="handleDown"
    :tabindex="index"
  >
    <div class="action" :style="actionStyle">
      <span class="value">{{ startValue }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits, ref, onMounted, inject, type CSSProperties } from 'vue'
import {
  DEFAULT_THEME,
  lineListKey,
  DEFAULT_LINELIST,
  scaleFigureKey,
  DEFAULT_SCALE_FIGURE,
} from '../config/index.ts'

// ----- scaleFigure --------
const scaleFigure = inject(scaleFigureKey, ref(DEFAULT_SCALE_FIGURE))
// ---------------

const { updateLineList } = inject(lineListKey, DEFAULT_LINELIST)

const startValue = ref(0)
onMounted(() => {
  startValue.value = props.value
})

const emit = defineEmits(['onMouseDown', 'onRelease'])

const props = defineProps({
  index: { type: Number, required: true },
  start: { type: Number, required: true },
  isVertical: { type: Boolean, required: true },
  rollback: { type: Number, required: true },
  value: { type: Number, required: true },
  thick: { type: Number, required: true },
})

const offset = computed<CSSProperties>(() => ({
  [props.isVertical ? 'top' : 'left']: `${(startValue.value - props.start) * scaleFigure.value}px`,
}))
const borderCursor = computed<CSSProperties>(() => ({
  [props.isVertical ? 'borderTop' : 'borderLeft']: `1px solid ${DEFAULT_THEME.lineColor}`,
  // ns↕️ ew↔️
  cursor: props.isVertical ? 'ns-resize' : 'ew-resize',
}))
const sizeStyle = computed<CSSProperties>(() => ({
  [props.isVertical ? 'width' : 'height']: `${props.rollback + props.thick}px`,
}))
const actionStyle = computed(() => ({
  [props.isVertical ? 'left' : 'top']: `${props.thick - (props.isVertical ? 22 : 22)}px`,
}))
// ------------
const handleDown = (e: MouseEvent) => {
  const startD = props.isVertical ? e.clientY : e.clientX
  const initValue = startValue.value
  emit('onMouseDown')
  // 锁定框选工具
  // props.$bus.$emit('selectFrameLock', true);

  // 使用防抖函数
  const onMove = (e: MouseEvent) => {
    console.log('move')
    const currentD = props.isVertical ? e.clientY : e.clientX
    const newValue = Math.round(initValue + (currentD - startD) / scaleFigure.value)
    startValue.value = newValue
  }
  const onEnd = () => {
    // 解锁框选工具
    // props.$bus.$emit('selectFrameLock', false);
    emit('onRelease', startValue.value, props.index)

    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
}

// ----------
// 双击删除此线
const handleDelLine = () =>
  updateLineList(props.isVertical ? 'vertical' : 'horizontal', 'del', props.index)
</script>

<style lang="less">
.ruler-_-line {
  position: absolute;
  &-v {
    width: 100%;
    left: 0;
    padding-top: 5px;

    .action {
      flex-direction: column;
    }
  }
  &-h {
    height: 100%;
    top: 0;
    padding-left: 2px;
  }

  &:focus {
    outline: none;
  }
  .action,
  .value {
    pointer-events: none;
    user-select: none;
  }
  .action {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
  }

  .value {
    // transform: scale(0.6);
    border-radius: 2px;
    color: #e06a6a;
    background: transparent;
    padding: 0 2px;
  }
}
</style>
