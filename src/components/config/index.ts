import type { InjectionKey, Reactive, Ref, ComputedRef } from 'vue'
// --------
export const DEFAULT_THEME: any = {
  bgColor: '#171a24', // ruler bg color
  // 刻度尺
  longfgColor: '#3B3B3B', // ruler longer mark color
  shortfgColor: '#3B3B3B', // ruler shorter mark color
  fontColor: '#f3f3f3', // ruler font color
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
export type TLineActionType = 'del' | 'add' | 'update'
export type TLineDirectionType = 'horizontal' | 'vertical'

export interface IFLineListByProps {
  type: TLineDirectionType
  value: number
}

export type TUpdateLineList = (f: TLineDirectionType, t: TLineActionType, i: number) => void

export const lineListCbKey: InjectionKey<TUpdateLineList> = Symbol('lineListCb')

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
export const rectKey: InjectionKey<ComputedRef<IFRect>> = Symbol('rect')
// ---- Ratio -------
export const DEFAULT_WDP_RATIO = window.devicePixelRatio || 1
export const wdpRatioKey = Symbol('wdpRatio') as InjectionKey<Ref<number>>
// ---- scale -------
export const DEFAULT_SCALE_FIGURE = 1
export const scaleFigureKey = Symbol('scaleFigure') as InjectionKey<Ref<number>>
