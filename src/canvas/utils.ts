import { CanvasLocation, RgbValues } from './types'
import { Canvas, CanvasRenderingContext2D, loadImage } from 'canvas'

export const findMostFrequentColors = (
  numOfColors: number,
  coordinates: CanvasLocation,
  ctx: CanvasRenderingContext2D
) => {
  const colors = readColors(ctx, coordinates)

  const colorArray = Object.entries(colors)
  const mostFrequentColors = colorArray
    .filter((color) => color[1] > 1)
    .sort((a, b) => a[1] - b[1])

  const colorsLength = mostFrequentColors.length

  return mostFrequentColors
    .slice(colorsLength - numOfColors)
    .map((color) => color[0])
}

// return colors and number of instances from specific space
export const readColors = (
  ctx: CanvasRenderingContext2D,
  coordinates: CanvasLocation
) => {
  const { startX, endX, startY, endY } = coordinates
  const colors: { [key: string]: number } = {}
  // loops through columns it encounters
  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y >= endY; y--) {
      const colorData = getPixelColor(x, y, ctx).cssValue

      if (colors[colorData]) {
        colors[colorData]++
      } else {
        colors[colorData] = 1
      }
    }
  }
  return colors
}

const getPixelColor = (
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D
): RgbValues => {
  const faceColor = ctx.getImageData(x, y, 1, 1).data
  const r = faceColor[0]
  const g = faceColor[1]
  const b = faceColor[2]
  return { string: `${r}-${g}-${b}`, cssValue: `rgb(${r}, ${g}, ${b})` }
}

const cropMeltArea = async (
  startX: number,
  startY: number,
  cropWidth: number,
  cropHeight: number,
  canvas: Canvas,
  ctx: CanvasRenderingContext2D
) => {
  const img = await loadImage('src/images/cone.jpeg')
  canvas.height = img.height
  canvas.width = img.width
  ctx.drawImage(img, 0, 0)
  ctx.drawImage(
    img,
    startX,
    startY,
    cropWidth,
    cropHeight,
    startX,
    startY,
    cropWidth,
    cropHeight * 2
  )
}
