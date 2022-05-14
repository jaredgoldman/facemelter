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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const canvas_1 = __importDefault(require("canvas"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const promises_1 = require("fs/promises");
const canvas = canvas_1.default.createCanvas(0, 0);
const ctx = canvas.getContext('2d');
const findMostFrequentColors = (numOfColors, coordinates) => {
    const colors = readColors(coordinates);
    const colorArray = Object.entries(colors);
    const mostFrequentColors = colorArray
        .filter((color) => color[1] > 1)
        .sort((a, b) => a[1] - b[1]);
    const colorsLength = mostFrequentColors.length;
    return mostFrequentColors
        .slice(colorsLength - numOfColors)
        .map((color) => color[0]);
};
const readColors = (coordinates) => {
    const { startX, endX, startY, endY } = coordinates;
    const colors = {};
    for (let x = startX; x <= endX; x++) {
        for (let y = startY; y >= endY; y--) {
            const colorData = getPixelColor(x, y).cssValue;
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
const getPixelColor = (x, y) => {
    const faceColor = ctx.getImageData(x, y, 1, 1).data;
    const r = faceColor[0];
    const g = faceColor[1];
    const b = faceColor[2];
    return { string: `${r}-${g}-${b}`, cssValue: `rgb(${r}, ${g}, ${b})` };
};
const replyWithMelt = (interaction, firstReply) => __awaiter(void 0, void 0, void 0, function* () {
    interaction.deferReply();
    const attachment = new discord_js_1.MessageAttachment(canvas.toBuffer(), 'test-melt.png');
    if (firstReply) {
        yield interaction.reply({ files: [attachment] });
    }
    else {
        yield interaction.editReply({ files: [attachment] });
    }
    yield (0, utils_1.wait)(1000);
});
const cropMeltArea = (startX, startY, cropWidth, cropHeight) => __awaiter(void 0, void 0, void 0, function* () {
    const img = yield canvas_1.default.loadImage('src/images/cone.jpeg');
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, startX, startY, cropWidth, cropHeight, startX, startY, cropWidth, cropHeight * 2);
});
const downloadAndDraw = ({ assetUrl }, startX, startY) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageLocation = yield (0, utils_1.downloadFile)(assetUrl, 'src/images');
        const nft = yield (0, promises_1.readFile)(imageLocation);
        const nftImage = new canvas_1.default.Image();
        nftImage.src = nft;
        canvas.height = nftImage.height;
        canvas.width = nftImage.width;
        yield (0, utils_1.wait)(1000);
        ctx.drawImage(nftImage, startX, startY, canvas.width, canvas.height);
    }
    catch (error) {
        console.log(error);
    }
});
const main = (interaction, damage, asset) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction) {
    }
    else {
        yield downloadAndDraw(asset, 0, 0);
    }
    return canvas;
});
exports.main = main;
