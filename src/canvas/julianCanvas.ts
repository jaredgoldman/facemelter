import Canvas from 'canvas'
import { MessageAttachment } from 'discord.js'
import { Player } from '../types'
import { asyncForEach } from '../utils/sharedUtils'

const renderMelt = async (damage: number, imageName: string) => {
  // Initialization
  // const damage = interaction.options.getInteger('damage')

  const cOutput = Canvas.createCanvas(1000, 1000)
  const ctxOutput = cOutput.getContext('2d')

  const cSource = Canvas.createCanvas(1000, 1000)
  const ctxSource = cSource.getContext('2d')

  const cMap = Canvas.createCanvas(1000, 1000)
  const ctxMap = cMap.getContext('2d')

  const assetImageSource = await Canvas.loadImage(`src/images/${imageName}`)
  const mapImageSource = await Canvas.loadImage(
    'src/images/melt-reference-with-gradient.png'
  )

  const cw = 1000
  const ch = 1000

  ctxOutput.createImageData(cw, ch)
  ctxOutput.createImageData(cw, ch)
  const outputData = ctxOutput.createImageData(cw, ch)

  const sourceImg = assetImageSource
  const mapImg = mapImageSource

  ctxSource.drawImage(sourceImg, 0, 0)
  const sourceData = ctxSource.getImageData(0, 0, cw, ch).data

  ctxMap.drawImage(mapImg, 0, 0)
  const mapData = ctxMap.getImageData(0, 0, cw, ch).data

  // Melting Time

  const dy = damage * -1
  // const dx = 0

  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      // Get the greyscale value from the displacement map as a value between 0 and 1
      // 0 = black (farthest), 1 = white (nearest)
      // Higher values will be more displaced

      const pix = y * cw + x
      const arrayPos = pix * 4
      const depth = mapData[arrayPos] / 255

      // Use the greyscale value as a percentage of our current drift
      // and calculate an y pixel offset based on that
      let ofs_x = x
      let ofs_y = Math.round(y + dy * depth)

      // Clamp the offset to the canvas dimenstions
      if (ofs_x < 0) ofs_x = 0
      if (ofs_x > cw - 1) ofs_x = cw - 1
      if (ofs_y < 0) ofs_y = 0
      if (ofs_y > ch - 1) ofs_y = ch - 1

      // Get the colour from the source image at the offset xy position,
      // and transfer it to our output at the original xy position
      const targetPix = ofs_y * cw + ofs_x
      const targetPos = targetPix * 4

      outputData.data[arrayPos] = sourceData[targetPos]
      outputData.data[arrayPos + 1] = sourceData[targetPos + 1]
      outputData.data[arrayPos + 2] = sourceData[targetPos + 2]
      outputData.data[arrayPos + 3] = sourceData[targetPos + 3]
    }
  }
  // ctxOutput.putImageData(outputData, 0, 0)

  // interaction.reply({ files: [attachment] })
  // return new MessageAttachment(cOutput.toBuffer(), `test.jpg`)
  return outputData
}

export const renderMelts = async (players: Player[]) => {
  const canvas = Canvas.createCanvas(1000, players.length * 1000)
  const ctx = canvas.getContext('2d')
  await asyncForEach(players, async (player: Player, index: number) => {
    const meltDamage = (100 - player.hp) * 5
    const meltCanvas = await renderMelt(meltDamage, player.asset.assetName)
    ctx.putImageData(meltCanvas, 0, index * 1000)
  })
  return new MessageAttachment(canvas.toBuffer(), `test.jpg`)
}
