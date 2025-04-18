<template>
  <div
    :class="{
      'ruler-_-line': true,
      'ruler-_-line-v': isVertical,
      'ruler-_-line-h': !isVertical,
    }"
    :style="lineStyle"
    @dblclick.stop.prevent="handleDelLine"
    @mousedown.stop.prevent="handleMouseDown"
    :tabindex="value"
  >
    <div class="action" :style="actionStyle">
      <span class="value">{{ cache }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  watch,
  computed,
  defineProps,
  defineEmits,
  ref,
  onMounted,
  inject,
  type CSSProperties,
} from 'vue'
import {
  DEFAULT_THEME,
  lineListCbKey,
  scaleFigureKey,
  DEFAULT_SCALE_FIGURE,
  type TUpdateLineList,
  ELineActionType,
  ELineDirectionType,
} from '../config/index.ts'

// ----- inject --------
const scaleFigure = inject(scaleFigureKey, ref(DEFAULT_SCALE_FIGURE))
const updateLineList = inject<TUpdateLineList>(lineListCbKey, () => {})

//------------
const emit = defineEmits(['onIsMovingStart', 'onIsMovingEnd', 'onUpdateLine'])
const { start, isVertical, rollback, value, thick } = defineProps({
  start: { type: Number, required: true },
  isVertical: { type: Boolean, required: true },
  rollback: { type: Number, required: true },
  value: { type: Number, required: true },
  thick: { type: Number, required: true },
})

const cache = ref<number>(value)

const lineStyle = computed<CSSProperties>(() => ({
  [isVertical ? 'top' : 'left']: `${(cache.value - start) * scaleFigure.value}px`,
  [isVertical ? 'borderTop' : 'borderLeft']: `1px solid ${DEFAULT_THEME.lineColor}`,
  // ns↕️ ew↔️
  cursor: isVertical ? 'ns-resize' : 'ew-resize',
  [isVertical ? 'width' : 'height']: `${rollback + thick}px`,
}))

const actionStyle = computed(() => ({
  [isVertical ? 'left' : 'top']: `${thick - (isVertical ? 22 : 22)}px`,
}))
// ------------
const handleMouseDown = (e: MouseEvent) => {
  emit('onIsMovingStart')
  const startD = isVertical ? e.clientY : e.clientX
  const initValue = cache.value
  // 使用防抖函数
  const onMove = (e: MouseEvent) => {
    console.log('move')
    const currentD = isVertical ? e.clientY : e.clientX
    const newValue = Math.round(initValue + (currentD - startD) / scaleFigure.value)
    cache.value = newValue
  }
  const onEnd = () => {
    emit('onIsMovingEnd')
    emit('onUpdateLine', cache.value)

    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)
}
// ----------
// 双击删除此线
const handleDelLine = () =>
  updateLineList(
    isVertical ? ELineDirectionType.VERTICAL : ELineDirectionType.HORIZONTAL,
    ELineActionType.DEL,
    value,
  )
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
