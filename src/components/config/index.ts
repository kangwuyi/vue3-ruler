import { type InjectionKey, type Reactive, type Ref } from 'vue'
// --------
export const DEFAULT_THEME: any = {
  bgColor: '#171a24', // ruler bg color
  // 刻度尺
  longfgColor: '#3B3B3B', // ruler longer mark color
  shortfgColor: '#3B3B3B', // ruler shorter mark color
  fontColor: '#ffffff4d', // ruler font color
  shadowColor: '#3275ff1a', // ruler shadow color
  lineColor: '#E02020',
  borderColor: '#3B3B3B',
  cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
}
// ----- ts ------
// ------------------- line -----------
// https://cn.vuejs.org/guide/typescript/composition-api#typing-provide-inject
export interface IFLineList {
  horizontal: number[]
  vertical: number[]
}

export interface IFLineListProvide {
  lineList: Reactive<IFLineList>
  updateLineList: Function
}

export const lineListKey: InjectionKey<IFLineListProvide> = Symbol('lineList')

export const DEFAULT_LINELIST = {
  lineList: {
    horizontal: [] as number[],
    vertical: [] as number[],
  },
  updateLineList: () => {},
}
// ---------- drawRuler options ----------
export interface IFDrawRulerOption {
  scale: number
  ratio: number
  width: number
  height: number
}

// --------- rect -----------
export interface IFRect {
  x: number
  y: number
  width: number
  height: number
}
export const DEFAULT_RECT = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}
export const rectKey: InjectionKey<Reactive<IFRect>> = Symbol('rect')
// ---- Ratio -------
export const DEFAULT_WDP_RATIO = window.devicePixelRatio || 1
export const wdpRatioKey = Symbol('wdpRatio') as InjectionKey<Ref<number>>
// ---- scale -------
export const DEFAULT_SCALE_FIGURE = 1
export const scaleFigureKey = Symbol('scaleFigure') as InjectionKey<Ref<number>>
