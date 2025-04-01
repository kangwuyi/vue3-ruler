import { DEFAULT_THEME, type IFDrawRulerOption, type IFRect } from '../config/index.ts'

// 标尺中每小格代表的宽度(根据scale的不同实时变化)
const getGridSize = (scale: number) => {
  if (scale <= 0.25) return 40
  if (scale <= 0.5) return 20
  if (scale <= 1) return 10
  if (scale <= 2) return 5
  if (scale <= 4) return 2
  return 1
}

const FONT_SCALE = 0.83 // 10 / 12

export const drawCanvaslRuler = (
  vertical: boolean,
  ctx: CanvasRenderingContext2D,
  start: number,
  rect: IFRect,
  options: IFDrawRulerOption,
) => {
  const { scale, width, height, ratio } = options
  const { bgColor, fontColor, shadowColor, longfgColor, shortfgColor } = DEFAULT_THEME
  console.log(scale, width, height, ratio)
  // 缩放ctx, 以简化计算
  ctx.scale(ratio, ratio)
  ctx.clearRect(0, 0, width, height)

  // 1. 画标尺底色
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  // 2. 画阴影
  // if (rect) {
  //   // 阴影起点坐标
  //   const pos = ((vertical ? rect.y : rect.x) - start) * scale
  //   // 阴影高度
  //   const shadowSize = (vertical ? rect.height : rect.width) * scale
  //   ctx.fillStyle = shadowColor

  //   const param1 = vertical ? 0 : pos
  //   const param2 = vertical ? pos : 0
  //   const param3 = vertical ? width : shadowSize
  //   const param4 = vertical ? shadowSize : height
  //   ctx.fillRect(param1, param2, param3, param4)
  // }

  const gridSize = getGridSize(scale) // 每小格表示的宽度
  const gridPixel = gridSize * scale
  const gridSize_10 = gridSize * 10 // 每大格表示的宽度
  const gridPixel_10 = gridSize_10 * scale

  const startValue = Math.floor(start / gridSize) * gridSize // 绘制起点的刻度(略小于start, 且是gridSize的整数倍)
  const startValue_10 = Math.floor(start / gridSize_10) * gridSize_10 // 长间隔单独绘制起点的刻度

  const offset = ((startValue - start) / gridSize) * gridPixel // 起点刻度距离ctx原点(start)的px距离
  const offset_10 = ((startValue_10 - start) / gridSize_10) * gridPixel_10 // 长间隔起点刻度距离ctx原点(start)的px距离
  const endValue = start + Math.ceil((vertical ? height : width) / scale) // 终点刻度(略超出标尺宽度即可)

  // 3. 画刻度和文字(因为刻度遮住了阴影)
  ctx.beginPath() // 一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制

  ctx.fillStyle = fontColor
  ctx.strokeStyle = longfgColor // 设置长间隔的颜色
  ctx.font = '"PingFang SC","Microsoft YaHei"'

  // 长间隔和短间隔需要两次绘制，才可以完成不同颜色的设置；分开放到两个for循环是为了节省性能，因为如果放到一个for循环的话，每次循环都会重新绘制操作dom
  // 绘制长间隔和文字
  for (let value = startValue_10, count = 0; value < endValue; value += gridSize_10, count += 1) {
    const xy = offset_10 + count * gridPixel_10 + 0.5

    if (vertical) ctx.moveTo(0, xy)
    else ctx.moveTo(xy, 0)

    ctx.save() // 这里先保存一下状态
    // 将原点转移到当前画笔所在点
    if (vertical) ctx.translate(width * 0.4, xy)
    else ctx.translate(xy, height * 0.4)

    if (vertical) {
      ctx.rotate(-Math.PI / 2) // 旋转 -90 度
    }

    ctx.scale(FONT_SCALE / ratio, FONT_SCALE / ratio) // 缩放至10px
    ctx.fillText(String(value), 4 * ratio, 9 * ratio) // 绘制文字
    // 回复刚刚保存的状态
    ctx.restore()
    if (vertical) ctx.lineTo((width * 15) / 16, xy)
    else ctx.lineTo(xy, (height * 15) / 16)
  }
  ctx.stroke() // 绘制
  ctx.closePath() // 长间隔和文字绘制关闭

  ctx.beginPath() // 开始绘制短间隔
  ctx.strokeStyle = shortfgColor

  for (let value = startValue, count = 0; value < endValue; value += gridSize, count += 1) {
    const xy = offset + count * gridPixel + 0.5
    if (vertical) ctx.moveTo(0, xy)
    else ctx.moveTo(xy, 0)

    if (value % gridSize_10 !== 0) {
      if (vertical) ctx.lineTo((width * 1) / 4, xy)
      else ctx.lineTo(xy, (height * 1) / 4)
    }
  }
  ctx.stroke()
  ctx.closePath()

  // 恢复ctx matrix
  ctx.setTransform(1, 0, 0, 1, 0, 0)
}
