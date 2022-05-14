import Canvas, { CanvasRenderingContext2D } from 'canvas'
import { MessageAttachment } from 'discord.js'
import { wait, downloadFile } from '../utils'
import { Asset } from '../types'
import { readFile } from 'fs/promises'

// create canvas
const canvas = Canvas.createCanvas(0, 0)
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

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
