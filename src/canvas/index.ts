import Canvas, { CanvasRenderingContext2D } from 'canvas'
import { MessageAttachment } from 'discord.js'
import { wait, downloadFile, asyncForEach } from '../utils/sharedUtils'
import { Asset } from '../types'
import { readFile } from 'fs/promises'
import { NftData, ImageData } from './types'
import { getPixelColor } from './canvasUtils'

// SETTINGS
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
      // This is the current area of the cone I've selected for melting,
      // Feel free to update and change any of these values
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

// Add NFT images to canvas
const drawNfts = async (assets: Asset[]) => {
  await asyncForEach(
    nftData.imageData,
    async ({ startX, startY, width, height }: ImageData, i: number) => {
      await downloadAndDraw(assets[i], startX, startY, width, height)
    }
  )
}

const drawMelt = async (meltNum: number) => {
  // For each image on the canvas
  await asyncForEach(nftData.imageData, async ({ meltData }: ImageData) => {
    /*
              *****************************
              ***** MELTING TIME BABY *****
              *****************************

      Currently I'm just drawing a bunch of circles here
      that offset on the y axis by the index every time 
      the loop is run.

      You can use some of the utils I've created for finding the most relevent 
      colors if you want

      Implement melting logic here

    */

    for (let i = 0; i < meltNum; i++) {
      const { startX, startY } = meltData
      ctx.fillStyle = getPixelColor(startX, startY, ctx).cssValue
      ctx.beginPath()
      ctx.arc(startX, startY + i, 100, 0, Math.PI * 2)
      ctx.closePath()
      ctx.fill()
    }
  })
}

const main = async (interaction: any, damage: number, assets: Asset[]) => {
  // Call this function from inside the game after every turn happens, use player damage inflicted to inform melting
  if (interaction) {
    // replyWithMelt()
  } else {
    await drawNfts(assets)
    await drawMelt(100)
  }
  return canvas
}

export { main }
