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
exports.renderMelts = void 0;
const canvas_1 = __importDefault(require("canvas"));
const discord_js_1 = require("discord.js");
const sharedUtils_1 = require("../utils/sharedUtils");
const renderMelt = (damage, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    const cOutput = canvas_1.default.createCanvas(1000, 1000);
    const ctxOutput = cOutput.getContext('2d');
    const cSource = canvas_1.default.createCanvas(1000, 1000);
    const ctxSource = cSource.getContext('2d');
    const cMap = canvas_1.default.createCanvas(1000, 1000);
    const ctxMap = cMap.getContext('2d');
    const assetImageSource = yield canvas_1.default.loadImage(`src/images/${imageName}`);
    const mapImageSource = yield canvas_1.default.loadImage('src/images/melt-reference-with-gradient.png');
    const cw = 1000;
    const ch = 1000;
    ctxOutput.createImageData(cw, ch);
    ctxOutput.createImageData(cw, ch);
    const outputData = ctxOutput.createImageData(cw, ch);
    const sourceImg = assetImageSource;
    const mapImg = mapImageSource;
    ctxSource.drawImage(sourceImg, 0, 0);
    const sourceData = ctxSource.getImageData(0, 0, cw, ch).data;
    ctxMap.drawImage(mapImg, 0, 0);
    const mapData = ctxMap.getImageData(0, 0, cw, ch).data;
    const dy = damage * -1;
    for (let y = 0; y < ch; y++) {
        for (let x = 0; x < cw; x++) {
            const pix = y * cw + x;
            const arrayPos = pix * 4;
            const depth = mapData[arrayPos] / 255;
            let ofs_x = x;
            let ofs_y = Math.round(y + dy * depth);
            if (ofs_x < 0)
                ofs_x = 0;
            if (ofs_x > cw - 1)
                ofs_x = cw - 1;
            if (ofs_y < 0)
                ofs_y = 0;
            if (ofs_y > ch - 1)
                ofs_y = ch - 1;
            const targetPix = ofs_y * cw + ofs_x;
            const targetPos = targetPix * 4;
            outputData.data[arrayPos] = sourceData[targetPos];
            outputData.data[arrayPos + 1] = sourceData[targetPos + 1];
            outputData.data[arrayPos + 2] = sourceData[targetPos + 2];
            outputData.data[arrayPos + 3] = sourceData[targetPos + 3];
        }
    }
    return outputData;
});
const renderMelts = (players) => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = canvas_1.default.createCanvas(1000, players.length * 1000);
    const ctx = canvas.getContext('2d');
    yield (0, sharedUtils_1.asyncForEach)(players, (player, index) => __awaiter(void 0, void 0, void 0, function* () {
        const meltDamage = (100 - player.hp) * 5;
        const meltCanvas = yield renderMelt(meltDamage, player.asset.assetName);
        ctx.putImageData(meltCanvas, 0, index * 1000);
    }));
    return new discord_js_1.MessageAttachment(canvas.toBuffer(), `test.jpg`);
});
exports.renderMelts = renderMelts;
