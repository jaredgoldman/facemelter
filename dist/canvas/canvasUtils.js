"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPixelColor = exports.readColors = exports.findMostFrequentColors = void 0;
const canvas_1 = require("canvas");
const findMostFrequentColors = (numOfColors, coordinates, ctx) => {
    const colors = (0, exports.readColors)(ctx, coordinates);
    const colorArray = Object.entries(colors);
    const mostFrequentColors = colorArray
        .filter((color) => color[1] > 1)
        .sort((a, b) => a[1] - b[1]);
    const colorsLength = mostFrequentColors.length;
    return mostFrequentColors
        .slice(colorsLength - numOfColors)
        .map((color) => color[0]);
};
exports.findMostFrequentColors = findMostFrequentColors;
const readColors = (ctx, coordinates) => {
    const { startX, endX, startY, endY } = coordinates;
    const colors = {};
    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y >= endY; y--) {
            const colorData = (0, exports.getPixelColor)(x, y, ctx).cssValue;
            if (colors[colorData]) {
                colors[colorData]++;
            }
            else {
                colors[colorData] = 1;
            }
        }
    }
    return colors;
};
exports.readColors = readColors;
const getPixelColor = (x, y, ctx) => {
    const faceColor = ctx.getImageData(x, y, 1, 1).data;
    const r = faceColor[0];
    const g = faceColor[1];
    const b = faceColor[2];
    return { string: `${r}-${g}-${b}`, cssValue: `rgb(${r}, ${g}, ${b})` };
};
exports.getPixelColor = getPixelColor;
const cropMeltArea = (startX, startY, cropWidth, cropHeight, canvas, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const img = yield (0, canvas_1.loadImage)('src/images/cone.jpeg');
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, startX, startY, cropWidth, cropHeight, startX, startY, cropWidth, cropHeight * 2);
});
