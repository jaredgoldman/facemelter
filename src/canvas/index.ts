import Canvas, { CanvasRenderingContext2D } from 'canvas'
import { MessageAttachment } from 'discord.js'
import { wait, downloadFile, asyncForEach } from '../utils'
import { Asset } from '../types'
import { readFile } from 'fs/promises'
import { NftData, ImageData } from './types'
import { getPixelColor } from './canvasUtils'

const nftData: NftData = {
  num: 2,
  cw: 2000,
  ch: 1000,
  imageData: [
    {
      width: 1000,
      height: 1000,
      startX: 0,
      startY: 0,
      meltData: {
        startX: 400,
        endX: 510,
        startY: 390,
        endY: 389,
      },
    },
    {
      width: 1000,
      height: 1000,
      startX: 1000,
      startY: 0,
      meltData: {
        startX: 1400,
        endX: 1510,
        startY: 390,
        endY: 389,
      },
    },
  ],
}

// create canvas
const canvas = Canvas.createCanvas(0, 0)
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
canvas.width = nftData.cw
canvas.height = nftData.ch

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

// Download file from URL and draw to canvas
const downloadAndDraw = async (
  { assetUrl }: Asset,
  startX: number,
  startY: number,
  width: number,
  height: number
) => {
  try {
    const imageLocation: string = await downloadFile(assetUrl, 'src/images')
    const nft = await readFile(imageLocation)
    const nftImage = new Canvas.Image()
    nftImage.src = nft
    await wait(1000)
    ctx.drawImage(nftImage, startX, startY, width, height)
  } catch (error) {
    console.log(error)
  }
}

const drawNfts = async (asset: Asset) => {
  await asyncForEach(
    nftData.imageData,
    async ({ startX, startY, width, height }: ImageData) => {
      await downloadAndDraw(asset, startX, startY, width, height)
    }
  )
}

const drawMelt = async (meltNum: number) => {
  // For each image on the canvas
  await asyncForEach(nftData.imageData, async ({ meltData }: ImageData) => {
    // Implement melt effect meltNum times
    for (let i = 0; i < meltNum; i++) {
      /*
        Currently I'm just drawing a bunch of circles here
        that offset on the y axis by the index every time 
        the loop is run.

        You can use some of the utils I've created for finding the most relevent 
        colors if you want

        This is likely where you'll want to implement the "melting" logic

      */
      const { startX, startY } = meltData
      ctx.fillStyle = getPixelColor(startX, startY, ctx).cssValue
      ctx.beginPath()
      ctx.arc(startX, startY + i, 100, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    }
  })
}

const main = async (interaction: any, damage: number, asset: Asset) => {
  // implement melt logic here and send canvas back OR pass the interaction in and manage from hrere
  if (interaction) {
    // replyWtihMelt(interaction, )
  } else {
    await drawNfts(asset)
    await drawMelt(100)
  }
  return canvas
}

export { main }
