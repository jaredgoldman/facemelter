import Canvas, { CanvasRenderingContext2D } from 'canvas'
import { CanvasLocation, RgbValues } from './types'
import { MessageAttachment } from 'discord.js'
import { wait, downloadFile } from '../utils'
import { Asset } from '../types'
import { readFile } from 'fs/promises'

// create canvas
const canvas = Canvas.createCanvas(0, 0)
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

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

const replyWithMelt = async (
  interaction: any,
  firstReply: boolean
): Promise<void> => {
  interaction.deferReply()

  // Update canvas here to edit continuosly edit interaction

  const attachment = new MessageAttachment(canvas.toBuffer(), 'test-melt.png')
  if (firstReply) {
    await interaction.reply({ files: [attachment] })
  } else {
    await interaction.editReply({ files: [attachment] })
  }
  await wait(1000)
}

// Doesn't work, don't know why
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

// Download file from URL and draw to canvas
const downloadAndDraw = async (
  { assetUrl }: Asset,
  startX: number,
  startY: number
) => {
  try {
    const imageLocation: string = await downloadFile(assetUrl, 'src/images')
    const nft = await readFile(imageLocation)
    const nftImage = new Canvas.Image()
    nftImage.src = nft
    canvas.height = nftImage.height
    canvas.width = nftImage.width
    await wait(1000)
    ctx.drawImage(nftImage, startX, startY, canvas.width, canvas.height)
  } catch (error) {
    console.log(error)
  }
}

const main = async (interaction: any, damage: number, asset: Asset) => {
  // implement melt logic here and send canvas back OR pass the interaction in and manage from hrere
  if (interaction) {
    // replyWtihMelt()
  } else {
    await downloadAndDraw(asset, 0, 0)
  }
  return canvas
}

export { main }
