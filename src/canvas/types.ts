export interface CanvasLocation {
  startX: number
  endX: number
  startY: number
  endY: number
}

export type CanvasLocations = CanvasLocation[]

export interface RgbValues {
  cssValue: string
  string: string
}

export interface NftData {
  num: number
  cw: number
  ch: number
  imageData: ImageData[]
}

export interface ImageData {
  width: number
  height: number
  startX: number
  startY: number
  meltData: MeltData
}

export interface MeltData {
  startX: number
  endX: number
  startY: number
  endY: number
}
