import Canvas from 'canvas'
import { CanvasLocations, CanvasLocation, RgbValues } from './types'
import { MessageAttachment } from 'discord.js'
import { asyncForEach, wait } from '../utils'

// create canvas
const canvas = Canvas.createCanvas(0, 0)
const ctx = canvas.getContext('2d')

const drawNfts = async (player1: string, player2: string): Promise<void> => {
  const img = await Canvas.loadImage('src/images/cone.jpeg')
  canvas.height = img.height
  canvas.width = img.width * 2
  ctx.drawImage(img, 0, 0)
  ctx.drawImage(img, 1000, 0)
  ctx.font = '60px sans-serif'
  ctx.fillStyle = '#333'
  ctx.fillText(player1, canvas.width / 6.85, canvas.height / 6)
  ctx.fillText(player2, canvas.width / 1.525, canvas.height / 6)
}

// Data for finding faces
const nftCoordinates: CanvasLocations = [
  {
    startX: 400,
    endX: 510,
    startY: 390,
    endY: 389,
  },
  {
    startX: 1400,
    endX: 1510,
    startY: 390,
    endY: 389,
  },
]

const drawMeltArea = (meltNum: number, coordinates: CanvasLocation) => {
  for (let x = 0; x < meltNum; x++) {
    const startX = coordinates.startX
    const startY = coordinates.startY + x * 10
    ctx.beginPath()
    ctx.fillStyle = findMostFrequentColors(1, coordinates)[0]
    ctx.arc(startX, startY, 100, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
}

const findMostFrequentColors = (
  numOfColors: number,
  coordinates: CanvasLocation
) => {
  const colors = readColors(coordinates)

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
const readColors = (coordinates: CanvasLocation) => {
  const { startX, endX, startY, endY } = coordinates
  const colors: { [key: string]: number } = {}
  // loops through columns it encounters
  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y >= endY; y--) {
      const colorData = getPixelColor(x, y).cssValue

      if (colors[colorData]) {
        colors[colorData]++
      } else {
        colors[colorData] = 1
      }
    }
  }
  return colors
}

const getPixelColor = (x: number, y: number): RgbValues => {
  const faceColor = ctx.getImageData(x, y, 1, 1).data
  const r = faceColor[0]
  const g = faceColor[1]
  const b = faceColor[2]
  return { string: `${r}-${g}-${b}`, cssValue: `rgb(${r}, ${g}, ${b})` }
}

const replyWithMelt = async (interaction: any): Promise<void> => {
  interaction.deferReply()
  const array = [...Array(10).keys()]
  await asyncForEach(array, async (num: number) => {
    const canvas = await doMelt(num)
    const attachment = new MessageAttachment(canvas.toBuffer(), 'test-melt.png')
    if (num === 0) {
      await interaction.reply({ files: [attachment] })
    } else {
      await interaction.editReply({ files: [attachment] })
    }
    await wait(1000)
  })
}

const test = () => {
  canvas.height = 500
  canvas.width = 500
  for (let x = 0; x < 100; x++) {
    ctx.beginPath()
    ctx.arc(300, 300, 30, 0, Math.PI * 2, false)
    ctx.stroke
  }
}

const cropMeltArea = async (
  startX: number,
  startY: number,
  cropWidth: number,
  cropHeight: number
) => {
  const img = await Canvas.loadImage('src/images/cone.jpeg')
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

const doMelt = async (damage: number) => {
  // await drawNfts('RANDY AL', 'Algorandpa')
  // nftCoordinates.forEach((coordinates) => drawMeltArea(damage, coordinates))
  const { startX, endX, startY, endY } = nftCoordinates[0]
  const cropWidth = endX - startX
  const cropHeight = endY - startY
  await cropMeltArea(startX, startY, cropWidth, cropHeight)
  console.log(ctx)
  // await asyncForEach(
  //   nftCoordinates,
  //   async ({ startX, endX, startY, endY }: CanvasLocation) => {
  //     const cropWidth = endX - startX
  //     const cropHeight = endY - startY
  //     await cropMeltArea(startX, startY, cropWidth, cropHeight)
  //   }
  // )

  return canvas
}

export { doMelt }
