import { type InjectionKey, type Reactive, type Ref } from 'vue'
// --------
export const DEFAULT_THEME: any = {
  bgColor: 'rgba(225,225,225, 0)', // ruler bg color
  longfgColor: '#BABBBC', // ruler longer mark color
  shortfgColor: '#C8CDD0', // ruler shorter mark color
  fontColor: '#7D8694', // ruler font color
  shadowColor: '#E8E8E8', // ruler shadow color
  lineColor: '#EB5648',
  borderColor: '#DADADC',
  cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
  menu: {
    bgColor: '#fff',
    dividerColor: '#DBDBDB',
    listItem: {
      textColor: '#415058',
      hoverTextColor: '#298DF8',
      disabledTextColor: 'rgba(65, 80, 88, 0.4)',
      bgColor: '#fff',
      hoverBgColor: '#F2F2F2',
    },
  },
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

// --------- shadow -----------
export interface IFRect {
  x: number
  y: number
  width: number
  height: number
}
// ---- Ratio -------
export const DEFAULT_WDP_RATIO = window.devicePixelRatio || 1
export const wdpRatioKey = Symbol('wdpRatio') as InjectionKey<Ref<number>>
// ---- scale -------
export const DEFAULT_SCALE_FIGURE = 1
export const scaleFigureKey = Symbol('scaleFigure') as InjectionKey<Ref<number>>
