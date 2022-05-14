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
exports.doMelt = void 0;
const canvas_1 = __importDefault(require("canvas"));
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const canvas = canvas_1.default.createCanvas(0, 0);
const ctx = canvas.getContext('2d');
const drawNfts = (player1, player2) => __awaiter(void 0, void 0, void 0, function* () {
    const img = yield canvas_1.default.loadImage('src/images/cone.jpeg');
    canvas.height = img.height;
    canvas.width = img.width * 2;
    ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, 1000, 0);
    ctx.font = '60px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(player1, canvas.width / 6.85, canvas.height / 6);
    ctx.fillText(player2, canvas.width / 1.525, canvas.height / 6);
});
const nftCoordinates = [
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
];
const drawMeltArea = (meltNum, coordinates) => {
    for (let x = 0; x < meltNum; x++) {
        const startX = coordinates.startX;
        const startY = coordinates.startY + x * 10;
        ctx.beginPath();
        ctx.fillStyle = findMostFrequentColors(1, coordinates)[0];
        ctx.arc(startX, startY, 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
};
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
const replyWithMelt = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    interaction.deferReply();
    const array = [...Array(10).keys()];
    yield (0, utils_1.asyncForEach)(array, (num) => __awaiter(void 0, void 0, void 0, function* () {
        const canvas = yield doMelt(num);
        const attachment = new discord_js_1.MessageAttachment(canvas.toBuffer(), 'test-melt.png');
        if (num === 0) {
            yield interaction.reply({ files: [attachment] });
        }
        else {
            yield interaction.editReply({ files: [attachment] });
        }
        yield (0, utils_1.wait)(1000);
    }));
});
const test = () => {
    canvas.height = 500;
    canvas.width = 500;
    for (let x = 0; x < 100; x++) {
        ctx.beginPath();
        ctx.arc(300, 300, 30, 0, Math.PI * 2, false);
        ctx.stroke;
    }
};
const cropMeltArea = (startX, startY, cropWidth, cropHeight) => __awaiter(void 0, void 0, void 0, function* () {
    const img = yield canvas_1.default.loadImage('src/images/cone.jpeg');
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, startX, startY, cropWidth, cropHeight, startX, startY, cropWidth, cropHeight * 2);
});
const doMelt = (damage) => __awaiter(void 0, void 0, void 0, function* () {
    const { startX, endX, startY, endY } = nftCoordinates[0];
    const cropWidth = endX - startX;
    const cropHeight = endY - startY;
    yield cropMeltArea(startX, startY, cropWidth, cropHeight);
    console.log(ctx);
    return canvas;
});
exports.doMelt = doMelt;
