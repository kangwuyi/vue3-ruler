<template>
  <!-- 水平方向 -->
  <RulerWrapper
    :shadow="shadow"
    :vertical="false"
    :width="width"
    :height="thick"
    :thick="thick"
    :rollback="height"
    :start="startX"
    :scale="scale"
    :ratio="ratio"
    v-model:lineVisible="lineVisible"
  />
  <!-- 竖直方向 -->
  <RulerWrapper
    :shadow="shadow"
    :vertical="true"
    :width="thick"
    :height="height"
    :thick="thick"
    :rollback="width"
    :start="startY"
    :scale="scale"
    :ratio="ratio"
    v-model:lineVisible="lineVisible"
  />
  <span
    class=""
    :class="{
      'ruler-_-corner': true,
      'ruler-_-corner-active': cornerActive,
    }"
    :style="cornerStyle"
    @click="handleLineVisibleChange"
  ></span>
</template>

<script lang="ts" setup>
import { computed, defineProps, provide, reactive, ref, type PropType } from 'vue'
import RulerWrapper from './Ruler/wrapper.vue'
import { DEFAULT_THEME, type IFLineList, lineListKey, type IFShadow } from './config/index.ts'

const props = defineProps({
  scale: {
    type: Number,
    default: 1,
  },
  ratio: {
    type: Number,
    default: window.devicePixelRatio || 1,
  },
  thick: {
    type: Number,
    default: 16,
  },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  startX: {
    type: Number,
    default: 0,
  },
  startY: {
    type: Number,
    default: 0,
  },
  // 传入阴影部分，选中画布组件，在标尺中标注组件位置
  shadow: {
    type: Object as PropType<IFShadow>,
    default: () =>
      ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }) as IFShadow,
  },
  cornerActive: {
    type: Boolean,
    default: false,
  },
})
// ---- 标注线 ----------

const lineList = reactive<IFLineList>({
  // 横向
  horizontal: [],
  // 纵向
  vertical: [],
})
type lineActionType = 'del' | 'add'
type lineDirectionType = 'horizontal' | 'vertical'
const updateLineList = (f: lineDirectionType, t: lineActionType, i: number) => {
  console.log('-- updateLineList', f, t, i)
  if (t === 'del' && f === 'horizontal') lineList.horizontal.splice(i, 1)
  else if (t === 'del' && f === 'vertical') lineList.vertical.splice(i, 1)
  else if (t === 'add' && f === 'horizontal') lineList.horizontal.push(i)
  else if (t === 'add' && f === 'vertical') lineList.vertical.push(i)
}
provide(lineListKey, {
  lineList,
  updateLineList,
})
// --------------
const cornerStyle = computed(() => ({
  backgroundColor: DEFAULT_THEME.bgColor,
  width: `${props.thick}px`,
  height: `${props.thick}px`,
  borderRight: `1px solid ${DEFAULT_THEME.borderColor}`,
  borderBottom: `1px solid ${DEFAULT_THEME.borderColor}`,
}))

// 标注线 [展示|隐藏]
const lineVisible = ref<boolean>(false)
const handleLineVisibleChange = () => (lineVisible.value = !lineVisible.value)
</script>

<style lang="less">
.ruler-_-corner {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-sizing: content-box;
  &-active {
    background-color: white !important;
  }
}
</style>
