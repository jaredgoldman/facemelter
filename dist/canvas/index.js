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
const canvasUtils_1 = require("./canvasUtils");
const nftData = {
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
};
const canvas = canvas_1.default.createCanvas(0, 0);
const ctx = canvas.getContext('2d');
canvas.width = nftData.cw;
canvas.height = nftData.ch;
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
const downloadAndDraw = ({ assetUrl }, startX, startY, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageLocation = yield (0, utils_1.downloadFile)(assetUrl, 'src/images');
        const nft = yield (0, promises_1.readFile)(imageLocation);
        const nftImage = new canvas_1.default.Image();
        nftImage.src = nft;
        yield (0, utils_1.wait)(1000);
        ctx.drawImage(nftImage, startX, startY, width, height);
    }
    catch (error) {
        console.log(error);
    }
});
const drawNfts = (assets) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, utils_1.asyncForEach)(nftData.imageData, ({ startX, startY, width, height }, i) => __awaiter(void 0, void 0, void 0, function* () {
        yield downloadAndDraw(assets[i], startX, startY, width, height);
    }));
});
const drawMelt = (meltNum) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, utils_1.asyncForEach)(nftData.imageData, ({ meltData }) => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < meltNum; i++) {
            const { startX, startY } = meltData;
            ctx.fillStyle = (0, canvasUtils_1.getPixelColor)(startX, startY, ctx).cssValue;
            ctx.beginPath();
            ctx.arc(startX, startY + i, 100, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }));
});
const main = (interaction, damage, assets) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction) {
    }
    else {
        yield drawNfts(assets);
        yield drawMelt(100);
    }
    return canvas;
});
exports.main = main;
